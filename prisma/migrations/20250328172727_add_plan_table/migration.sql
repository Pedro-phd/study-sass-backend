/*
  Warnings:

  - You are about to drop the column `plan` on the `user` table. All the data in the column will be lost.
  - Added the required column `planId` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "plan",
ADD COLUMN     "planId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "plan";

-- CreateTable
CREATE TABLE "plan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "maxTrails" INTEGER NOT NULL,
    "maxTrailPost" INTEGER NOT NULL,

    CONSTRAINT "plan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
