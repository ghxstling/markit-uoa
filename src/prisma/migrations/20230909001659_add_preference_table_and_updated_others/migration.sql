/*
  Warnings:

  - You are about to drop the `_ApplicationToCourse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `equivalentQualification` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `hasCompletedCourse` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `hasMarkedCourse` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `hasTutoredCourse` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `previouslyAchievedGrade` on the `Application` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "_ApplicationToCourse_B_index";

-- DropIndex
DROP INDEX "_ApplicationToCourse_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ApplicationToCourse";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Preference" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "applicationID" INTEGER NOT NULL,
    "courseID" INTEGER NOT NULL,
    "hasCompletedCourse" BOOLEAN NOT NULL,
    "previouslyAchievedGrade" TEXT,
    "hasTutoredCourse" BOOLEAN NOT NULL,
    "hasMarkedCourse" BOOLEAN NOT NULL,
    "equivalentQualification" TEXT,
    CONSTRAINT "Preference_applicationID_fkey" FOREIGN KEY ("applicationID") REFERENCES "Application" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Preference_courseID_fkey" FOREIGN KEY ("courseID") REFERENCES "Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Application" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "applicationStatus" TEXT NOT NULL DEFAULT 'pending',
    "studentID" INTEGER NOT NULL,
    CONSTRAINT "Application_studentID_fkey" FOREIGN KEY ("studentID") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Application" ("applicationStatus", "id", "studentID") SELECT "applicationStatus", "id", "studentID" FROM "Application";
DROP TABLE "Application";
ALTER TABLE "new_Application" RENAME TO "Application";
CREATE UNIQUE INDEX "Application_studentID_key" ON "Application"("studentID");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Preference_applicationID_key" ON "Preference"("applicationID");

-- CreateIndex
CREATE UNIQUE INDEX "Preference_courseID_key" ON "Preference"("courseID");
