/*
    This JavaScript file is responsible for displaying the calendar
    date selection for the user from today to 2 weeks in the future.
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

var slideIndex = 1;

// Next/previous controls
function plusSlides(n) {
    var options = document.getElementById("calendar-list");
    if (options.childElementCount > 5) {
        if (slideIndex + n != 0 
            && slideIndex + n != (options.childElementCount-3)) {
            showSlides(slideIndex += n);
        }
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

var dateDict = new Object();
var roomDict = new Object();

async function checkDay(start, end, userId) {
    return new Promise(resolve => {
        var address ='http://localhost:3000/reservations';
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 
        `${address}/${start}/${end}/${userId}`);
        xhr.responseType = 'json';
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                resolve(this.response)
            } 
        }
        xhr.send();
    })
}

async function getReservations(start, end, reservationTime, capacity) {
    return new Promise(resolve => {
        var timesAndCount = new Object();
        var room = 0;
        var address ='http://localhost:3000/reservations';
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 
        `${address}/${start}/${end}/${reservationTime}/${capacity}`);
        xhr.responseType = 'json';
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var temp = new Date(this.response[0].available_time)
                for (const s of this.response) {
                    if (temp.getTime() === (new Date(s.available_time))
                        .getTime()) {
                        room += 1
                    } else {
                        timesAndCount[temp] = room;
                        room = 1
                    }
                    temp = new Date(s.available_time);
                }
                resolve(timesAndCount);
            } 
        }
        xhr.send();
    })
}

async function getCalendarDates(reservationTime, studentCount) {
    try {
        document.getElementById("loader-box").style.display = "flex";
        var availableDateDay = new Date();
        var availableDateDay14 = new Date(Date.now() + 12096e5);
        availableDateDay14.setHours(24,0,0,0);

        const dates = [];
        
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

            // opening and close times are different for week days 
            // and weekends
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
                continue;
            }

            // check if user already has a reservation for the given day
            // if so we hide it from the users view
            // (rule: user can only make one reservation a day)
            var dayCheck = await checkDay(new Date(openTime).toISOString(), 
                new Date(closeTime).toISOString(),
                getCookie("user_id"));
            if (dayCheck.length > 0) {
                availableDateDay = 
                new Date(availableDateDay)
                    .setDate(new Date(availableDateDay).getDate() + 1);
                availableDateDay = new Date(availableDateDay).toISOString();
                continue;
            }

            // if time now is past an hour before regular open hours 
            // change to nearest next 30 min time
            var hourBeforeNow = new Date().getTime() + 1 * 60 * 60 * 1000
            if (hourBeforeNow > new Date(openTime).getTime()) {
                const ms = 1000 * 60 * 30;
                openTime = new Date(Math.ceil(new Date().getTime() / ms) * ms);
                openTime = openTime.setTime(openTime.getTime() + (1*60*60*1000));
            }

            // fetch available dates from db
            var availableTimes = await getReservations(
                new Date(openTime).toISOString(), 
                new Date(closeTime).toISOString(), 
                reservationTime,
                studentCount
            );


            // if no times available, do not show date
            if (availableTimes.length == 0) {
                availableDateDay = 
                new Date(availableDateDay)
                    .setDate(new Date(availableDateDay).getDate() + 1);
                availableDateDay = new Date(availableDateDay).toISOString();
                continue;
            }

            // assign available times to an array
            var times = [];
            var roomCount = [];
            for (const key in await availableTimes) {
                times.push(new Date(key))
                roomCount.push(availableTimes[key])
            }

            // set fetch available times to date dictionary
            dateDict[dayNum] = times;
            roomDict[dayNum] = roomCount;
            // date get pushed onto date array if it has
            // available dates
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
            // pre select first calendar day
            if (i == 0) {
                calendarOption.style.backgroundColor = "white";
            }
        }
        var dateStart = 
            document.getElementById("date-start").appendChild(calendarList);
        document.getElementById("date-selection-table").appendChild(dateStart);
        showSlides(slideIndex);

        
        var timeSelection = document.createElement("div");
        timeSelection.setAttribute("id", "time-selection");
        var availableTime = Object.values(dateDict)[0];
        var roomCounter = Object.values(roomDict)[0];
        
        addTimesForDate(availableTime, roomCounter);
           
        async function addTimesForDate(availableTime, roomAvailable) {
            // remove other times when new date is selected
            var child = timeSelection.lastElementChild;
            while (child) {
                timeSelection.removeChild(child);
                child = timeSelection.lastElementChild;
            }

            // display available times for date selected
            for (var prop in await availableTime) {
                var timeSlot = document.createElement("div");
                timeSlot.setAttribute("id", "time-slot");
                var start = new Date(availableTime[prop]);
                var end = new Date(new Date(availableTime[prop]).getTime() +
                    parseInt(reservationTime)*60000);
                var meetingStart = start.toLocaleTimeString(
                    'en-us', { hour:"numeric", minute:"numeric"});
                var meetingEnd = end.toLocaleTimeString(
                    'en-us', { hour:"numeric", minute:"numeric"});
                timeSlot.textContent = meetingStart + " to " + meetingEnd;
                var roomsLeft = document.createElement("div");
                roomsLeft.setAttribute("id", "rooms-left");
                roomsLeft.textContent = "Rooms Left: " + roomAvailable[prop];
                var selectTimeBtn = document.createElement("div");
                selectTimeBtn.setAttribute("id", "select-time-btn");
                selectTimeBtn.textContent = "Select";
                timeSlot.appendChild(selectTimeBtn);
                var rightItems = document.createElement("div");
                rightItems.setAttribute("class", "right-items");
                rightItems.appendChild(roomsLeft);
                rightItems.appendChild(selectTimeBtn);
                var timeRow = document.createElement("li");
                timeRow.setAttribute("class", "time-row");
                timeRow.appendChild(timeSlot);
                timeRow.appendChild(rightItems);
                timeRow.setAttribute("id", start.getTime());
                timeSelection.appendChild(timeRow);
            }
            document.getElementById("loader-box").style.display = "none";
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
                    div.style.backgroundColor = "#e7e7e7";
                });
                [].forEach.call(status, function(div) {
                    div.style.width = "90px";
                    div.style.height = "35px";
                    div.textContent = "Select";
                });               
                event.target.style.boxShadow = 
                    "0px 0px 0px 2.5px #527496 inset";
                event.target.style.backgroundColor = "white";
                var child = event.target.querySelectorAll('#select-time-btn');
                child[0].style.width = "35px";
                child[0].style.height = "35px";
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
                addTimesForDate(dateDict[event.target.value],
                    roomDict[event.target.value])
                event.target.style.backgroundColor = "rgb(255, 255, 255)";
            }
        })

    } catch(error) {
        console.log(error);
    }
}