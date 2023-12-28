CREATE TABLE "user" (
    "id" BIGSERIAL,
    "first_name" TEXT,
    "last_name" TEXT,
    "email" TEXT, 
    "auth_id" TEXT PRIMARY KEY,
    "onboard_step" NUMERIC NOT NULL DEFAULT 1
);
