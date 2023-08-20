import prisma from "@/libs/prisma";

export const resetDatabase = async () => {
    const deleteCourse = prisma.course.deleteMany();
    await prisma.$transaction([deleteCourse]);
};
