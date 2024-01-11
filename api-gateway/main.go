package main

import (
	"log"
	"os"

	"github.com/crescit/runllm/api-gateway/packages/answers"
	"github.com/crescit/runllm/api-gateway/packages/interviews"
	"github.com/crescit/runllm/api-gateway/packages/jobs"
	"github.com/crescit/runllm/api-gateway/packages/questions"
	"github.com/crescit/runllm/api-gateway/packages/resumes"
	"github.com/crescit/runllm/api-gateway/packages/sessions"
	"github.com/crescit/runllm/api-gateway/packages/users"
	pg "github.com/crescit/runllm/api-gateway/postgres"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func init() {
	// loads values from .env into the system
	if err := godotenv.Load(); err != nil {
		log.Print("No .env file found")
	}
}

func main() {
	router := gin.Default()
	// ! only run when there's db migrations to be made
	if os.Getenv("RUN_POSTGRES_MIGRATIONS") == "true" {
		pg.RunMigrations()
	}

	questionsWebSocketManager := questions.InitializeWebSocketManager()

	router.POST("/users", users.CreateUser)
	router.POST("/resumes", resumes.CreateResume)
	router.POST("/jobs", jobs.CreateJob)
	router.POST("/interviews", interviews.CreateInterview)
	router.POST("/sessions", sessions.CreateSession)
	router.POST("/questions", questions.CreateQuestions(questionsWebSocketManager))
	// router.GET("/questions/:userID", questions.HandleQuestionWebSocket)
	router.GET("/questions/:userID", questionsWebSocketManager.HandleQuestionWebSocket)
	router.POST("/answers", answers.CreateAnswer)

	router.Run()
}
