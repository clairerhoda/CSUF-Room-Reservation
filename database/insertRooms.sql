/*
    This SQL code is used to create our rooms in the database.
    The rooms vary based on capacity, utilities, and location.
    Rooms must be added to database before user can use the 
    website to reserve a room. (Can't reserve a room if the
    room doesn't exist!)
*/

INSERT INTO rooms (floor, room_number, capacity, description) 
VALUES ('3', 'PLN-111', '5', '1 table, 5 chairs, 1 TV');

INSERT INTO rooms (floor, room_number, capacity, description) 
VALUES ('3', 'PLN-112', '10', '1 table, 10 chairs, 1 TV');

INSERT INTO rooms (floor, room_number, capacity, description) 
VALUES ('3', 'PLN-114', '12', '2 tables, 12 chairs, 1 TV');

INSERT INTO rooms (floor, room_number, capacity, description) 
VALUES ('3', 'PLN-215', '5', '1 table, 5 chairs, 1 TV');

INSERT INTO rooms (floor, room_number, capacity, description) 
VALUES ('3', 'PLN-311', '5', '1 table, 5 chairs, 1 TV');

INSERT INTO rooms (floor, room_number, capacity, description) 
VALUES ('3', 'PLN-312', '10', '1 table, 10 chairs, 1 TV');

INSERT INTO rooms (floor, room_number, capacity, description) 
VALUES ('3', 'PLN-314', '14', '2 tables, 14 chairs, 1 TV');