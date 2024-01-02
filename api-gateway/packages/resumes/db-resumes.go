package resumes

import (
	"log"
	"net/http"

	pg "github.com/crescit/runllm/api-gateway/postgres"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// Resume represents the Resume table in the database
type Resume struct {
	ID     uuid.UUID `json:"id"`
	UserID uuid.UUID `json:"user_id"`
}

func CreateResume(c *gin.Context) {
	var resume Resume // Assuming you have a struct named Resume for the table
	if err := c.ShouldBindJSON(&resume); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if resume.UserID == uuid.Nil {
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

	var insertedID uuid.UUID
	err = db.QueryRow("INSERT INTO resume (user_id) VALUES ($1) RETURNING id", resume.UserID).Scan(&insertedID)
	if err != nil {
		log.Printf("%v %s", err, "error inserting resume")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error inserting resume"})
		return
	}
	resume.ID = insertedID

	c.JSON(http.StatusOK, gin.H{"message": "Resume created successfully", "resume": resume})
}
