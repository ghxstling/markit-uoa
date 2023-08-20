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
}
