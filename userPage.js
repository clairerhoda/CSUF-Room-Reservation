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

const currentReservationList = document.getElementById("current-reservation-list");
const pastReservationList = document.getElementById("past-reservation-list");
var dateConversionParts = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
const xhr = new XMLHttpRequest();
//TODO: fetch userId
xhr.open('GET', `http://localhost:3000/reservations/483424269`);
xhr.responseType = 'json'

xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        //enter stuff here
        for (const s of this.response) {
            var startTime = new Date(s.start_time);
           
            var now = new Date()

            const dateTimeRow = document.createElement('div');
            dateTimeRow.setAttribute('class', 'date-time-row');

            const reservation = document.createElement('div');
            reservation.setAttribute('class', 'reservation');

            const reservationTimeSlot = document.createElement('div');
            reservationTimeSlot.setAttribute('class', 'reservation-time-slot');
            const beginTime = document.createElement('div');
            beginTime.setAttribute('style', 'font-weight: 500');
            var startTimeConvert = new Date(s.start_time).toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'});
            beginTime.textContent = startTimeConvert;
            reservationTimeSlot.appendChild(beginTime);
            const endTime = document.createElement('div');
            var endTimeConvert = new Date(s.end_time).toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'});
            endTime.textContent = endTimeConvert;
            endTime.setAttribute('style', 'color: rgb(52, 52, 52)');

            reservationTimeSlot.appendChild(endTime);
            dateTimeRow.appendChild(reservationTimeSlot)
            
            const reservationDate = document.createElement('div');
            reservationDate.setAttribute('class', 'reservation-date');
            reservationDate.setAttribute('style', 'font-weight: 900');

            var dateConversion = new Date(s.start_time).toLocaleDateString("en-US", dateConversionParts);
            reservationDate.textContent = "Reservation Date: " + dateConversion;
            dateTimeRow.appendChild(reservationDate)

            reservation.appendChild(dateTimeRow);

            // deleted reservations are not shown
            if (s.is_deleted == false) {
                if (now.getTime() <= startTime.getTime()) {
                    document.getElementById("upcoming-none-message").style.display = "none";
                    const removeBtn = document.createElement('div');
                    removeBtn.setAttribute('id', 'remove-btn');
                    removeBtn.textContent = "Remove";

                    reservation.appendChild(removeBtn);
                    removeBtn.addEventListener("click", (e) => {
                        e.preventDefault();
                
                        //display pop up warning for final remove decision
                        document.getElementById("warning").style.display = "flex";
                        const yesBtn = document.createElement('div');
                        yesBtn.setAttribute('id', 'yes-btn');
                        yesBtn.textContent = "Yes";

                        document.getElementById("btn-row").appendChild(yesBtn);

                        yesBtn.addEventListener("click", (e) => {
                            xhr.open('PUT', `http://localhost:3000/reservations/${s.reservation_id}`)

                            const newValues = {is_deleted : true}
        
                            // JSON encoding 
                            const jsonStr = JSON.stringify(newValues)
                            xhr.setRequestHeader('Content-Type', 'application/json')
                            xhr.responseType = 'json'
                            xhr.onreadystatechange = function() {
                                if (this.readyState == 4 && this.status == 200) {
                                    console.log(this.response)
                                }
                            }
                            xhr.send(jsonStr)
                            document.querySelector('#warning').style.display = 'none';
                            location.reload();

                        })

                        //<div id="yes-btn">Yes</div>
                    })

                    currentReservationList.appendChild(reservation);
                } else {
                    document.getElementById("past-none-message").style.display = "none";

                    const createdAt = document.createElement('div');
                    createdAt.setAttribute('id', 'created-at');
                    createdAt.textContent = "Reservation Created: " + new Date(s.created_at).toLocaleDateString("en-US", { year: 'numeric', month: 'numeric', day: 'numeric' });
                    reservation.appendChild(createdAt);

                    pastReservationList.appendChild(reservation);
                }
            }
        }
    }
}

xhr.send()
