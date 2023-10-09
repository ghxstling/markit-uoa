/*
  Warnings:

  - A unique constraint covering the columns `[supervisorId]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `supervisorId` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "supervisorId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Supervisor" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Supervisor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Supervisor_userId_key" ON "Supervisor"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Course_supervisorId_key" ON "Course"("supervisorId");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "Supervisor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Supervisor" ADD CONSTRAINT "Supervisor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
