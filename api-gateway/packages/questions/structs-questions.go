package questions

import "github.com/google/uuid"

// Question represents the Question table in the database
type Question struct {
	ID   uuid.UUID `json:"id"`
	Text string    `json:"text"`
	CVID uuid.UUID `json:"cv_id,omitempty"`
}

type QuestionsData struct {
	CVID      *string  `json:"cv_id"`
	Questions []string `json:"questions"`
	UserID    *string  `json:"user_id"`
}
