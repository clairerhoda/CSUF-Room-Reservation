# CSUFRoomReservation
-- Project By Adrian Puentes and Claire Rhoda

This website application allows students to reserve study rooms that are 
available in the Pollak Library through a reservation system. Students 
must log-in using their CSUF login credentials in order to reserve a 
room. Each student can reserve a room in 30 minutes increments with a 
3 hour reservation limit. Rooms that are available can be sorted 
based on room capacity. The web application allows users to make a 
reservation by selecting the number of people reserving the room and selecting
how long the room will be reserved for. The user will then be promoted with 
every possible reservation they can make with the times available for the
next 2 weeks. Last step is to review the reservation details and to select
confirm. Users can view their past and current reservations by selecting the
"Configure Reservations" button found in the home page. Users can delete a
reservation up to one hour before the reservation start time has passed.

This website is created using HTML / CSS / JavaScript / PostgreSQL / NodeJS.

Steps to Run Website on Linux
1. Enter the command: sudo apt install nodejs 
2. Enter the command to run the Rest Server: node indexRest
    (make sure you are in the location of the pulled folder)
3. Start website using: https://roomreservationbucket.s3.amazonaws.com/home.html

Troubleshooting with Database (how to run environment locally)
1. Download pgAdmin4 https://www.pgadmin.org/download/ 
2. Once it's done downloading, open the application and enter a master password (this is also creating your password so make sure to remember it) 
3. On the left side of pgAdmin click 'Servers(1)', it will ask you to enter that password you created from step 2. 
4. Now you have access to create a database. Under Servers(1) > Postgres right click Databases > Create. 
5. Define a new database as 'Room_Reservation' as click 'Save'. 
6. Click the new database you have created to get it running. 
7. Now right click the Room_reservation db and select CREATE Script. 
8. From the source code, copy the contents of database.sql into the pgAdmin script you just created. 
9. In pgAdmin4, hit the 'Execute/Refresh' play button to build the table you copied over from the source code. 
10. Next, copy the contents of insertRooms.sql and insertUsers.sql into the script in pgAdmin and highlight the copied contents of each INSERT and click 'Execute/Refresh' once again to insert the fake data. 
11. In queries.js, comment out:
 ```const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.PORT,
});```
and uncomment:
```const pool = new Pool({
  database: 'Room_Reservation',
  port: 5432,
});
```
12. Now with our database running locally, we need to run the website locally as well since we changed the code. In one terminal, run the command ‘node index.js’. In a separate terminal simultaneously, run the command ‘node indexRest.js’.
13. Finally, with everything running locally, we can start our website here: http://localhost:4000/home.html (use the  credentials email:test-user@csu.fullerton.edu --- password: password123)

