CREATE TABLE "session" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" TEXT,
    "timestamp" NUMERIC,
    "question_ids" UUID[],
    "answer_ids" UUID[],
    "user_id" UUID
);

ALTER TABLE "session" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");