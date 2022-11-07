/*
    Fake users are created with these DML statements.
    These users act like CSUF credentials and are needed
    in order for a user to create a room reservation
    that is linked to their account.
*/

INSERT INTO users (email, password_hash, phone, 
first_name, last_name, is_deleted)
VALUES ('clairehrhoda@csu.fullerton.edu', 'password123', 
'+19491234567', 'Claire', 'Rhoda', false);

INSERT INTO users (email, password_hash, phone, 
first_name, last_name, is_deleted)
VALUES ('apuentes1@csu.fullerton.edu', 'password123', 
'+19492345678', 'Adrian', 'Puentes', false);