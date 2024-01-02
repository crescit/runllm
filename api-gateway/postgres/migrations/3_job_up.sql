CREATE TABLE "job" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "type" TEXT,
    "resource_path" TEXT
);