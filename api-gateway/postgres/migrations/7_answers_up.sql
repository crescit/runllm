CREATE TABLE "answers" (
    "id" BIGSERIAL  PRIMARY KEY,
    "q_id" BIGSERIAL,
    "score" NUMERIC,
    "text" TEXT,
    "user_id" BIGSERIAL,
    "timestamp" NUMERIC
);

ALTER TABLE "answers"  ADD FOREIGN KEY ("q_id") REFERENCES "questions" ("id"); 
ALTER TABLE "answers"  ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id"); 