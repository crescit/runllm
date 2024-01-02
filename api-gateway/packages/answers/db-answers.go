func CreateAnswer(c *gin.Context) {
	var answer Answer // Assuming you have a struct named Answer for the table
	if err := c.ShouldBindJSON(&answer); err != nil {
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

	_, err = db.Query("INSERT INTO answers (q_id, score, text, user_id, timestamp) VALUES ($1, $2, $3, $4, $5)",
		answer.QID, answer.Score, answer.Text, answer.UserID, answer.Timestamp)
	if err != nil {
		log.Printf("%v %s", err, "error inserting answer")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error inserting answer"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Answer created successfully"})
}