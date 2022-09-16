package database

import (
	"log"
	"net/http"

	"github.com/clairerhoda/CSUFRoomReservation/database/reservation"
	"github.com/clairerhoda/CSUFRoomReservation/database/reservation_attendee"
	"github.com/clairerhoda/CSUFRoomReservation/database/room"
	"github.com/clairerhoda/CSUFRoomReservation/database/user"
	"github.com/gorilla/mux"

	_ "github.com/lib/pq"
)

func Execute() {
	r := mux.NewRouter()
	user.UserExecute(r)
	room.RoomExecute(r)
	reservation.ReservationExecute(r)
	reservation_attendee.ReservationAttendeeExecute(r)
	http.Handle("/", r)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
