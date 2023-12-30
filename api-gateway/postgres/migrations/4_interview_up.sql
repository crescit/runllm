CREATE TABLE "interview" (
    "id" BIGSERIAL  PRIMARY KEY,
    "job_id" BIGSERIAL,
    "session_ids" bigint[],
    "resume_id" BIGSERIAL
);

ALTER TABLE "interview"  ADD FOREIGN KEY ("job_id") REFERENCES "job" ("id"); 