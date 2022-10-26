const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./queries');
const port = 3000;

const cors = require('cors');
app.use(cors());


app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' });
})

app.get('/users', db.getUsers);
app.get('/users/:id', db.getUserById);
app.get('/users/:email/:password_hash', db.getCreds)
app.get('/rooms', db.getAllRooms);
app.get('/rooms/:capacity', db.getAvailableRooms);
app.get('/room/:id', db.getRoomById);
app.get('/reservations/:userId', db.getReservationsByUser);
app.post('/reservations/', db.createReservation);
app.put('/reservations/:id', db.updateReservation);
app.get('/reservations/:startRange/:endRange/:reservationTime', db.checkReservationAvailability);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
})