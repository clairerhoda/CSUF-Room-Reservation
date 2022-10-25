/*
    This JavaScript file is responsible for displaying the calendar
    date selection for the user from today to 2 weeks in the future.
 */

var slideIndex = 1;

// Next/previous controls
function plusSlides(n) {
    if (slideIndex + n != 0 && slideIndex + n != 12) {
        showSlides(slideIndex += n);
    }
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("calendar-option");
    if (n > slides.length) {slideIndex = 1;}
    if (n < 1) {slideIndex = slides.length;}
    for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
    }
    slides[slideIndex-1].style.display = "flex";
    slides[slideIndex].style.display = "flex";
    slides[slideIndex+1].style.display = "flex";
    slides[slideIndex+2].style.display = "flex";
    slides[slideIndex+3].style.display = "flex";
}

var availableRooms = [];
async function getRooms(studentCount) {
    return new Promise(resolve => {
        var times = [];
        var address ='http://localhost:3000/rooms';
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${address}/${studentCount}`);
        xhr.responseType = 'json';
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                for (const s of this.response) {
                resolve(availableRooms.push(s.room_id));
                }
            } 
        }
        xhr.send();
    })
}

var dateDict = new Object();

async function getReservations(startRange, endRange, reservationTime) {
    return new Promise(resolve => {
        var times = [];

        var address ='http://localhost:3000/reservations';
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 
        `${address}/${startRange}/${endRange}/${reservationTime}`);
        xhr.responseType = 'json';
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                for (const s of this.response) {
                    console.log(s.available_time)
                    times.push(new Date(s.available_time));
                }
                resolve(times);
            } 
        }
        xhr.send();
    })
}

async function getCalendarDates(reservationTime, studentCount) {
    try {
        var availableDateDay = new Date();
        var availableDateDay14 = new Date(Date.now() + 12096e5);
        availableDateDay14.setHours(24,0,0,0);

        const dates = [];

        // TODO: if room with same date is available, 
        // make sure it shows in available reservation table
        await getRooms(studentCount);
        // console.log("fffff: ",  availableRooms);

        availableDateDay = availableDateDay.toISOString();
        availableDateDay14 = availableDateDay14.toISOString();
        var dayNum = 0;
        while (availableDateDay < availableDateDay14) {
            var openTime = new Date(availableDateDay).setHours(7,0,0,0);
            var closeTime = new Date(availableDateDay)
                .setDate(new Date(availableDateDay).getDate() + 1);
            closeTime = new Date(closeTime).setHours(0,0,0,0);

            var dayOfWeek = new Date(openTime)
                .toLocaleDateString('en-us', {weekday: "short"});

            // opening and close times are different for week days and weekends
            if (dayOfWeek == "Fri" || 
                dayOfWeek == "Sat" || 
                dayOfWeek == "Sun") {
                closeTime = new Date(openTime).setHours(17,0,0,0);
            }

            if (dayOfWeek == "Sat" || dayOfWeek == "Sun") {
                openTime = new Date(availableDateDay).setHours(9,0,0,0);
            }

            //see if current date is still open, 
            //if not skip to tomorrow
            if (new Date().toISOString() > new Date(closeTime).toISOString()) {
                availableDateDay = 
                new Date(availableDateDay)
                    .setDate(new Date(availableDateDay).getDate() + 1);
                 availableDateDay = new Date(availableDateDay).toISOString();
                dayNum++;
                continue;
            }

            // if time now is past regular open hours
            // change to nearest next 30 min time
            if (new Date().toISOString() > new Date(openTime).toISOString()) {
                const ms = 1000 * 60 * 30;
                openTime = new Date(Math.ceil(new Date().getTime() / ms) * ms);
            }

            // fetch available dates from db
            var availableTimes = await getReservations(
                new Date(openTime).toISOString(), 
                new Date(closeTime).toISOString(), 
                reservationTime
            );

            // if no times available, do not show date
            if (availableTimes.length == 0) {
                availableDateDay = 
                new Date(availableDateDay)
                    .setDate(new Date(availableDateDay).getDate() + 1);
                availableDateDay = new Date(availableDateDay).toISOString();
                dayNum++;
                continue;
            }

            dateDict[dayNum] = await availableTimes;
            dates.push(new Date(availableDateDay));
            availableDateDay = 
                new Date(availableDateDay)
                    .setDate(new Date(availableDateDay).getDate() + 1);
            availableDateDay = new Date(availableDateDay).toISOString();
            dayNum++;
        }

        // day selection from 2 week span
        var calendarList = document.createElement("div");
        calendarList.setAttribute("id", "calendar-list");
        for (let i = 0; i < dates.length; i++) {
            var calendarOption = document.createElement("li");
            calendarOption.setAttribute("class", "calendar-option");
            var part1 = document.createElement("div");
            var part2 = document.createElement("div");
            part1.style.pointerEvents = "none";
            part2.style.pointerEvents = "none";
            var dateOptions = {  month: 'short', day: 'numeric' };
            var dayOfWeekName = {weekday: 'short'};
            part1.textContent = dates[i].toLocaleString(
                'default', dayOfWeekName);
            part2.textContent = dates[i].toLocaleDateString(
                'en-us', dateOptions);
            // trigger first date to be selected
            calendarOption.appendChild(part1);
            calendarOption.appendChild(part2);
            calendarOption.value = i;
            calendarList.appendChild(calendarOption);
            if ( i == 0) {
                calendarOption.style.backgroundColor = "rgb(255,255,255)";
            }
        }
        var dateStart = 
            document.getElementById("date-start").appendChild(calendarList);
        document.getElementById("date-selection-table").appendChild(dateStart);
        showSlides(slideIndex);

        
        var timeSelection = document.createElement("div");
        timeSelection.setAttribute("id", "time-selection");
        const objEntries = Object.entries(await dateDict);
        var val = Object.values(dateDict)[0];
        addTimesForDate(val);
           
        async function addTimesForDate(val) {
            // remove other times when new date is selected
            var child = timeSelection.lastElementChild; 
            while (child) {
                timeSelection.removeChild(child);
                child = timeSelection.lastElementChild;
            }

            // display available times for date selected
            for (var prop in await val) {
                var timeSlot = document.createElement("div");
                timeSlot.setAttribute("id", "time-slot");
                var start = new Date(val[prop]);
                var end = new Date(new Date(val[prop]).getTime() +
                    parseInt(reservationTime)*60000);
                var meetingStart = start.toLocaleTimeString(
                    'en-us', { hour:"numeric", minute:"numeric"});
                var meetingEnd = end.toLocaleTimeString(
                    'en-us', { hour:"numeric", minute:"numeric"});
                timeSlot.textContent = meetingStart + " to " + meetingEnd;
                var selectTimeBtn = document.createElement("div");
                selectTimeBtn.setAttribute("id", "select-time-btn");
                selectTimeBtn.textContent = "Select";
                timeSlot.appendChild(selectTimeBtn);
                var timeRow = document.createElement("li");
                timeRow.setAttribute("class", "time-row");
                timeRow.appendChild(timeSlot);
                timeRow.appendChild(selectTimeBtn);
                timeRow.setAttribute("id", start.getTime());
                timeSelection.appendChild(timeRow);
            }
        }
       
        document.getElementById("date-selection-table")
            .appendChild(timeSelection);
       
        // detect when reservation time has been selected
        timeSelection.addEventListener("click", (event) => {
            
            if (event.target.tagName == "LI") {
                var rows = document.querySelectorAll(".time-row");
                var status = document.querySelectorAll("#select-time-btn");
                [].forEach.call(rows, function(div) {
                    div.style.boxShadow = "none";
                    div.style.backgroundColor = "#e0e5ec";
                });
                [].forEach.call(status, function(div) {
                    div.style.width = "100px";
                    div.style.height = "35px";
                    div.textContent = "Select";
                });               
                event.target.style.boxShadow = 
                    "0px 0px 0px 2.5px #527496 inset";
                event.target.style.backgroundColor = "white";
                var child = event.target.querySelectorAll('#select-time-btn');
                child[0].style.width = "30px";
                child[0].style.height = "30px";
                child[0].textContent = "✓";
            }
        })

        // detect when day from 2 week span has been selected
        calendarList.addEventListener("click", (event) => {
            if (event.target.tagName == "LI") {
                var divs = document.querySelectorAll(".calendar-option");
                [].forEach.call(divs, function(div) {
                    div.style.backgroundColor = "rgba(255, 255, 255, 0)";
                });
                addTimesForDate(dateDict[event.target.value])
                event.target.style.backgroundColor = "rgb(255, 255, 255)";
            }
        })

        getCalendarDates = function(){};

    } catch(error) {
        console.log(error);
    }
}