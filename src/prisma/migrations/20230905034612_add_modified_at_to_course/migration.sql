-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Course" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "courseCode" TEXT NOT NULL,
    "courseDescription" TEXT NOT NULL,
    "numOfEstimatedStudents" INTEGER NOT NULL,
    "numOfEnrolledStudents" INTEGER NOT NULL,
    "markerHours" INTEGER NOT NULL,
    "markerResponsibilities" TEXT NOT NULL,
    "needMarkers" BOOLEAN NOT NULL DEFAULT true,
    "markersNeeded" INTEGER NOT NULL,
    "semester" TEXT NOT NULL,
    "modifiedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Course" ("courseCode", "courseDescription", "id", "markerHours", "markerResponsibilities", "markersNeeded", "needMarkers", "numOfEnrolledStudents", "numOfEstimatedStudents", "semester") SELECT "courseCode", "courseDescription", "id", "markerHours", "markerResponsibilities", "markersNeeded", "needMarkers", "numOfEnrolledStudents", "numOfEstimatedStudents", "semester" FROM "Course";
DROP TABLE "Course";
ALTER TABLE "new_Course" RENAME TO "Course";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
