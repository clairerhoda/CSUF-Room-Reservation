const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Room_Reservation',
  password: 'chese21',
  port: 5432,
})
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
  pool.query('SELECT * FROM users WHERE user_id = $1', [id], (error, results) => {
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

//this is for test purposes to create fake users
const createUser = (request, response) => {
  const { email, password_hash, phone, first_name, last_name, is_deleted } = request.body;
  pool.query('INSERT INTO users (email, password_hash, phone, first_name, last_name, is_deleted) VALUES ($1, $2, $3, $4, $5, $6)', [ email, password_hash, phone, first_name, last_name, is_deleted ], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`User added`)
  })
}

const getAvailableRooms = (request, response) => {
  const capacity = parseInt(request.params.capacity);

  pool.query(`SELECT * FROM rooms WHERE capacity > ${capacity}`, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getAllRooms = (request, response) => {
  pool.query('SELECT * FROM rooms ORDER BY room_id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getRoomById = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query('SELECT * FROM rooms WHERE room_id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

//this is for test purposes to create fake rooms
const createRoom = (request, response) => {
  const { floor, room_number, capacity, description, reservation_lock } = request.body;
  pool.query('INSERT INTO rooms (floor, room_number, capacity, description, reservation_lock) VALUES ($1, $2, $3, $4, $5)', [ floor, room_number, capacity, description, reservation_lock ], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Room added`)
  })
}

const getReservationsByUser = (request, response) => {
  const userId = parseInt(request.params.userId);
  pool.query('SELECT * FROM reservations WHERE user_id = $1 ORDER BY start_time ASC', [userId], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createReservation = (request, response) => {
  const { room_id, user_id, start_time, end_time, purpose, number_of_people, created_at, is_deleted } = request.body
  pool.query('INSERT INTO reservations (room_id, user_id, start_time, end_time, purpose, number_of_people, created_at, is_deleted) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [ room_id, user_id, start_time, end_time, purpose, number_of_people, created_at, is_deleted ], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Reservation added`);
  })
}

// "deletes" reservation
const updateReservation = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query('UPDATE reservations SET is_deleted = true WHERE reservation_id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Reservation updated`);
  })
}

const checkReservationAvailability = (request, response) => {
  const startRange = request.params.startRange;
  const endRange = request.params.endRange;
  const reservationTime = request.params.reservationTime;
  pool.query(
    `SELECT available_time FROM 
    (
      SELECT start_time, end_time from reservations r 
      WHERE r.start_time >= timezone('utc', now())
      AND r.end_time < timezone('utc', now()) + interval '1 day' 
      GROUP BY start_time, end_time
    ) rsv
        RIGHT OUTER JOIN 
    (
      SELECT generate_series($1::TIMESTAMP, 
        $2::TIMESTAMP,  
        '30 minutes'::interval) AS available_time
    ) series
    ON series.available_time BETWEEN rsv.start_time AND rsv.end_time
    WHERE rsv.start_time IS NULL AND rsv.end_time IS NULL
    AND series.available_time + CONCAT($3::INT, ' minutes')::interval <= $2::TIMESTAMP`,
    [startRange, endRange, reservationTime], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

module.exports = {
  getUsers,
  getUserById,
  getCreds,
  createUser,
  getAvailableRooms,
  getAllRooms,
  getRoomById,
  createRoom,
  getReservationsByUser,
  createReservation,
  updateReservation,
  checkReservationAvailability,
}