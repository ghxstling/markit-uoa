/*
  Warnings:

  - Added the required column `preferenceId` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Application" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "applicationStatus" TEXT NOT NULL DEFAULT 'pending',
    "allocatedHours" INTEGER NOT NULL DEFAULT 5,
    "preferenceId" INTEGER NOT NULL,
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
CREATE UNIQUE INDEX "Application_preferenceId_key" ON "Application"("preferenceId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
