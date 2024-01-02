CREATE TABLE "questions" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "text" TEXT,
    "cv_id" UUID,
    CONSTRAINT fk_cv FOREIGN KEY ("cv_id") REFERENCES "resume"("id")
);

ALTER TABLE "resume" ALTER COLUMN "id" TYPE UUID USING "id"::UUID;