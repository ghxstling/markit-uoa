import prisma from '@/libs/prisma'
import type { Prisma } from '@prisma/client'

export default class CourseRepo {
    static async getAllCourses() {
        return await prisma.course.findMany({
            include: {
                application: true,
            },
        })
    }

    static async getCourseById(id: number) {
        return await prisma.course.findUnique({
            where: { id },
            include: {
                supervisor: {
                    include: {
                        user: true,
                    },
                },
            },
        })
    }

    static async getSupervisorCourses(email: string) {
        const user = await prisma.user.findUnique({
            where: { email },
        })
        if (user == null) {
            return null
        }
        const supervisor = await prisma.supervisor.findUnique({
            where: { userId: user.id },
        })
        if (supervisor == null) {
            return null
        }
        return await prisma.course.findMany({
            where: { supervisorId: supervisor.id },
            include: {
                application: true,
            },
        })
    }

    static async addCourse(data: Prisma.CourseCreateInput) {
        return await prisma.course.create({
            data,
        })
    }

    static async updateCourse(id: number, data: Prisma.CourseUncheckedUpdateInput) {
        return await prisma.course.update({
            where: { id },
            data,
        })
    }

    static async updateCourseSemesters(semester: string, data: Prisma.CourseUpdateManyMutationInput) {
        await prisma.application.deleteMany({
            where: {
                course: {
                    semester,
                },
            },
        })
        return await prisma.course.updateMany({
            where: { semester },
            data,
        })
    }

    static async deleteCourse(id: number) {
        // TODO: implement cascade delete when users are implemented
        return await prisma.course.delete({
            where: { id },
        })
    }
}
