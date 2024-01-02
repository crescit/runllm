CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "questions" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "text" TEXT,
    "cv_id" UUID REFERENCES "resume"("id")
);