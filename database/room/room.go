package room

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

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

type Room struct {
	RoomId          int    `json:"room _id"`
	Floor           int    `json:"floor`
	RoomNumber      int    `json:"room_number"`
	Capacity        int    `json:"capacity"`
	Description     string `json:"description"`
	ReservationLock bool   `json:"reservation_lock"`
}

func GETHandler(w http.ResponseWriter, r *http.Request) {

	db := OpenConnection()

	rows, err := db.Query("SELECT * FROM rooms")
	if err != nil {
		log.Fatal(err)
	}

	var rooms []Room

	for rows.Next() {
		var room Room
		rows.Scan(&room.RoomId, &room.Floor, &room.RoomNumber, &room.Capacity, &room.Description, &room.ReservationLock)
		rooms = append(rooms, room)
	}

	roomsBytes, _ := json.MarshalIndent(rooms, "", "\t")

	w.Header().Set("Content-Type", "application/json")
	w.Write(roomsBytes)

	defer rows.Close()
	defer db.Close()
}

func POSTHandler(w http.ResponseWriter, r *http.Request) {
	db := OpenConnection()

	var data []Room
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	sqlStatement := `INSERT INTO rooms (floor, room_number, capacity, description, reservation_lock) VALUES ($1, $2, $3, $4, $5)`
	for i := range data {
		_, err = db.Exec(sqlStatement, data[i].Floor, data[i].RoomNumber, data[i].Capacity, data[i].Description, data[i].ReservationLock)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			panic(err)
		}
	}

	w.WriteHeader(http.StatusOK)
	defer db.Close()
}

func RoomExecute(r *mux.Router) {
	subRouter := r.PathPrefix("/").Subrouter()
	http.HandleFunc("/getRooms", GETHandler)
	subRouter.HandleFunc("/insertRooms/", POSTHandler).Methods("POST")
}
