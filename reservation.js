
/*
    This JavaScript file is responsible for reservation creation from the user.
    It allows the user to select avaialble date and times for a reservation
 */

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
        selectionDescription.textContent = "How Long Do You Want to Reserve the Room?";
        halfHourIncrements.style.display = "flex";
        dateStart.style.display = "none";
    }

    if (pageNumber == 3) {
        selectionDescription.textContent = "Select a Date";
        dateStart.style.display = "flex";
        timeStart.style.display = "none";
        document.getElementById("next-btn").textContent = "Next";

    }


})

nextButton.addEventListener("click", (e) => {
    e.preventDefault();
    pageNumber++;
    
    // chekc if calendar date is selected
    var divs = document.querySelectorAll("#calendar-option");
        [].forEach.call(divs, function(div) {
            if (div.style.filter == "saturate(350%)") {
                selected = true;
                reservationDate = div.textContent;
            }
        });
    if (selected == false && pageNumber == 4) {
        document.getElementById("invalidText").style.display = "flex";
        pageNumber = 3;
    } else {
        document.getElementById("invalidText").style.display = "none";
    }

    if (pageNumber == 2) {
        backButton.style.display = "flex";
        selectionDescription.textContent = "How Long Do You Want to Reserve the Room?";

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
        dateStart.style.display = "flex";

        var calendarList = getCalendarDates(halfHourIncrements.value);
        // dateStart.appendChild(calendarList)

        // TODO: if the min 30 minutes is not available on a date, make the day not selectable
        // this means all available reservations are taken for that day
    }

    // if (pageNumber == 4) {
    //     selectionDescription.textContent = "Select an Available Reservation Start Time";

    //     dateStart.style.display = "none";
    //     timeStart.style.display = "flex";

    //     // TODO: retreive all possible start times in 30 min increments
    //     // retreive room id(s) for available room(s)
    //     // Example: start time can be 9AM or 9:30AM
    //     // Note: with reserve length in mind, calculate available start times effeciently.

    //     //Pollak Library Hours
    //     //Monday	7AM–12AM    Tuesday	    7AM–12AM
    //     //Wednesday	7AM–12AM    Thursday	7AM–12AM
    //     //Friday	7AM–5PM     Saturday	9AM–5PM
    //     //Sunday	9AM–5PM

    //     var sampleTimes = ["9:00 AM", "9:30 AM", "12:00 PM", "12:30 PM", "4:00 PM"];
    //     if (timeStart.length == 0) {
    //         for (var j = 0; j < sampleTimes.length; j++) {
    //             var option = document.createElement("option");
    //             option.value = sampleTimes[j];
    //             option.text = sampleTimes[j];
    //             timeStart.appendChild(option);
    //         }
    //     }         
    // }

    if (pageNumber == 4) {
        dateStart.style.display = "none";
        var dateFormatted = (new Date(reservationDate).toLocaleDateString(
            'en-us', { weekday:"long", year:"numeric", month:"long", day:"numeric"}));
        selectionDescription.textContent = "You want to reserve a room for " + dateFormatted +
         " at " + timeStart + " for " + timeConvert(halfHourIncrements.value) + "?";
        document.getElementById("next-btn").textContent = "Confirm";
    }

    const convertTime12to24 = (time12h) => {
        const [time, modifier] = time12h.split(' ');
        let [hours, minutes] = time.split(':');
      
        if (hours === '12')
          hours = '00';
      
        if (modifier === 'PM') 
          hours = parseInt(hours, 10) + 12;
      
        return `${hours}:${minutes}`;
    }

    if (pageNumber == 5) {
        backButton.style.display = "none";
        const createdAt = (new Date()).toISOString();
        const isDeleted = false;
        const purpose = ""; // may add purpose section later
        var dateFormatted = (new Date(reservationDate).toLocaleDateString(
            'en-us', { year:"numeric", month:"numeric", day:"numeric"}))
        const [month, day, year] = dateFormatted.split('/');
        const [hour, minute] = convertTime12to24(timeStart.value).split(':');
        var startTimeDate = new Date(+year, +month - 1, +day, +hour, +minute, +"00");
        var endTimeDate  = new Date(startTimeDate.getTime() + parseInt(halfHourIncrements.value)*60000);

        //remove after fetching
        const roomId = 1750691250;
        const userId = 483424269;

        const xhr = new XMLHttpRequest()
        xhr.open('POST', `http://localhost:3000/reservations`)
        
        // store all times in db in UTC
        const rsObj = new ReservationDetails(roomId, userId, startTimeDate, endTimeDate, purpose, parseInt(studentCount.value), createdAt, isDeleted);

        // Set the Content-Type 
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.responseType = 'json'
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log(this.response)
            }
        }
        // JSON encoding 
        const jsonStr = JSON.stringify(rsObj)
        xhr.send(jsonStr)

        dateFormatted = (new Date(reservationDate).toLocaleDateString(
            'en-us', { year:"numeric", month:"long", day:"numeric"}))
        var room = "SAMPLE123"; //connect to db
        selectionDescription.textContent = "You have successfully reserved a room on " + dateFormatted + " at " + timeStart.value + " for " + timeConvert(halfHourIncrements.value) + ". \n Your room is located at " + room;

        document.getElementById("next-btn").textContent = "Finish";
    }
   
    if (pageNumber == 6) {
        location.reload();
        location.href='home.html';
    }

})

function ReservationDetails(roomId, userId, startTime, endTime, purpose, numberOfPeople, createdAt, isDeleted) {
	this.room_id = roomId
    this.user_id = userId
    this.start_time = startTime
    this.end_time = endTime
    this.purpose = purpose
    this.number_of_people = numberOfPeople
    this.created_at = createdAt
    this.is_deleted = isDeleted
}
