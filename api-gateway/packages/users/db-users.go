package users

import (
	"log"
	"net/http"

	pg2 "github.com/crescit/runllm/api-gateway/postgres"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/lib/pq"
)

// User represents the User table in the database
type User struct {
	ID           uuid.UUID   `json:"id"`
	InterviewIDs []uuid.UUID `json:"interview_ids"`
}

func CreateUser(c *gin.Context) {
	var user User // Assuming you have a struct named User for the table
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db, err := pg2.NewDatabase()
	if err != nil {
		log.Printf("%v %s", err, "error with database connection")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
		return
	}
	defer db.Close()

	var insertedID uuid.UUID
	row := db.QueryRow("INSERT INTO \"user\" (interview_ids) VALUES ($1) RETURNING id", pq.Array(user.InterviewIDs))
	err = row.Scan(&insertedID)
	if err != nil {
		log.Printf("%v %s", err, "error inserting user")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error inserting user"})
		return
	}

	user.ID = insertedID

	// Now, 'insertedID' contains the UUID of the newly inserted tuple
	log.Printf("User inserted with ID: %v", insertedID)
	c.JSON(http.StatusOK, gin.H{"message": "User created successfully", "user": user})
}
