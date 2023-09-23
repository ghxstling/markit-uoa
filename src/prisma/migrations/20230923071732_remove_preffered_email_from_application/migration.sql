/*
  Warnings:

  - You are about to drop the column `preferredEmail` on the `Application` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Application" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "applicationStatus" TEXT NOT NULL DEFAULT 'pending',
    "studentId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "hasCompletedCourse" BOOLEAN NOT NULL,
    "previouslyAchievedGrade" TEXT,
    "hasTutoredCourse" BOOLEAN NOT NULL,
    "hasMarkedCourse" BOOLEAN NOT NULL,
    "notTakenExplanation" TEXT,
    "equivalentQualification" TEXT,
    CONSTRAINT "Application_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Application_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Application" ("applicationStatus", "courseId", "equivalentQualification", "hasCompletedCourse", "hasMarkedCourse", "hasTutoredCourse", "id", "notTakenExplanation", "previouslyAchievedGrade", "studentId") SELECT "applicationStatus", "courseId", "equivalentQualification", "hasCompletedCourse", "hasMarkedCourse", "hasTutoredCourse", "id", "notTakenExplanation", "previouslyAchievedGrade", "studentId" FROM "Application";
DROP TABLE "Application";
ALTER TABLE "new_Application" RENAME TO "Application";
CREATE UNIQUE INDEX "Application_studentId_key" ON "Application"("studentId");
CREATE UNIQUE INDEX "Application_courseId_key" ON "Application"("courseId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
