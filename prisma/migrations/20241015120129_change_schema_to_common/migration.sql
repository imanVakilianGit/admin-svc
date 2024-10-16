-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "common";

-- CreateEnum
CREATE TYPE "common"."admin_role_enum" AS ENUM ('SUPER_ADMIN', 'ADMIN');

-- CreateTable
CREATE TABLE "common"."admin" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "national_code" TEXT NOT NULL,
    "mobile_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3),
    "role" "common"."admin_role_enum" NOT NULL DEFAULT 'ADMIN',
    "is_valid" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_national_code_key" ON "common"."admin"("national_code");

-- CreateIndex
CREATE UNIQUE INDEX "admin_mobile_number_key" ON "common"."admin"("mobile_number");

-- CreateIndex
CREATE UNIQUE INDEX "admin_email_key" ON "common"."admin"("email");
