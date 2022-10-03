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

const getReservationById = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query('SELECT * FROM reservations WHERE reservation_id = $1', [id], (error, results) => {
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

const updateReservation = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query('UPDATE reservations SET is_deleted = true WHERE reservation_id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Reservation updated`);
  })
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  getAvailableRooms,
  getAllRooms,
  getRoomById,
  createRoom,
  getReservationsByUser,
  getReservationById,
  createReservation,
  updateReservation,
}