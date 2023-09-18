/*
  Warnings:

  - You are about to drop the column `userName` on the `Student` table. All the data in the column will be lost.
  - Added the required column `preferredEmail` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Student" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userID" INTEGER NOT NULL,
    "upi" TEXT NOT NULL,
    "auID" INTEGER NOT NULL,
    "overseas" BOOLEAN NOT NULL DEFAULT false,
    "overseasStatus" TEXT,
    "residencyStatus" BOOLEAN NOT NULL DEFAULT true,
    "validWorkVisa" BOOLEAN DEFAULT true,
    "degreeType" TEXT NOT NULL,
    "degreeYear" INTEGER NOT NULL,
    "maxWorkHours" INTEGER NOT NULL DEFAULT 5,
    "otherContracts" BOOLEAN NOT NULL DEFAULT false,
    "otherContractsDetails" TEXT,
    "academicCV" TEXT,
    "transcript" TEXT,
    CONSTRAINT "Student_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Student" ("academicCV", "auID", "degreeType", "degreeYear", "id", "maxWorkHours", "otherContracts", "otherContractsDetails", "overseas", "overseasStatus", "residencyStatus", "transcript", "upi", "userID", "validWorkVisa") SELECT "academicCV", "auID", "degreeType", "degreeYear", "id", "maxWorkHours", "otherContracts", "otherContractsDetails", "overseas", "overseasStatus", "residencyStatus", "transcript", "upi", "userID", "validWorkVisa" FROM "Student";
DROP TABLE "Student";
ALTER TABLE "new_Student" RENAME TO "Student";
CREATE UNIQUE INDEX "Student_userID_key" ON "Student"("userID");
CREATE UNIQUE INDEX "Student_upi_key" ON "Student"("upi");
CREATE UNIQUE INDEX "Student_auID_key" ON "Student"("auID");
CREATE TABLE "new_Application" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "applicationStatus" TEXT NOT NULL DEFAULT 'pending',
    "studentID" INTEGER NOT NULL,
    "courseID" INTEGER NOT NULL,
    "preferredEmail" TEXT NOT NULL,
    "hasCompletedCourse" BOOLEAN NOT NULL,
    "previouslyAchievedGrade" TEXT,
    "hasTutoredCourse" BOOLEAN NOT NULL,
    "hasMarkedCourse" BOOLEAN NOT NULL,
    "notTakenExplanation" TEXT,
    "equivalentQualification" TEXT,
    CONSTRAINT "Application_studentID_fkey" FOREIGN KEY ("studentID") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Application_courseID_fkey" FOREIGN KEY ("courseID") REFERENCES "Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Application" ("applicationStatus", "courseID", "equivalentQualification", "hasCompletedCourse", "hasMarkedCourse", "hasTutoredCourse", "id", "notTakenExplanation", "previouslyAchievedGrade", "studentID") SELECT "applicationStatus", "courseID", "equivalentQualification", "hasCompletedCourse", "hasMarkedCourse", "hasTutoredCourse", "id", "notTakenExplanation", "previouslyAchievedGrade", "studentID" FROM "Application";
DROP TABLE "Application";
ALTER TABLE "new_Application" RENAME TO "Application";
CREATE UNIQUE INDEX "Application_studentID_key" ON "Application"("studentID");
CREATE UNIQUE INDEX "Application_courseID_key" ON "Application"("courseID");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
