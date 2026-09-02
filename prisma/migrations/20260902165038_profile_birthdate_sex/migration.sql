-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN "birthDate" TIMESTAMP(3),
                       ADD COLUMN "sex" "Sex";

-- Backfill birthDate from the previous age column so existing profiles
-- keep an (approximate) age instead of losing it outright.
UPDATE "Profile" SET "birthDate" = (CURRENT_DATE - (age || ' years')::interval) WHERE "age" IS NOT NULL;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "age";
