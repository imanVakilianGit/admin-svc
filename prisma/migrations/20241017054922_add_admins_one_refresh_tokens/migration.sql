/*
  Warnings:

  - You are about to drop the column `is_valid` on the `admin` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "common"."admin" DROP COLUMN "is_valid";

-- CreateTable
CREATE TABLE "common"."admins_on_refresh_tokens" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "admin_id" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "user_agent" TEXT NOT NULL,
    "device" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "browser" TEXT NOT NULL,

    CONSTRAINT "admins_on_refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_on_refresh_tokens_admin_id_key" ON "common"."admins_on_refresh_tokens"("admin_id");

-- AddForeignKey
ALTER TABLE "common"."admins_on_refresh_tokens" ADD CONSTRAINT "admins_on_refresh_tokens_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "common"."admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
