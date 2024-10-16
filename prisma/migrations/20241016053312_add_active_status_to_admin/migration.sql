-- CreateEnum
CREATE TYPE "common"."active_status_enum" AS ENUM ('ACTIVE', 'DE_ACTIVE', 'BLOCK');

-- AlterTable
ALTER TABLE "common"."admin" ADD COLUMN     "active_status" "common"."active_status_enum" NOT NULL DEFAULT 'ACTIVE';
