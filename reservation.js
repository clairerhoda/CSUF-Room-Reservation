
/*
    This JavaScript file is responsible for reservation creation from the user.
    It allows the user to select avaialble date and times for a reservation
 */

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
}

const nextButton = document.getElementById("next-btn");
let pageNumber = 1;
let selected = false;

const backButton = document.getElementById("back-btn");

const form = document.getElementById("form");
const selectionDescription = document.getElementById("selection-description");
const studentCount = document.getElementById("student-amount");
var reservationDate;
const halfHourIncrements = document.getElementById("half-hour-increm");
const dateStart = document.getElementById("date-start");
const dateSelectionTable = document.getElementById("date-selection-table");
var startTime;
var endTime;

function timeConvert(n) {
    var num = n;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    var mText =  " 30 minutes";
    var hText = rhours + " hours";
    if (rminutes == 0) {
        mText = "";
    } 

    if (rhours == 1) {
        hText = rhours + " hour";
    }

    if (rhours == 0) {
        hText = "";
    }

    return hText + mText;
}

backButton.addEventListener("click", (e) => {
    e.preventDefault();
    pageNumber--;

    if (pageNumber == 1) {
        backButton.style.display = "none";
        selectionDescription.textContent = "Select Number of Students (1-14)";
        studentCount.style.display = "flex";
        halfHourIncrements.style.display = "none";
        document.getElementById("invalidText").style.display = "none";
    }

    if (pageNumber == 2) {
        selectionDescription.textContent = 
            "How Long Do You Want to Reserve the Room?";
        halfHourIncrements.style.display = "flex";
        dateSelectionTable.style.display = "none";
        document.getElementById("invalidText").style.display = "none";
    }

    if (pageNumber == 3) {
        selectionDescription.textContent = "Select a Date";
        dateSelectionTable.style.display = "flex";
        document.getElementById("next-btn").textContent = "Next";
    }
})
 nextButton.addEventListener("click", (e) => {
    e.preventDefault();
    pageNumber++;
    
    // check if calendar date is selected
    var divs = document.querySelectorAll(".time-row");
        [].forEach.call(divs, function(div) {
            if (div.style.backgroundColor == "white") {
                selected = true;
                reservationDate = div.textContent;
            }
        });

    if (selected == false && pageNumber == 4) {
        document.getElementById("invalid-text").style.display = "flex";
        pageNumber = 3;
    } else {
        document.getElementById("invalid-text").style.display = "none";
    }

    if (pageNumber == 2) {
        backButton.style.display = "flex";
        selectionDescription.textContent =
            "How Long Do You Want to Reserve the Room?";
        document.getElementById("student-amount").style.display = "none";
        halfHourIncrements.style.display = "flex";
        var minutesIncrement = 30;

        if (halfHourIncrements.length == 0) {
            for (var j = 0; j < 6; j++) {
                var option = document.createElement("option");
                if (minutesIncrement > 30) {
                    option.text = timeConvert(minutesIncrement);
                } else {
                    option.text = minutesIncrement + " min";
                }

                option.value = minutesIncrement;
                halfHourIncrements.appendChild(option);
                minutesIncrement += 30;
            }
        }
    }

    if (pageNumber == 3) {
        selectionDescription.textContent = "Select a Date";
        halfHourIncrements.style.display = "none";
        dateSelectionTable.style.display = "flex";
        getCalendarDates(halfHourIncrements.value, studentCount.value);
    }

    if (pageNumber == 4) {
        var times  = document.querySelectorAll(".time-row");
        [].forEach.call(times, function(time) {
            if (time.style.backgroundColor == "white") {
                startTime = new Date(parseInt(time.id));
                endTime = new Date(new Date(parseInt(time.id)).getTime() +
                    parseInt(halfHourIncrements.value)*60000);
            }
        });

        dateSelectionTable.style.display = "none";
        var dateFormatted = (new Date(startTime).toLocaleDateString(
            'en-us', { 
                weekday:"long", year:"numeric", month:"long", 
                day:"numeric", hour: "numeric", minute:"numeric"
            }));
        selectionDescription.textContent = "You want to reserve a room for "
            + dateFormatted + " for " + 
            timeConvert(halfHourIncrements.value) + "?";
        document.getElementById("next-btn").textContent = "Confirm";
    }

    if (pageNumber == 5) {
        backButton.style.display = "none";
        const createdAt = new Date();
        const isDeleted = false;
        const purpose = ""; // may add purpose section later
        
        //remove after fetching
        const roomId = 1750691250;

        // add reservation to database
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `http://localhost:3000/reservations`);
        
        // store all times in db in UTC
        const rsObj = new ReservationDetails(
            roomId, getCookie("user_id"), startTime, endTime, 
            purpose, parseInt(studentCount.value), createdAt, isDeleted);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.responseType = 'json';
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log(this.response);
            }
        }
        // JSON encoding 
        const jsonStr = JSON.stringify(rsObj);
        xhr.send(jsonStr);

        var dateFormatted = (new Date(startTime).toLocaleDateString(
            'en-us', { 
                weekday:"long", year:"numeric", month:"long", 
                day:"numeric", hour: "numeric", minute:"numeric"
            }));
        var room = "SAMPLE123";
        selectionDescription.textContent = 
            "You have successfully reserved a room on "
            + dateFormatted + " for " + timeConvert(halfHourIncrements.value) 
            + ". \n Your room is located at " + room;
        document.getElementById("next-btn").textContent = "Finish";
    }
   
    if (pageNumber == 6) {
        location.reload();
        location.href='home.html';
    }

})

function ReservationDetails(roomId, userId, startTime, endTime, 
        purpose, numberOfPeople, createdAt, isDeleted) {

	this.room_id = roomId;
    this.user_id = userId;
    this.start_time = startTime;
    this.end_time = endTime;
    this.purpose = purpose;
    this.number_of_people = numberOfPeople;
    this.created_at = createdAt;
    this.is_deleted = isDeleted;
}
