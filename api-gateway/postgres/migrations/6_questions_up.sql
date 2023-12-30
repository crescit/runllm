CREATE TABLE "questions" (
    "id" BIGSERIAL PRIMARY KEY,
    "text" TEXT,
    "cv_id" BIGINT,
    CONSTRAINT fk_cv FOREIGN KEY ("cv_id") REFERENCES "resume"("id")
);