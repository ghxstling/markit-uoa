/*
  Warnings:

  - You are about to drop the column `academicCV` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `auID` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `transcript` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `userID` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `courseID` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `studentID` on the `Application` table. All the data in the column will be lost.
  - Added the required column `auid` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseId` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Student" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "upi" TEXT NOT NULL,
    "auid" INTEGER NOT NULL,
    "overseas" BOOLEAN NOT NULL DEFAULT false,
    "overseasStatus" TEXT,
    "residencyStatus" BOOLEAN NOT NULL DEFAULT true,
    "validWorkVisa" BOOLEAN DEFAULT true,
    "degreeType" TEXT NOT NULL,
    "degreeYear" INTEGER NOT NULL,
    "maxWorkHours" INTEGER NOT NULL DEFAULT 5,
    "otherContracts" BOOLEAN NOT NULL DEFAULT false,
    "otherContractsDetails" TEXT,
    "CV" TEXT,
    "academicTranscript" TEXT,
    CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Student" ("degreeType", "degreeYear", "id", "maxWorkHours", "otherContracts", "otherContractsDetails", "overseas", "overseasStatus", "residencyStatus", "upi", "validWorkVisa") SELECT "degreeType", "degreeYear", "id", "maxWorkHours", "otherContracts", "otherContractsDetails", "overseas", "overseasStatus", "residencyStatus", "upi", "validWorkVisa" FROM "Student";
DROP TABLE "Student";
ALTER TABLE "new_Student" RENAME TO "Student";
CREATE UNIQUE INDEX "Student_userId_key" ON "Student"("userId");
CREATE UNIQUE INDEX "Student_upi_key" ON "Student"("upi");
CREATE UNIQUE INDEX "Student_auid_key" ON "Student"("auid");
CREATE TABLE "new_Application" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "applicationStatus" TEXT NOT NULL DEFAULT 'pending',
    "studentId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "preferredEmail" TEXT NOT NULL,
    "hasCompletedCourse" BOOLEAN NOT NULL,
    "previouslyAchievedGrade" TEXT,
    "hasTutoredCourse" BOOLEAN NOT NULL,
    "hasMarkedCourse" BOOLEAN NOT NULL,
    "notTakenExplanation" TEXT,
    "equivalentQualification" TEXT,
    CONSTRAINT "Application_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Application_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Application" ("applicationStatus", "equivalentQualification", "hasCompletedCourse", "hasMarkedCourse", "hasTutoredCourse", "id", "notTakenExplanation", "preferredEmail", "previouslyAchievedGrade") SELECT "applicationStatus", "equivalentQualification", "hasCompletedCourse", "hasMarkedCourse", "hasTutoredCourse", "id", "notTakenExplanation", "preferredEmail", "previouslyAchievedGrade" FROM "Application";
DROP TABLE "Application";
ALTER TABLE "new_Application" RENAME TO "Application";
CREATE UNIQUE INDEX "Application_studentId_key" ON "Application"("studentId");
CREATE UNIQUE INDEX "Application_courseId_key" ON "Application"("courseId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
