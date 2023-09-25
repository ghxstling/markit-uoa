/*
  Warnings:

  - A unique constraint covering the columns `[studentId,courseId]` on the table `Application` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Application_studentId_courseId_key" ON "Application"("studentId", "courseId");
