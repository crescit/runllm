package main

import (
	"bytes"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"os/exec"
	"strings"
)

func runLlama(prompt string) (string, error) {
	fmt.Println(prompt)
	cmd := exec.Command("/Users/jjaquez/Documents/llm/prompt/llama.cpp/main", "-t", "10", "-ngl", "1", "-m", "/Users/jjaquez/Documents/llm/prompt/llama.cpp/models/wizardlm-13b-v1.0-uncensored.ggmlv3.q4_1.bin", "--prompt", "\""+prompt+"\"")
	// cmd.Stdin = os.Stdin
	//cmd.Run()
	fmt.Println(cmd.String() + "\n")
	var out bytes.Buffer
	var stderr bytes.Buffer
	cmd.Stdout = &out
	cmd.Stderr = &stderr
	err := cmd.Run()
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
	//c.
	c.String(http.StatusOK, splits[1])
}

func main() {
	router := gin.Default()
	router.POST("/prompt", postPrompt)

	router.Run("localhost:8080")
}
