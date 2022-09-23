-- Database: Room_Reservation
-- DROP DATABASE "Room_Reservation";

CREATE DATABASE "Room_Reservation"
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;
	
-- creates unique id
CREATE OR REPLACE FUNCTION pseudo_encrypt(VALUE int) returns int AS $$
DECLARE
l1 int;
l2 int;
r1 int;
r2 int;
i int:=0;
BEGIN
 l1:= (VALUE >> 16) & 65535;
 r1:= VALUE & 65535;
 WHILE i < 3 LOOP
   l2 := r1;
   r2 := l1 # ((((1366 * r1 + 150889) % 714025) / 714025.0) * 32767)::int;
   l1 := l2;
   r1 := r2;
   i := i + 1;
 END LOOP;
 RETURN ((r1 << 16) + l1);
END;
$$ LANGUAGE plpgsql strict immutable;

CREATE SEQUENCE seq maxvalue 2147483647;

CREATE TABLE users	(
	user_id INT DEFAULT pseudo_encrypt(nextval('seq')::INT) UNIQUE PRIMARY KEY NOT NULL,
	email VARCHAR(50) NOT NULL,
	password_hash VARCHAR(50) NOT NULL,
	phone VARCHAR(20) NOT NULL,
	first_name VARCHAR(50) NOT NULL,
	last_name VARCHAR(50) NOT NULL,
	is_deleted BOOL NOT NULL
);

CREATE TABLE rooms (
	room_id INT DEFAULT pseudo_encrypt(nextval('seq')::INT) UNIQUE PRIMARY KEY NOT NULL,
	floor INT,
	room_number INT,
	capacity INT NOT NULL,
	description TEXT,
	reservation_lock BOOL NOT NULL
);


CREATE TABLE reservations	(
	reservation_id INT DEFAULT pseudo_encrypt(nextval('seq')::INT) UNIQUE PRIMARY KEY NOT NULL,
	room_id INT REFERENCES rooms (room_id),
	user_id INT REFERENCES users (user_id),
	start_time TIMESTAMP without time zone NOT NULL,
	end_time TIMESTAMP without time zone NOT NULL,
	purpose VARCHAR(100) NOT NULL,
	number_of_people INT NOT NULL,
	created_at TIMESTAMP without time zone DEFAULT now() NOT NULL,
	is_deleted BOOL NOT NULL
);

CREATE TABLE reservation_attendees	(
	reservation_id INT PRIMARY KEY REFERENCES reservations (reservation_id),
	user_id INT REFERENCES users (user_id)
);



-- SELECT * FROM users;
-- SELECT * FROM rooms;
-- SELECT * FROM reservations;
-- SELECT * FROM reservation_attendees;

-- DROP TABLE reservation_attendees;
-- DROP TABLE reservations;
-- DROP TABLE rooms;
-- DROP TABLE users;