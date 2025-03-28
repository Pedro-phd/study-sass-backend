/*
  Warnings:

  - The primary key for the `plan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `plan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `planId` on the `user` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_planId_fkey";

-- AlterTable
ALTER TABLE "plan" DROP CONSTRAINT "plan_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "plan_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "user" DROP COLUMN "planId",
ADD COLUMN     "planId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
