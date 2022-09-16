package reservation

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"

	_ "github.com/lib/pq"
)

const (
	host     = "127.0.0.1"
	port     = 5432
	user     = "postgres"
	password = "chese21"
	dbname   = "Room_Reservation"
)

func OpenConnection() *sql.DB {
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
		"password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		panic(err)
	}

	err = db.Ping()
	if err != nil {
		panic(err)
	}

	return db
}

type Reservation struct {
	ReservationId          int    `json:"reservation_id"`
	RoomId                 int    `json:"room_id"`
	UserId                 int    `json:"user_id"`
	StartTime              string `json:"start_time"`
	EndTime                string `json:"end_time"`
	Purpose                string `json:"purpose"`
	NumberOfPeople         int    `json:"number_of_people"`
	CreatedAt              string `json:"created_at"`
	CancelledPendingReopen string `json:"cancelled_pending_reopen"`
	IsDeleted              bool   `json:"is_deleted"`
}

func GETHandler(w http.ResponseWriter, r *http.Request) {

	db := OpenConnection()

	rows, err := db.Query("SELECT * FROM reservations")
	if err != nil {
		log.Fatal(err)
	}

	var reservations []Reservation

	for rows.Next() {
		var reservation Reservation
		rows.Scan(&reservation.ReservationId, &reservation.RoomId, &reservation.UserId, &reservation.StartTime, &reservation.EndTime, &reservation.Purpose, &reservation.NumberOfPeople, &reservation.CreatedAt, &reservation.CancelledPendingReopen, &reservation.IsDeleted)
		reservations = append(reservations, reservation)
	}

	reservationsBytes, _ := json.MarshalIndent(reservations, "", "\t")

	w.Header().Set("Content-Type", "application/json")
	w.Write(reservationsBytes)

	defer rows.Close()
	defer db.Close()
}

func POSTHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	room_id := vars["room_id"]
	user_id := vars["user_id"]

	db := OpenConnection()

	//get reservation_lock status
	rows1, err := db.Query("SELECT reservation_lock FROM rooms WHERE room_id = $1;", room_id)
	if err != nil {
		log.Fatal(err)
	}

	var reservation_lock bool

	for rows1.Next() {
		rows1.Scan(&reservation_lock)
	}

	//This updates the room reservation to set lock to true (activated)
	if reservation_lock == false {
		sqlStatement1 := `UPDATE rooms SET reservation_lock = NOT reservation_lock WHERE room_id = $1`
		_, err = db.Exec(sqlStatement1, room_id)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			panic(err)
		}
	}

	var data []Reservation
	err = json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	sqlStatement := `INSERT INTO reservations (room_id, user_id, start_time, end_time, purpose, number_of_people, created_at, cancelled_pending_reopen, is_deleted) VALUES ((SELECT room_id FROM rooms WHERE room_id='` + room_id + `'), (SELECT user_id FROM users WHERE user_id='` + user_id + `'), $1, $2, $3, $4, $5, $6, $7, $8, $9)`
	for i := range data {
		t, err := time.Parse(time.RFC3339, data[i].StartTime)
		t2, err := time.Parse(time.RFC3339, data[i].EndTime)
		t3, err := time.Parse(time.RFC3339, data[i].CreatedAt)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			panic(err)
		}

		_, err = db.Exec(sqlStatement, t, t2, data[i].Purpose, data[i].NumberOfPeople, t3, time.Time{}.Format(time.RFC3339), false)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			panic(err)
		}
	}

	w.WriteHeader(http.StatusOK)
	defer db.Close()
}

func DELETEHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	reservation_id := vars["reservation_id"]
	room_id := vars["room_id"]

	db := OpenConnection()

	sqlStatement1 := `UPDATE rooms SET reservation_lock = NOT reservation_lock WHERE room_id = $1`
	_, err := db.Exec(sqlStatement1, room_id)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		panic(err)
	}

	sqlStatement2 := `UPDATE reservations SET cancelled_pending_reopen = $1 WHERE reservation_id = $2`
	_, err = db.Exec(sqlStatement2, time.Now().Format(time.RFC3339), reservation_id)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		panic(err)
	}

	sqlStatement3 := `UPDATE reservations SET is_deleted = NOT is_deleted WHERE reservation_id = $1`
	_, err = db.Exec(sqlStatement3, reservation_id)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		panic(err)
	}

	w.WriteHeader(http.StatusOK)
	defer db.Close()
}

func ReservationExecute(r *mux.Router) {
	subRouter := r.PathPrefix("/").Subrouter()
	http.HandleFunc("/getReservations", GETHandler)
	subRouter.HandleFunc("/insertReservations/{room_id}/{user_id}", POSTHandler).Methods("POST")
	subRouter.HandleFunc("/deleteReservation/{reservation_id}/{room_id}", DELETEHandler).Methods("DELETE")
}
