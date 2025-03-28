-- CreateEnum
CREATE TYPE "plan" AS ENUM ('FREE', 'GOLD', 'DIAMOND');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "plan" "plan" NOT NULL DEFAULT 'FREE';
