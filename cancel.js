// function for converting local date to Isostring
function toIsoString(date) {
    var tzo = -date.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function(num) {
            return (num < 10 ? '0' : '') + num;
        };
    
    return date.getFullYear() +
        '-' + pad(date.getMonth() + 1) +
        '-' + pad(date.getDate()) +
        'T' + pad(date.getHours()) +
        ':' + pad(date.getMinutes()) +
        ':' + pad(date.getSeconds()) +
        dif + pad(Math.floor(Math.abs(tzo) / 60)) +
        ':' + pad(Math.abs(tzo) % 60);
}

function timeConvert(n) {
    var num = n;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    var mText =  " 30 minutes ";
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

const removeButton = document.getElementById("remove-btn");
const currentReservationList = document.getElementById("current-reservation-list");
const pastReservationList = document.getElementById("past-reservation-list");
var options = 
                {   weekday: 'long',year: 'numeric', 
                    month: 'long', day: 'numeric', 
                    hour:"numeric", minute:"numeric" 
                };
const xhr = new XMLHttpRequest();
//TODO: fetch userId
xhr.open('GET', `http://localhost:3000/reservations/483424269`);
xhr.responseType = 'json'

xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        //enter stuff here
        for (const s of this.response) {
            var startTime = new Date(s.start_time);
            var endTime = new Date(s.end_time);
            var diff =(endTime.getTime() - startTime.getTime()) / 1000;
            diff /= 60;
            var reservationLength = Math.abs(Math.round(diff));
            var now = new Date()

            if (now.getTime() <= startTime.getTime()) {
                const reservation = document.createElement('div');
                reservation.setAttribute('class', 'reservation');
                var dateConversion = new Date(s.start_time).toLocaleDateString("en-US", options);
                reservation.textContent = dateConversion + " ( " + timeConvert(reservationLength) + " )";
               
                const removeBtn = document.createElement('div');
                removeBtn.setAttribute('id', 'remove-btn');
                removeBtn.textContent = "Remove";
                reservation.appendChild(removeBtn);

                currentReservationList.appendChild(reservation);
            } else {
                const reservation = document.createElement('div');
                reservation.setAttribute('class', 'reservation');
                var dateConversion = new Date(s.start_time).toLocaleDateString("en-US", options);
                reservation.textContent = dateConversion + " ( " + timeConvert(reservationLength) + " )";
                pastReservationList.appendChild(reservation);
            }
        }
    }
}

xhr.send()
removeButton.addEventListener("click", (e) => {
    //display pop up that asks if user is sure they want to remove a reservation
})