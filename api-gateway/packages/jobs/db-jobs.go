// Define the Job struct if not already defined

func CreateJob(c *gin.Context) {
	var job Job
	if err := c.ShouldBindJSON(&job); err != nil {
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

	_, err = db.Query("INSERT INTO job (type, resource_path) VALUES ($1, $2)",
		job.Type, job.ResourcePath)
	if err != nil {
		log.Printf("%v %s", err, "error inserting job")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error inserting job"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Job created successfully"})
}
