package main

import (
	"bytes"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"
	"strings"

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

func runLlama(prompt string) (string, error) {
	fmt.Println(prompt)

	// going to have the python service most likely use the llm

	//Wizard-Vicuna-30B-Uncensored.ggmlv3.q6_K.bin
	// cmd := exec.Command("/Users/jjaquez/Documents/llm/prompt/llama.cpp/main", "-t", "10", "-ngl", "1", "-m", "/Users/jjaquez/Documents/llm/prompt/llama.cpp/models/wizardlm-13b-v1.0-uncensored.ggmlv3.q4_1.bin", "--prompt", "\""+prompt+"\"")
	// ./main -t 10 -ngl 32 -m Wizard-Vicuna-30B-Uncensored.ggmlv3.q5_0.bin --color -c 2048 --temp 0.7 --repeat_penalty 1.1 -n -1 -p "### Instruction: Write a story about llamas\n### Response:"
	//cmd := exec.Command("/Users/josh/Projects/llm/llama.cpp/main", "-t", "6", "-ngl", "0", "-m", "/Users/josh/Projects/llm/llama.cpp/models/Wizard-Vicuna-30B-Uncensored.ggmlv3.q6_K.bin", "--temp", "0.7", "--repeat_penalty", "1.1", "-n", "-1", "-p", "\""+prompt+"\"")
	cmd := exec.Command("/Users/josh/Projects/llm/llama.cpp/main", "-t", "6", "-ngl", "0", "-m", "/Users/josh/Projects/llm/llama.cpp/models/wizardlm-7b-v1.0-uncensored.ggmlv3.q4_1.bin", "--prompt", "\""+prompt+"\"")

	fmt.Println(cmd.String() + "\n")
	var out bytes.Buffer
	var stderr bytes.Buffer
	cmd.Stdout = &out
	cmd.Stderr = &stderr
	err := cmd.Start()
	if err != nil {
		fmt.Println(fmt.Sprint(err) + ": " + stderr.String())
	}
	err = cmd.Wait()
	if err != nil {
		fmt.Println(fmt.Sprint(err) + ": " + stderr.String())
	}
	return out.String(), err
}

type Prompt struct {
	Prompt string `json:"prompt"`
}

func postPrompt(c *gin.Context) {
	var newPrompt Prompt
	if err := c.Bind(&newPrompt); err != nil {
		return
	}
	out, err := runLlama(newPrompt.Prompt)
	if err != nil {
		fmt.Errorf("err while running prompt %v", err)
	}
	splits := strings.SplitAfter(out, newPrompt.Prompt)
	fmt.Printf("%v\n", splits)
	c.String(http.StatusOK, splits[1])
}

func main() {
	router := gin.Default()
	// ! only run when there's db migrations to be made
	if os.Getenv("RUN_POSTGRES_MIGRATIONS") == "true" {
		pg.RunMigrations()
	}

	router.POST("/users", users.CreateUser)
	router.POST("/resumes", resumes.CreateResume)
	router.POST("/jobs", jobs.CreateJob)
	router.POST("/interviews", interviews.CreateInterview)
	router.POST("/sessions", sessions.CreateSession)
	router.POST("/questions", questions.CreateQuestions)
	router.POST("/answers", answers.CreateAnswer)

	router.Run()
}
