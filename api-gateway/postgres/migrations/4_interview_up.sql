CREATE TABLE "interview" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "job_id" UUID,
    "session_ids" UUID[],
    "resume_id" UUID
);

ALTER TABLE "interview" ADD FOREIGN KEY ("job_id") REFERENCES "job" ("id");