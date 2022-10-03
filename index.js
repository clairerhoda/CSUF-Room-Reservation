const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries')
const port = 3000

const cors = require('cors')
app.use(cors())


app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser)
app.get('/rooms', db.getAllRooms)
app.get('/rooms/:capacity', db.getAvailableRooms)
app.get('/rooms/:id', db.getRoomById)
app.post('/rooms', db.createRoom)
app.get('/reservations/:userId', db.getReservationsByUser)
app.get('/reservations/:id', db.getReservationById)
app.post('/reservations/', db.createReservation)
app.put('/reservations/:id', db.updateReservation)
// app.delete('/users/:id', db.deleteUser)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})