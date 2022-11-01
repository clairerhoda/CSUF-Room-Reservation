# CSUFRoomReservation
-- Projet By Adrian Puentes and Claire Rhoda

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
Configure Reservations button found in the home page. Users can delete a
reservation at any point before the reservation time is passed.

This website is created using HTML / CSS / JavaScript / PostgreSQL.

Steps
1. npm install express --save
2. npm install --save-dev cors
3. In one terminal enter the command to run the Rest Server: node indexRest
4. In a different terminal enter the command to run the Rest Client: node index
5. Start website using: http://localhost:4000/home.html 