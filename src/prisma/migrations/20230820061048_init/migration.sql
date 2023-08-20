-- CreateTable
CREATE TABLE "Course" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "courseCode" TEXT NOT NULL,
    "courseDescription" TEXT NOT NULL,
    "numOfEstimatedStudents" INTEGER NOT NULL,
    "numOfEnrolledStudents" INTEGER NOT NULL,
    "markerHours" INTEGER NOT NULL,
    "needMarkers" INTEGER NOT NULL,
    "markersNeeded" INTEGER NOT NULL
);
