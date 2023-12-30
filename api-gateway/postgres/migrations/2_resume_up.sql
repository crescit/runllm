CREATE TABLE "resume" (
    "id" BIGSERIAL  PRIMARY KEY,
    "user_id" BIGSERIAL
);

ALTER TABLE "resume"  ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id"); 