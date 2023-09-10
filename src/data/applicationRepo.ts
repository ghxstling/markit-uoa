import prisma from '@/libs/prisma'
import { Prisma } from '@prisma/client'

export default class ApplicationRepo {
    static async createApplication(data: Prisma.UserCreateInput) {
        return await prisma.user.create({ data })
    }

    static async getAllApplications() {
        return await prisma.application.findMany()
    }

    static async getApplicationById(id: number) {
        return await prisma.application.findUnique({
            where: { id }
        })
    }
    
    static async getStudentApplication(upi: string) {
        const student = await prisma.student.findUnique({
            where: { upi },
        })
        return await prisma.application.findUnique({
            where: { studentID: student?.id }
        })
    }
    
    static async getApplicationsByCourse(courseId: number) {
        return await prisma.application.findMany({
            where: {
                Preferences: {
                    some: { courseID: courseId, }
                }
            },
            include: { Preferences: true }
        })        
    }
    
    static async getApplicationsByStatus(status: string) {
        return await prisma.application.findMany({
            where: { applicationStatus: status }
        })
    }

    static async updateApplicationStatus(id: number, status: string) {
        return await prisma.application.update({
            where: { id },
            data: { applicationStatus: status }
        })
    }

    static async addPreferenceToApplication(id: number, data: Prisma.PreferenceCreateWithoutApplicationInput) {
        return await prisma.application.update({
            where: { id },
            data: {
                Preferences: {
                    create: data
                }
            },
            include: { Preferences: true }
        })
    }

    static async removePreferenceFromApplication(id: number, courseID: number) {
        return await prisma.application.update({
            where: { id },
            data: {
                Preferences: {
                    delete: { courseID: courseID }
                }
            },
            include: { Preferences: true }
        })
    }

    static async updateCoursePreference(id: number, data: Prisma.PreferenceUncheckedUpdateWithoutApplicationInput) {
        return await prisma.application.update({
            where: { id },
            data: {
                Preferences: {
                    update: {
                        where: { courseID: Number(data.courseID) },
                        data: data
                    }
                }
            }
        })
    }
}
