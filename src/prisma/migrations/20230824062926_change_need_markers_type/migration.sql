/*
  Warnings:

  - You are about to alter the column `needMarkers` on the `Course` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Boolean`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Course" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "courseCode" TEXT NOT NULL,
    "courseDescription" TEXT NOT NULL,
    "numOfEstimatedStudents" INTEGER NOT NULL,
    "numOfEnrolledStudents" INTEGER NOT NULL,
    "markerHours" INTEGER NOT NULL,
    "needMarkers" BOOLEAN NOT NULL DEFAULT true,
    "markersNeeded" INTEGER NOT NULL
);
INSERT INTO "new_Course" ("courseCode", "courseDescription", "id", "markerHours", "markersNeeded", "needMarkers", "numOfEnrolledStudents", "numOfEstimatedStudents") SELECT "courseCode", "courseDescription", "id", "markerHours", "markersNeeded", "needMarkers", "numOfEnrolledStudents", "numOfEstimatedStudents" FROM "Course";
DROP TABLE "Course";
ALTER TABLE "new_Course" RENAME TO "Course";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
