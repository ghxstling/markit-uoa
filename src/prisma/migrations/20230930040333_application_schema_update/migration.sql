/*
  Warnings:

  - Added the required column `preferenceId` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "allocatedHours" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "preferenceId" INTEGER NOT NULL;
