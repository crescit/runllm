package questions

import (
	"fmt"
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
	CVID uuid.UUID `json:"cv_id,omitempty"`
}

type QuestionsData struct {
	CVID      *string  `json:"cv_id"`
	Questions []string `json:"questions"`
}

func translateQuestionsData(questionsData QuestionsData) ([]Question, error) {
	var cvID uuid.UUID
	if questionsData.CVID != nil {
		parsedID, err := uuid.Parse(*questionsData.CVID)
		if err != nil {
			return nil, fmt.Errorf("invalid cv_id format")
		}
		cvID = parsedID
	}

	var result []Question
	for _, text := range questionsData.Questions {
		question := Question{
			ID:   uuid.New(),
			Text: text,
			CVID: cvID,
		}

		result = append(result, question)
	}

	return result, nil
}

func CreateQuestions(c *gin.Context) {
	var questionsData QuestionsData

	if err := c.ShouldBindJSON(&questionsData); err != nil {
		c.AbortWithStatusJSON(400, gin.H{"error": err.Error()})
		return
	}

	questions, err := translateQuestionsData(questionsData)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"error": err.Error()})
		return
	}

	db, err := pg.NewDatabase()
	if err != nil {
		log.Printf("%v %s", err, "error with database connection")
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
		return
	}
	defer db.Close()

	// Use a transaction for bulk insert
	tx, err := db.Begin()
	if err != nil {
		log.Printf("%v %s", err, "error starting transaction")
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Error starting transaction"})
		return
	}
	defer func() {
		if err := recover(); err != nil {
			log.Printf("%v %s", err, "panic occurred, rolling back transaction")
			tx.Rollback()
		}
	}()

	stmt, err := tx.Prepare("INSERT INTO questions (id, text, cv_id) VALUES ($1, $2, $3)")
	if err != nil {
		log.Printf("%v %s", err, "error preparing statement")
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Error preparing statement"})
		return
	}
	defer stmt.Close()

	for _, q := range questions {
		q.ID = uuid.New()

		if q.CVID == uuid.Nil {
			// Use a different statement when cv_id is nil
			_, err := tx.Exec("INSERT INTO questions (id, text) VALUES ($1, $2)", q.ID, q.Text)
			if err != nil {
				log.Printf("%v %s", err, "error inserting question")
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Error inserting question"})
				return
			}
		} else {
			// Use the original statement when cv_id is not nil
			_, err := stmt.Exec(q.ID, q.Text, q.CVID)
			if err != nil {
				log.Printf("%v %s", err, "error inserting question")
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Error inserting question"})
				return
			}
		}
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%v %s", err, "error committing transaction")
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Error committing transaction"})
		return
	}

	c.JSON(200, gin.H{"questions": questions})
}
