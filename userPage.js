/*
    This JavaScript file is responsible for showing the user there upcoming
    and past reservations.
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

// find room number with id given
async function getRoom(room_id) {
    return new Promise(resolve => {
        var address =`http://localhost:3000/room/${room_id}`;
        const xhr = new XMLHttpRequest();
        xhr.open('GET', address);
        xhr.responseType = 'json';
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                resolve(this.response[0].room_number);
            } else {
                return "";
            }
        }
        xhr.send();
    })
}

const currentReservationList = 
    document.getElementById("current-reservation-list");
const pastReservationList = 
    document.getElementById("past-reservation-list");
var dateConversionParts = 
    { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };

const xhr = new XMLHttpRequest();
xhr.open('GET', `http://localhost:3000/reservations/${getCookie("user_id")}`);
xhr.responseType = 'json';

document.getElementById("loader-box").style.display = "flex";

xhr.onreadystatechange = async function() {
    if (this.readyState == 4 && this.status == 200) {
        for (const s of this.response) {
            var startTime = new Date(s.start_time);
            var endTime = new Date(s.end_time);
            const dateTimeRow = document.createElement('div');
            dateTimeRow.setAttribute('class', 'date-time-row');

            const reservation = document.createElement('div');
            reservation.setAttribute('class', 'reservation');

            const reservationTimeSlot = document.createElement('div');
            reservationTimeSlot.setAttribute('class', 'reservation-time-slot');
            const beginTime = document.createElement('div');
            beginTime.setAttribute('style', 'font-weight: 500');
            var startTimeConvert = startTime.toLocaleTimeString(
                [], {hour: 'numeric', minute: '2-digit'});
            beginTime.textContent = startTimeConvert;
            reservationTimeSlot.appendChild(beginTime);
            const endTimeDiv = document.createElement('div');
            var endTimeConvert = endTime.toLocaleTimeString(
                [], {hour: 'numeric', minute: '2-digit'});
            endTimeDiv.textContent = endTimeConvert;
            endTimeDiv.setAttribute('style', 'color: rgb(52, 52, 52)');

            reservationTimeSlot.appendChild(endTimeDiv);
            dateTimeRow.appendChild(reservationTimeSlot)
            
            const reservationContent = document.createElement('div');
            reservationContent.setAttribute('class', 'reservation-content');
            reservationContent.setAttribute('style', 'width:100%;' +
             'display:flex; flex-direction: column');

            const reservationDate = document.createElement('div');
            reservationDate.setAttribute('class', 'reservation-date');
            reservationDate.setAttribute('style', 'font-weight: 900');

            var dateConversion = new Date(
                s.start_time).toLocaleDateString("en-US", dateConversionParts);

            reservationDate.textContent = 
                "Scheduled For: " + dateConversion + "\r\n";
            const reservationRoom = document.createElement('div');
            reservationRoom.setAttribute('class', 'reservation-room');
            reservationRoom.setAttribute('style', 'font-weight: 400');
            reservationRoom.textContent = 
                "Located in room " + await getRoom(s.room_id);
            reservationContent.appendChild(reservationDate);
            reservationContent.appendChild(reservationRoom);
            dateTimeRow.appendChild(reservationContent);
            reservation.appendChild(dateTimeRow);

            // deleted reservations are not shown
            if (s.is_deleted == false) {
                var hourBeforeNow = new Date().getTime() + 1 * 60 * 60 * 1000
                if (hourBeforeNow <= startTime.getTime()) {
                    document.getElementById("upcoming-none-message").
                        style.display = "none";
                    const removeBtn = document.createElement('div');
                    removeBtn.setAttribute('id', 'remove-btn');
                    removeBtn.textContent = "Remove";

                    reservation.appendChild(removeBtn);
                    removeBtn.addEventListener("click", (e) => {
                        e.preventDefault();        
                        document.getElementById("warning").
                            style.display = "flex";
                        document.body.classList.add("stop-scrolling");
                        document.querySelector("body").
                            setAttribute('class', 'stop-scrolling');
                        window.scrollTo(0, 0);

                        if (document.querySelectorAll("#yes-btn").length == 0) {
                            const yesBtn = document.createElement('div');
                            yesBtn.setAttribute('id', 'yes-btn');
                            yesBtn.textContent = "Yes";
    
                            document.getElementById("btn-row").
                                appendChild(yesBtn);
                            yesBtn.addEventListener("click", (e) => {
                                xhr.open('PUT', 
                                `http://localhost:3000/reservations/`+
                                `${s.reservation_id}`);
                                const newValues = {is_deleted : true};
                                // JSON encoding 
                                const jsonStr = JSON.stringify(newValues);
                                xhr.setRequestHeader('Content-Type',
                                     'application/json');
                                xhr.responseType = 'json';
                               
                                xhr.send(jsonStr)
                                document.querySelector('#warning').
                                    style.display = 'none';
                                location.reload();
                            })
                        }
                    })
                    currentReservationList.appendChild(reservation);
                } else {
                    document.getElementById("past-none-message").
                        style.display = "none";

                    const createdAt = document.createElement('div');
                    createdAt.setAttribute('id', 'created-at');
                    createdAt.textContent = "Reservation Created: " +
                        new Date(s.created_at).toLocaleDateString("en-US",
                        { year: 'numeric', month: 'numeric', day: 'numeric' });
                    reservation.appendChild(createdAt);
                    pastReservationList.appendChild(reservation);
                }
            }
        }
        document.getElementById("loader-box").style.display = "none";
    }
}

xhr.send();

