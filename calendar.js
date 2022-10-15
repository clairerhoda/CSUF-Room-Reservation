function getReservations(startRange, endRange, reservationTime) {
    const res = new Promise(function(resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `http://localhost:3000/reservations/${startRange.toISOString()}/${endRange.toISOString()}/${reservationTime}`);
        xhr.responseType = 'json';
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                for (const s of this.response) {
                    console.log(s.available_time)
                }
            } 
        }
        xhr.send();
    })
    return res;
  }

function getCalendarDates (reservationTime ) {
    var availableDateDay = new Date()

    var availableDateDay14 = new Date(Date.now() + 12096e5);
    availableDateDay14.setHours(24,0,0,0); // might need to change to (0,0,0,0)

    const dates = [];
    const roomSmall = ["PLN-215", "PLN-311"];
    const roomLarge = ["PLN-111", "PLN-112", "PLN-114", "PLN-312", "PLN-314"];

    var startDayRange = new Date().toISOString();
    var endDayRange = new Date().toISOString();

    availableDateDay = availableDateDay.toISOString()
    availableDateDay14 = availableDateDay14.toISOString()
    while (availableDateDay < availableDateDay14) {
        console.log((new Date(availableDateDay).toLocaleDateString(
            'en-us', { year:"numeric", month:"long", day:"numeric"})))
        startDayRange = new Date(availableDateDay)
        endDayRange = new Date(availableDateDay).setDate(new Date(availableDateDay).getDate() + 1);

        startDayRange = new Date(startDayRange)
        endDayRange = new Date(endDayRange)
        var x = getReservations(startDayRange, endDayRange, reservationTime);

        // push availble appoint on display
        dates.push(new Date(availableDateDay));

        // if no, skip date
        availableDateDay = new Date(availableDateDay).setDate(new Date(availableDateDay).getDate() + 1);
        availableDateDay = new Date(availableDateDay).toISOString()
    }

    var calendarList = document.createElement("div");
    // checks if dates have been added to ui
    if (document.getElementById("date-start").childNodes.length == 0) {
        calendarList.setAttribute("id", "calendar-list");
        // check for all reservation availability times for each day
        if (calendarOption == null) {
            for (let i = 0; i < dates.length; i++) {
                var calendarOption = document.createElement("li");
                calendarOption.setAttribute("id", "calendar-option");
                calendarOption.textContent = dates[i].toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"long", day:"numeric"});
                calendarList.appendChild(calendarOption);
            }
        }
    }

    calendarList.addEventListener("click", (event) => {
        if (event.target.tagName == "LI") {
            var divs = document.querySelectorAll("#calendar-option");
            [].forEach.call(divs, function(div) {
                div.style.filter = "saturate(100%)"
            });
            event.target.style.filter = "saturate(350%)";
        }
    })

    return calendarList;
}