/*
  Warnings:

  - You are about to drop the column `userID` on the `Student` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Student" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "preferredEmail" TEXT NOT NULL,
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
    CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Student" ("CV", "academicTranscript", "auid", "degreeType", "degreeYear", "id", "maxWorkHours", "otherContracts", "otherContractsDetails", "overseas", "overseasStatus", "preferredEmail", "residencyStatus", "upi", "validWorkVisa") SELECT "CV", "academicTranscript", "auid", "degreeType", "degreeYear", "id", "maxWorkHours", "otherContracts", "otherContractsDetails", "overseas", "overseasStatus", "preferredEmail", "residencyStatus", "upi", "validWorkVisa" FROM "Student";
DROP TABLE "Student";
ALTER TABLE "new_Student" RENAME TO "Student";
CREATE UNIQUE INDEX "Student_userId_key" ON "Student"("userId");
CREATE UNIQUE INDEX "Student_upi_key" ON "Student"("upi");
CREATE UNIQUE INDEX "Student_auid_key" ON "Student"("auid");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
