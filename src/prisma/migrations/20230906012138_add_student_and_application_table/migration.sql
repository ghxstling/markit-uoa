-- CreateTable
CREATE TABLE "Student" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userID" INTEGER NOT NULL,
    "userName" TEXT NOT NULL,
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
    CONSTRAINT "Student_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Application" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "applicationStatus" TEXT NOT NULL DEFAULT 'pending',
    "hasCompletedCourse" BOOLEAN NOT NULL,
    "previouslyAchievedGrade" TEXT,
    "hasTutoredCourse" BOOLEAN NOT NULL,
    "hasMarkedCourse" BOOLEAN NOT NULL,
    "equivalentQualification" TEXT,
    "studentID" INTEGER NOT NULL,
    CONSTRAINT "Application_studentID_fkey" FOREIGN KEY ("studentID") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ApplicationToCourse" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ApplicationToCourse_A_fkey" FOREIGN KEY ("A") REFERENCES "Application" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ApplicationToCourse_B_fkey" FOREIGN KEY ("B") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_userID_key" ON "Student"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "Student_upi_key" ON "Student"("upi");

-- CreateIndex
CREATE UNIQUE INDEX "Student_auID_key" ON "Student"("auID");

-- CreateIndex
CREATE UNIQUE INDEX "Application_studentID_key" ON "Application"("studentID");

-- CreateIndex
CREATE UNIQUE INDEX "_ApplicationToCourse_AB_unique" ON "_ApplicationToCourse"("A", "B");

-- CreateIndex
CREATE INDEX "_ApplicationToCourse_B_index" ON "_ApplicationToCourse"("B");
