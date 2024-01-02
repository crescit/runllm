package questions

import (
	"log"
	"net/http"

	pg "github.com/crescit/runllm/api-gateway/postgres"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// Question represents the Question table in the database
type Question struct {
	ID   uuid.UUID `json:"id"`
	Text string    `json:"text"`
	CVID uuid.UUID `json:"cv_id"`
}

func CreateQuestion(c *gin.Context) {
	var question Question // Assuming you have a struct named Question for the table
	if err := c.ShouldBindJSON(&question); err != nil {
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

	_, err = db.Query("INSERT INTO questions (text, cv_id) VALUES ($1, $2)", question.Text, question.CVID)
	if err != nil {
		log.Printf("%v %s", err, "error inserting question")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error inserting question"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Question created successfully"})
}
