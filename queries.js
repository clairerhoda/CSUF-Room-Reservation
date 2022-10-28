const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Room_Reservation',
  password: 'chese21',
  port: 5432,
});

const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY user_id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getUserById = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query('SELECT * FROM users WHERE user_id = $1',
     [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getCreds = (request, response) => {
  const email= request.params.email;
  const password = request.params.password_hash;
  pool.query('select * from users where email=$1 AND password_hash=$2', [email, password], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getAllRooms = (request, response) => {
  pool.query('SELECT * FROM rooms ORDER BY room_id ASC',
    (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  })
}

const getRoomById = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query('SELECT * FROM rooms WHERE room_id = $1', 
    [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  })
}

const getReservationsByUser = (request, response) => {
  const userId = parseInt(request.params.userId);
  pool.query(`SELECT * FROM reservations 
  WHERE user_id= $1 ORDER BY start_time ASC`, [userId], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  })
}

const createReservation = (request, response) => {
  const { room_id, user_id, start_time, end_time, 
    purpose, number_of_people, created_at, is_deleted } = request.body;
  pool.query(`INSERT INTO reservations (room_id, user_id, start_time,  
  end_time, purpose, number_of_people, created_at, is_deleted) VALUES
  ($1, $2, $3::TIMESTAMP WITH TIME ZONE, $4::TIMESTAMP WITH TIME ZONE, 
  $5, $6, $7::TIMESTAMP WITH TIME ZONE, $8)`, 
  [ room_id, user_id, start_time, end_time, purpose, 
    number_of_people, created_at, is_deleted ], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(201).send(`Reservation added`);
  })
}

// "deletes" reservation
const updateReservation = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query('UPDATE reservations SET is_deleted = ' + 
  'true WHERE reservation_id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(201).send(`Reservation updated`);
  })
}

const checkReservationAvailability = (request, response) => {
  const startRange = request.params.startRange;
  const endRange = request.params.endRange;
  const reservationTime = request.params.reservationTime;
  const capacity = request.params.capacity;
  pool.query(
    `SELECT available_time, series.room_id FROM 
    (
      SELECT start_time, end_time, room_id, is_deleted from reservations r 
      WHERE r.start_time >= $1::TIMESTAMP WITH TIME ZONE
      AND r.end_time <= $2::TIMESTAMP WITH TIME ZONE
      AND is_deleted = false 
      GROUP BY start_time, end_time, room_id, is_deleted
    ) rsv
        RIGHT OUTER JOIN 
    (
      SELECT * from generate_series($1::TIMESTAMP WITH TIME ZONE, 
      $2::TIMESTAMP WITH TIME ZONE,  
      '30 minutes'::interval) available_time,
      (SELECT room_id FROM ROOMS WHERE capacity >= $4) room_id
    ) series
    ON (series.available_time BETWEEN rsv.start_time AND rsv.end_time - interval '30 minute') 
    AND series.room_id = rsv.room_id
    WHERE rsv.start_time IS NULL
    AND (series.available_time + CONCAT($3::INT, ' minutes')::interval) < 
    $2::TIMESTAMP WITH TIME ZONE + interval '30 minute' 
    ORDER BY available_time`,
    [startRange, endRange, reservationTime, capacity], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  })
}

const getNextAvailableRoom = (request, response) => {
  const startRange = request.params.startRange;
  const endRange = request.params.endRange;
  const reservationTime = request.params.reservationTime;
  const capacity = request.params.capacity;
  pool.query(
    `SELECT available_time, series.room_id FROM 
    (
      SELECT start_time, end_time, room_id, is_deleted from reservations r 
      WHERE r.start_time >= $1::TIMESTAMP WITH TIME ZONE
      AND r.end_time <= $2::TIMESTAMP WITH TIME ZONE
      AND is_deleted = false
      GROUP BY start_time, end_time, room_id, is_deleted
    ) rsv
        RIGHT OUTER JOIN 
    (
      SELECT * from generate_series($1::TIMESTAMP WITH TIME ZONE, 
        $2::TIMESTAMP WITH TIME ZONE,  
      '30 minutes'::interval) available_time, 
      (SELECT room_id FROM ROOMS WHERE capacity >= $4) room_id
    ) series
    ON (series.available_time BETWEEN $1::TIMESTAMP WITH TIME ZONE AND $2::TIMESTAMP WITH TIME ZONE ) 
    AND series.room_id = rsv.room_id
    WHERE rsv.start_time IS NULL 
    AND (series.available_time + CONCAT($3::INT, ' minutes')::interval) <=
    $2::TIMESTAMP WITH TIME ZONE + interval '30 minute' 
    ORDER BY available_time`,
  [startRange, endRange, reservationTime, capacity], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  })
}

module.exports = {
  getUsers,
  getUserById,
  getCreds,
  getAllRooms,
  getRoomById,
  getReservationsByUser,
  createReservation,
  updateReservation,
  checkReservationAvailability,
  getNextAvailableRoom,
}