func CreateInterview(c *gin.Context) {
	var interview Interview // Assuming you have a struct named Interview for the table
	if err := c.ShouldBindJSON(&interview); err != nil {
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

	_, err = db.Query("INSERT INTO interview (job_id, session_ids, resume_id) VALUES ($1, $2, $3)",
		interview.JobID, interview.SessionIDs, interview.ResumeID)
	if err != nil {
		log.Printf("%v %s", err, "error inserting interview")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error inserting interview"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Interview created successfully"})
}