package jobs

import (
	"log"
	"net/http"

	pg "github.com/crescit/runllm/api-gateway/postgres"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// Job represents the Job table in the database
type Job struct {
	ID           uuid.UUID `json:"id"`
	Type         string    `json:"type"`
	ResourcePath string    `json:"resource_path"`
	Title        string    `json:"title"`
}

func CreateJob(c *gin.Context) {
	var job Job
	if err := c.ShouldBindJSON(&job); err != nil {
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

	job.ID = uuid.New()

	_, err = db.Exec("INSERT INTO job (id, type, resource_path) VALUES ($1, $2, $3)",
		job.ID, job.Type, job.ResourcePath)
	if err != nil {
		log.Printf("%v %s", err, "error inserting job")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error inserting job"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Job created successfully", "job": job})
}
