import prisma from '@/libs/prisma'
import { Prisma } from '@prisma/client'

// FIXME: Modify to use more safer inputs

export default class ApplicationRepo {
    static async createApplication(data: Prisma.ApplicationUncheckedCreateInput) {
        return await prisma.application.create({ data })
    }

    static async getApplicationById(id: number) {
        return await prisma.application.findUnique({
            where: { id },
        })
    }

    static async getAllApplications() {
        return await prisma.application.findMany()
    }

    static async getStudentApplications(upi: string) {
        const student = await prisma.student.findUnique({
            where: { upi },
        })
        return await prisma.application.findMany({
            where: { studentId: student?.id },
        })
    }

    static async getApplicationsByCourse(courseId: number) {
        return await prisma.application.findMany({
            where: {
                courseId: courseId 
            },
            include: { course: true },
        })
    }

    static async getApplicationsByStatus(status: string) {
        return await prisma.application.findMany({
            where: { applicationStatus: status },
        })
    }

    static async updateApplicationStatus(id: number, status: string) {
        return await prisma.application.update({
            where: { id },
            data: { applicationStatus: status },
        })
    }

    static async updateCoursePreference(id: number, prefId: number) {
        return await prisma.application.update({
            where: { id },
            data: { preferenceId: prefId },
        })
    }

    // static async updateAllocatedHours(id: number, allocatedHours: number) {
    //     return await prisma.application.update({
    //         where: { id },
    //         data: { allocatedHours: allocatedHours },
    //     })
    // }

    // static async deleteApplication(id: number) {
    //     return await prisma.application.delete({
    //         where: { id },
    //     })
    // }
}
