package interviews

import (
	"log"
	"net/http"

	pg2 "github.com/crescit/runllm/api-gateway/postgres"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/lib/pq"
)

type Interview struct {
	ID         uuid.UUID   `json:"id"`
	JobID      uuid.UUID   `json:"job_id"`
	SessionIDs []uuid.UUID `json:"session_ids"`
	ResumeID   uuid.UUID   `json:"resume_id"`
}

func CreateInterview(c *gin.Context) {
	var interview Interview // Assuming you have a struct named Interview for the table
	if err := c.ShouldBindJSON(&interview); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db, err := pg2.NewDatabase()
	if err != nil {
		log.Printf("%v %s", err, "error with database connection")
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
		return
	}
	defer db.Close()

	interview.ID = uuid.New()
	_, err = db.Query("INSERT INTO interview (id, job_id, session_ids, resume_id) VALUES ($1, $2, $3, $4)",
		interview.ID, interview.JobID, pq.Array(interview.SessionIDs), interview.ResumeID)
	if err != nil {
		log.Printf("%v %s", err, "error inserting interview")
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Error inserting interview"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Interview created successfully", "interview": interview})
}
