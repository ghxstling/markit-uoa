import prisma from "@/libs/prisma";
import type { Prisma } from "@prisma/client";

export default class CourseRepo {
    static async getAllCourses() {
        return await prisma.course.findMany();
    }

    static async getCourseById(id: number) {
        return await prisma.course.findUnique({
            where: { id },
        });
    }

    static async addCourse(data: Prisma.CourseCreateInput) {
        return await prisma.course.create({
            data,
        });
    }

    static async updateCourse(id: number, data: Prisma.CourseUpdateInput) {
        return await prisma.course.update({
            where: { id },
            data,
        });
    }
    static async deleteCourse(id: number) {
        // TODO: implement cascade delete when users are implemented
        return await prisma.course.delete({
            where: { id },
        });
    }
}
