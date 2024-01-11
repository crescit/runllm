package questions

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

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
	userID, err := uuid.Parse(c.Param("userID"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	log.Printf("%v %s \n", userID, "user id attempted to connect")

	c.Header("Content-Type", "text/event-stream")
	c.Header("Cache-Control", "no-cache")
	c.Header("Connection", "keep-alive")
	c.Header("Transfer-Encoding", "chunked")

	log.Printf("%v %s \n", userID, "user id set headers")

	// Create client registration
	clientChannel := make(chan websocketEvent)
	registration := clientRegistration{UserID: userID, Channel: clientChannel}

	// Handle registration immediately
	handleWebSocketRegistration(wsm, registration)

	log.Printf("%v %s \n", userID, "user id did channel thing")

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("Error upgrading to WebSocket:", err)
		log.Printf("%v %v %s \n", userID, err, "user id err to connect")

		// Unregister the client if connection fails
		wsm.unregister <- userID
		log.Printf("WebSocket client for user %v unregistered\n", userID)

		return
	}
	defer conn.Close()

	handleWebSocketConnection(conn, userID, wsm, clientChannel)
}

func handleWebSocketConnection(conn *websocket.Conn, userID uuid.UUID, wsm *WebSocketManager, clientChannel chan websocketEvent) {
	log.Printf("WebSocket connection for user %v opened\n", userID)

	conn.SetCloseHandler(func(code int, text string) error {
		log.Printf("WebSocket connection for user %v closed with code %d: %s\n", userID, code, text)
		return nil
	})

	// Set a PingHandler to check if the connection is still open
	conn.SetPingHandler(func(appData string) error {
		log.Printf("Received Ping from user %v\n", userID)
		return nil
	})

	for event := range clientChannel {
		// Serialize the collection of questions to JSON and send it to the client
		eventJSON, err := json.Marshal(event)
		if err != nil {
			log.Println("Error marshaling event:", err)
			continue
		}

		log.Printf("%v", eventJSON)
		if err := conn.WriteMessage(websocket.TextMessage, eventJSON); err != nil {
			log.Println("Error writing message:", err)
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("Unexpected close error: %v\n", err)
			}
			return
		}
	}

	log.Printf("WebSocket connection for user %v closed\n", userID)
}

func handleWebSocketRegistration(wsm *WebSocketManager, registration clientRegistration) {
	select {
	case wsm.register <- registration:
		log.Printf("WebSocket client for user %v registered\n", registration.UserID)
		return
	default:
		err := fmt.Errorf("failed to register WebSocket client for user %v", registration.UserID)
		log.Println(err)
		log.Printf("Channel state: len=%d, cap=%d\n", len(wsm.register), cap(wsm.register))
		// Handle failure, perhaps return an error or retry
		return
	}
	// todo might need to unregister
	// defer func() {
	// 		wsm.unregister <- registration.UserID
	// 		log.Printf("WebSocket client for user %v unregistered\n", registration.UserID)
	// 	}()
}
