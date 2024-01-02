package sessions

import (
	"log"
	"net/http"

	pg "github.com/crescit/runllm/api-gateway/postgres"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type Session struct {
	ID          uuid.UUID   `json:"id"`
	Name        string      `json:"name"`
	Timestamp   float64     `json:"timestamp"`
	QuestionIDs []uuid.UUID `json:"question_ids"`
	AnswerIDs   []uuid.UUID `json:"answer_ids"`
	UserID      uuid.UUID   `json:"user_id"`
}

func CreateSession(c *gin.Context) {
	var session Session // Assuming you have a struct named Session for the table
	if err := c.ShouldBindJSON(&session); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db, err := pg.NewDatabase()
	if err != nil {
		log.Printf("%v %s", err, "error with database connection")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
		return
	}
	defer db.Close()

	_, err = db.Query("INSERT INTO session (name, timestamp, question_ids, answer_ids, user_id) VALUES ($1, $2, $3, $4, $5)",
		session.Name, session.Timestamp, session.QuestionIDs, session.AnswerIDs, session.UserID)
	if err != nil {
		log.Printf("%v %s", err, "error inserting session")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error inserting session"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Session created successfully"})
}
