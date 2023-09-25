-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Student" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userID" INTEGER NOT NULL,
    "preferredEmail" TEXT NOT NULL,
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
    CONSTRAINT "Student_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Student" ("auID", "degreeType", "degreeYear", "id", "maxWorkHours", "otherContracts", "otherContractsDetails", "overseas", "overseasStatus", "preferredEmail", "residencyStatus", "upi", "userID", "validWorkVisa") SELECT "auID", "degreeType", "degreeYear", "id", "maxWorkHours", "otherContracts", "otherContractsDetails", "overseas", "overseasStatus", "preferredEmail", "residencyStatus", "upi", "userID", "validWorkVisa" FROM "Student";
DROP TABLE "Student";
ALTER TABLE "new_Student" RENAME TO "Student";
CREATE UNIQUE INDEX "Student_userID_key" ON "Student"("userID");
CREATE UNIQUE INDEX "Student_upi_key" ON "Student"("upi");
CREATE UNIQUE INDEX "Student_auID_key" ON "Student"("auID");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
