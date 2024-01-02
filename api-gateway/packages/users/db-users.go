package users

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

pg "github.com/crescit/runllm/api-gateway/postgres"

type Answer struct {
	QID       int    `json:"q_id"`
	Score     float64 `json:"score"`
	Text      string  `json:"text"`
	UserID    int    `json:"user_id"`
	Timestamp float64 `json:"timestamp"`
}

type Job struct {
	Type         string `json:"type"`
	ResourcePath string `json:"resource_path"`
}

type User struct {
	InterviewIDs []int `json:"interview_ids"`
}

type Question struct {
	Text string `json:"text"`
	CVID int    `json:"cv_id"`
}

type Session struct {
	Name       string   `json:"name"`
	Timestamp  float64  `json:"timestamp"`
	QuestionIDs []int   `json:"question_ids"`
	AnswerIDs   []int   `json:"answer_ids"`
	UserID     int      `json:"user_id"`
}

type Interview struct {
	JobID     int   `json:"job_id"`
	SessionIDs []int `json:"session_ids"`
	ResumeID   int   `json:"resume_id"`
}

type Resume struct {
	UserID int `json:"user_id"`
}

func CreateUser(c *gin.Context) {
	var user User // Assuming you have a struct named User for the table
	if err := c.ShouldBindJSON(&user); err != nil {
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

	_, err = db.Query("INSERT INTO user (interview_ids) VALUES ($1)", user.InterviewIDs)
	if err != nil {
		log.Printf("%v %s", err, "error inserting user")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error inserting user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User created successfully"})
}
