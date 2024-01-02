func CreateResume(c *gin.Context) {
	var resume Resume // Assuming you have a struct named Resume for the table
	if err := c.ShouldBindJSON(&resume); err != nil {
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

	_, err = db.Query("INSERT INTO resume (user_id) VALUES ($1)", resume.UserID)
	if err != nil {
		log.Printf("%v %s", err, "error inserting resume")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error inserting resume"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Resume created successfully"})
}