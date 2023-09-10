import prisma from '@/libs/prisma'
import type { Prisma } from '@prisma/client'

export type CreateStudentInputWithConnect = {
    body: Omit<Prisma.StudentCreateInput, 'user'>
    userId: number
}

export default class StudentRepo {
    static async getAllStudents() {
        return await prisma.student.findMany()
    }

    static async getStudentByUpi(upi: string) {
        return await prisma.student.findUnique({
            where: { upi },
        })
    }

    static async createStudent(input: CreateStudentInputWithConnect) {
        const { body, userId } = input
        return await prisma.student.create({
            data: {
                ...body,
                user: {
                    connect: { id: userId },
                },
            },
        })
    }

    static async updateStudentDetails(
        upi: string,
        data: Prisma.StudentUpdateInput
    ) {
        return await prisma.student.update({
            where: { upi },
            data,
        })
    }
}
