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
	var question Question
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

	question.ID = uuid.New()
	if question.CVID != uuid.Nil {
		_, err = db.Exec("INSERT INTO questions (id, text, cv_id) VALUES ($1, $2, $3)", question.ID, question.Text, question.CVID)
		if err != nil {
			log.Printf("%v %s", err, "error inserting question")
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error inserting question"})
			return
		}
	} else {
		_, err = db.Exec("INSERT INTO questions (id, text) VALUES ($1, $2)", question.ID, question.Text)
		if err != nil {
			log.Printf("%v %s", err, "error inserting question")
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error inserting question"})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "Question created successfully", "question": question})
}
