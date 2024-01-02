CREATE TABLE "answers" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "q_id" UUID,
    "score" NUMERIC,
    "text" TEXT,
    "user_id" UUID,
    "timestamp" NUMERIC
);

ALTER TABLE "answers" ADD FOREIGN KEY ("q_id") REFERENCES "questions" ("id");
ALTER TABLE "answers" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");