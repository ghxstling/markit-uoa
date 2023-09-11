/*
  Warnings:

  - You are about to drop the `Preference` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `courseID` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hasCompletedCourse` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hasMarkedCourse` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hasTutoredCourse` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Preference_courseID_key";

-- DropIndex
DROP INDEX "Preference_applicationID_key";

-- AlterTable
ALTER TABLE "Student" ADD COLUMN "academicCV" TEXT;
ALTER TABLE "Student" ADD COLUMN "transcript" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Preference";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Application" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "applicationStatus" TEXT NOT NULL DEFAULT 'pending',
    "studentID" INTEGER NOT NULL,
    "courseID" INTEGER NOT NULL,
    "hasCompletedCourse" BOOLEAN NOT NULL,
    "previouslyAchievedGrade" TEXT,
    "hasTutoredCourse" BOOLEAN NOT NULL,
    "hasMarkedCourse" BOOLEAN NOT NULL,
    "notTakenExplanation" TEXT,
    "equivalentQualification" TEXT,
    CONSTRAINT "Application_studentID_fkey" FOREIGN KEY ("studentID") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Application_courseID_fkey" FOREIGN KEY ("courseID") REFERENCES "Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Application" ("applicationStatus", "id", "studentID") SELECT "applicationStatus", "id", "studentID" FROM "Application";
DROP TABLE "Application";
ALTER TABLE "new_Application" RENAME TO "Application";
CREATE UNIQUE INDEX "Application_studentID_key" ON "Application"("studentID");
CREATE UNIQUE INDEX "Application_courseID_key" ON "Application"("courseID");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
