CREATE TABLE "resume" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "user_id" UUID
);

ALTER TABLE "resume" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");