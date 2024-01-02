package answers

import (
	"log"
	"net/http"

	pg "github.com/crescit/runllm/api-gateway/postgres"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type Answer struct {
	ID        uuid.UUID `json:"id"`
	QID       uuid.UUID `json:"q_id"`
	Score     float64   `json:"score"`
	Text      string    `json:"text"`
	UserID    uuid.UUID `json:"user_id"`
	Timestamp float64   `json:"timestamp"`
}

func CreateAnswer(c *gin.Context) {
	var answer Answer // Assuming you have a struct named Answer for the table
	if err := c.ShouldBindJSON(&answer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if answer.QID == uuid.Nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "question id cannot be empty"})
		return
	}

	if answer.UserID == uuid.Nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "UserID cannot be empty"})
		return
	}

	db, err := pg.NewDatabase()
	if err != nil {
		log.Printf("%v %s", err, "error with database connection")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
		return
	}
	defer db.Close()

	answer.ID = uuid.New()

	_, err = db.Query("INSERT INTO answers (id, q_id, score, text, user_id, timestamp) VALUES ($1, $2, $3, $4, $5, $6)",
		answer.ID, answer.QID, answer.Score, answer.Text, answer.UserID, answer.Timestamp)
	if err != nil {
		log.Printf("%v %s", err, "error inserting answer")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error inserting answer"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Answer created successfully", "answer": answer})
}
