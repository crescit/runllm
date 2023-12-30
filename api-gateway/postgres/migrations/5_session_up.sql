CREATE TABLE "session" (
    "id" BIGSERIAL PRIMARY KEY,
    "name" TEXT,
    "timestamp" NUMERIC,
    "question_ids" bigint[],
    "answer_ids" bigint[],
    "user_id" BIGSERIAL
);

ALTER TABLE "session"  ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id"); 