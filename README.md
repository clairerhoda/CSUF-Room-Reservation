# CSUFRoomReservation
/*
*Program:	CSUF Study Room Reservation
*Authors:	Claire Rhoda & Adrian Puentes
*Emails: clairehrhoda@csu.fullerton.edu apuentes1@csu.fullerton.edu
*Dependancies:	Web Browser, NodeJS, PostgreSQL, Express, CORS
*License:	FreeBSD
*
*Copyright 1992-2022 The FreeBSD Project.
*Redistribution and use in source and binary forms, with or without modification, are 
*permitted provided that the following conditions are met:
*Redistributions of source code must retain the above copyright notice, this list
*of conditions and the following disclaimer.
*Redistributions in binary form must reproduce the above copyright notice,
*this list of conditions and the following disclaimer
*in the documentation and/or other materials provided with the distribution.
*
**THIS SOFTWARE IS PROVIDED BY THE AUTHOR AND CONTRIBUTORS "AS IS" AND
*ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
*IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
*PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS
*BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
*CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
*SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
*HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
*OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
*SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*
*The views and conclusions contained in the software and documentation are those of
*the authors and should not be interpreted as representing official policies, either
*expressed or implied, of the FreeBSD Project.
*	
*
*Description:
*The purpose of this web application is to assist student in 
*reserving a study room. The student can reserve a room in 30 minute
*increments with a max limit of 3 hours. The student can reserve a
*specific room based on the number of occupants and avalibilty.
*After confirmation of reservation the student can review current and
*past reservations. The student may also cancel a reservation up to 
*one hour prior to the reservation start time.
*
*/

Steps to Run Website on Linux
1. Enter the command: sudo apt install nodejs 
2. Enter the command to run the Rest Server: node indexRest
    (make sure you are in the location of the pulled folder)
    It should say "server started on port 3000" in your terminal
3. Start website using: https://roomreservationbucket.s3.amazonaws.com/home.html
4. Use the credentials to login as a fake user:
  email: test-user@csu.fullerton.edu
  password: password123
