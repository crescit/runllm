package questions

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

type WebSocketManager struct {
	clients    map[uuid.UUID]chan websocketEvent
	register   chan clientRegistration
	unregister chan uuid.UUID
	questions  chan questionsEvent
}

type clientRegistration struct {
	UserID  uuid.UUID
	Channel chan websocketEvent
}

type websocketEvent struct {
	Event     string
	Questions []Question
}

type questionsEvent struct {
	UserID    uuid.UUID
	Questions []Question
}

// InitializeWebSocketManager creates and initializes a WebSocketManager.
func InitializeWebSocketManager() *WebSocketManager {
	wsm := &WebSocketManager{
		clients:    make(map[uuid.UUID]chan websocketEvent, 100),
		register:   make(chan clientRegistration, 100),
		unregister: make(chan uuid.UUID),
		questions:  make(chan questionsEvent),
	}

	// Goroutine to handle registrations and unregistrations
	go func() {
		for {
			select {
			case registration := <-wsm.register:
				// Handle registration
				wsm.clients[registration.UserID] = registration.Channel
			case userID := <-wsm.unregister:
				// Handle unregistration
				delete(wsm.clients, userID)
			}
		}
	}()

	return wsm
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		// Allowing all connections for demonstration purposes
		return true
	},
}

func (wsm *WebSocketManager) HandleQuestionWebSocket(c *gin.Context) {
	// Parse user ID from the request parameters
	userID, err := uuid.Parse(c.Param("userID"))
	if err != nil {
		log.Printf("Invalid user ID: %v\n", err)

		// Return a meaningful error response to the client
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	log.Printf("%v %s \n", userID, "user id attempted to connect")

	// Set headers for the WebSocket connection
	c.Header("Content-Type", "text/event-stream")
	c.Header("Cache-Control", "no-cache")
	c.Header("Connection", "keep-alive")
	c.Header("Transfer-Encoding", "chunked")

	log.Printf("headers for request %v", c.Request.Header)
	log.Printf("%v %s \n", userID, "user id set headers")

	// Create client registration
	clientChannel := make(chan websocketEvent)
	registration := clientRegistration{UserID: userID, Channel: clientChannel}

	// Handle registration immediately
	err = handleWebSocketRegistration(wsm, registration)
	if err != nil {
		log.Printf("Error registering WebSocket: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upgrade to WebSocket"})
		return
	}

	log.Printf("%v %s \n", userID, "user id did channel thing")

	// Upgrade to WebSocket connection
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Printf("Error upgrading to WebSocket: %v\n", err)
		log.Printf("%v %v %s \n", userID, err, "user id err to connect")

		// Unregister the client if connection fails
		wsm.unregister <- userID
		log.Printf("WebSocket client for user %v unregistered\n", userID)

		// Return a meaningful error response to the client
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upgrade to WebSocket"})
		return
	}
	defer conn.Close()

	// Handle the WebSocket connection
	err = handleWebSocketConnection(conn, userID, wsm, clientChannel)
	if err != nil {
		// Log the error and return an error response to the client
		log.Printf("WebSocket connection error for user %v: %v\n", userID, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "WebSocket connection error"})
	}
}

func handleWebSocketConnection(conn *websocket.Conn, userID uuid.UUID, wsm *WebSocketManager, clientChannel chan websocketEvent) error {
	log.Printf("WebSocket connection for user %v opened\n", userID)

	// Set up defer statement to unregister the client on function exit
	defer func() {
		wsm.unregister <- userID
		log.Printf("WebSocket client for user %v unregistered\n", userID)
	}()

	// Set WebSocket handlers

	conn.SetCloseHandler(func(code int, text string) error {
		log.Printf("WebSocket connection for user %v closed with code %d: %s\n", userID, code, text)
		return nil
	})

	conn.SetPingHandler(func(appData string) error {
		log.Printf("Received Ping from user %v\n", userID)
		return nil
	})

	// Handle WebSocket events in a loop
	for event := range clientChannel {
		// Serialize the collection of questions to JSON and send it to the client
		eventJSON, err := json.Marshal(event)
		if err != nil {
			log.Printf("Error marshaling event for user %v: %v\n", userID, err)
			return err
		}

		log.Printf("%v", eventJSON)
		if err := conn.WriteMessage(websocket.TextMessage, eventJSON); err != nil {
			log.Printf("Error writing message for user %v: %v\n", userID, err)
			return err
		}
	}

	log.Printf("WebSocket connection for user %v closed\n", userID)
	return nil
}

const registrationTimeout = 5 * time.Second

func handleWebSocketRegistration(wsm *WebSocketManager, registration clientRegistration) error {
	select {
	case wsm.register <- registration:
		log.Printf("WebSocket client for user %v registered\n", registration.UserID)
		return nil
	case <-time.After(registrationTimeout):
		err := fmt.Errorf("failed to register WebSocket client for user %v: registration timed out", registration.UserID)
		log.Println(err)
		log.Printf("Channel state: len=%d, cap=%d\n", len(wsm.register), cap(wsm.register))

		// Handle failure, for example, retry or return an error
		// You might want to consider retrying the registration or returning an error here
		// Uncomment the following line to unregister the client on timeout
		// wsm.unregister <- registration.UserID

		// Alternatively, you can return an error to the caller
		return errors.New("registration timed out")
	}
}
