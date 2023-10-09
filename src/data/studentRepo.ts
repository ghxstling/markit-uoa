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

    static async getStudentByEmail(email: string) {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        })
        if (user == null) {
            return null
        }
        return await prisma.student.findUnique({
            where: {
                userId: user.id,
            },
        })
    }

    static async createStudentFromEmail(email: string, data: Prisma.StudentUncheckedCreateWithoutUserInput) {
        const user = await prisma.user.findUnique({
            where: { email },
        })
        return await prisma.student.upsert({
            where: {
                userId: user!.id,
            },
            update: {
                ...data,
            },
            create: {
                ...data,
                userId: user!.id,
            },
        })
    }

    static async updateStudentDetails(upi: string, data: Prisma.StudentUpdateInput) {
        return await prisma.student.update({
            where: { upi },
            data,
        })
    }

    static async getStudentByUserId(userId: number) {
        return await prisma.student.findUnique({
            where: { userId },
        })
    }

    static async setCVFilename(upi: string, fileName: string) {
        return await prisma.student.update({
            where: { upi },
            data: { CV: fileName },
        })
    }

    static async setTranscriptFilename(upi: string, fileName: string) {
        return await prisma.student.update({
            where: { upi },
            data: { academicTranscript: fileName },
        })
    }
}

//TODO: application Id to student
