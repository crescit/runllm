CREATE TABLE "answers" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "q_id" UUID REFERENCES "questions" ("id"),
    "score" NUMERIC,
    "text" TEXT,
    "user_id" UUID REFERENCES "user" ("id"),
    "timestamp" NUMERIC
);