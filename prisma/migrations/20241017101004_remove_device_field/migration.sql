/*
  Warnings:

  - You are about to drop the column `device` on the `admins_on_refresh_tokens` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "common"."admins_on_refresh_tokens" DROP COLUMN "device";
