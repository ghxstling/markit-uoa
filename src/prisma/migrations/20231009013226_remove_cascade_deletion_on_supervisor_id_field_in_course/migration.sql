-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_supervisorId_fkey";

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "Supervisor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
