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
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM users WHERE user_id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

//this is for test purposes to create fake users
const createUser = (request, response) => {
  const { email, password_hash, phone, first_name, last_name, is_deleted } = request.body
  pool.query('INSERT INTO users (email, password_hash, phone, first_name, last_name, is_deleted) VALUES ($1, $2, $3, $4, $5, $6)', [ email, password_hash, phone, first_name, last_name, is_deleted ], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`User added`)
  })
}

const getRooms = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY room_id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

//this is for test purposes to create fake rooms
const createRoom = (request, response) => {
  const { floor, room_number, capacity, description, reservation_lock } = request.body
  pool.query('INSERT INTO rooms (floor, room_number, capacity, description, reservation_lock) VALUES ($1, $2, $3, $4, $5)', [ floor, room_number, capacity, description, reservation_lock ], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Room added`)
  })
}

const getReservations = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY reservation_id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

//this is for test purposes to create fake rooms
const createReservation = (request, response) => {
  const { room_id, user_id, start_time, end_time, purpose, number_of_people, created_at, is_deleted } = request.body
  pool.query('INSERT INTO rooms (room_id, user_id, start_time, end_time, purpose, number_of_people, created_at, is_deleted) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [ room_id, user_id, start_time, end_time, purpose, number_of_people, created_at, is_deleted ], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Reservation added`)
  })
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  getRooms,
  createRoom,
  getReservations,
  createReservation,
}