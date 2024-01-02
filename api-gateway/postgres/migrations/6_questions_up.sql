CREATE TABLE "questions" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "text" TEXT,
    "cv_id" UUID,
    CONSTRAINT "fk_cv" FOREIGN KEY ("cv_id") REFERENCES "resume"("id") ON DELETE CASCADE
);

-- Modify the foreign key constraint to allow DEFERRABLE INITIALLY DEFERRED
ALTER TABLE "questions"
    ALTER CONSTRAINT "fk_cv" DEFERRABLE INITIALLY DEFERRED;