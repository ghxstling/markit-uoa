import prisma from "@/libs/prisma";
import type { Prisma } from "@prisma/client";

export default class StudentRepo {
    static async getAllStudents() {
        return await prisma.student.findMany();
    }

    static async getStudentByUpi(upi: string) {
        return await prisma.student.findUnique({
            where: { upi },
        });
    }

    static async addStudent(data: Prisma.StudentUncheckedCreateInput) {
        return await prisma.student.create({
            data,
        });
    }

    static async setCVFilename(upi: string, fileName: string) {
        return await prisma.student.update({
            where: { upi },
            data: { CV: fileName}
        })
    }

    static async setTranscriptFilename(upi: string, fileName: string) {
        return await prisma.student.update({
            where: { upi },
            data: { academicTranscript: fileName}
        })
    }

    static async updateStudent(upi: string, data: Prisma.StudentUncheckedCreateInput) {
        return await prisma.student.update({
            where: { upi },
            data,
        });
    }
}
