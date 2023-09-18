import prisma from '@/libs/prisma'
import type { Prisma } from '@prisma/client'

// FIXME: Modify to use more safer inputs

export default class StudentRepo {
    static async getAllStudents() {
        return await prisma.student.findMany()
    }

    static async getStudentByUpi(upi: string) {
        return await prisma.student.findUnique({
            where: { upi },
        })
    }

    static async createStudent(data: Prisma.StudentUncheckedCreateInput) {
        return await prisma.student.create({
            data,
        })
    }

    static async updateStudentDetails(upi: string, data: Prisma.StudentUpdateInput) {
        return await prisma.student.update({
            where: { upi },
            data,
        })
    }
}
