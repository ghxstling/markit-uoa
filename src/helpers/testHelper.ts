import prisma from '@/libs/prisma'
import { DegreeType } from '@/models/degreeType'
import { Prisma, User } from '@prisma/client'
import { randomBytes } from 'crypto';

const generateRandomNumber = (n: number): number => {
    const min = Math.pow(10, n - 1);
    const max = Math.pow(10, n) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const resetDatabase = async () => {
    const deleteCourse = prisma.course.deleteMany()
    const deleteApplication = prisma.application.deleteMany()
    const deleteStudent = prisma.student.deleteMany()
    const deleteUser = prisma.user.deleteMany()
    await prisma.$transaction([deleteCourse, deleteApplication, deleteStudent, deleteUser])
}

export const courseInputHelper = (courseCode: string, courseDescription: string): Prisma.CourseCreateInput => {
    return {
        courseCode,
        courseDescription,
        numOfEstimatedStudents: 5,
        numOfEnrolledStudents: 6,
        markerHours: 7,
        needMarkers: true,
        markersNeeded: 9,
        semester: '2022S1',
        markerResponsibilities: 'Marker responsibilities',
    }
}

export const studentInputHelper = (user: User): Prisma.StudentUncheckedCreateInput => {
    return {
        userId: user.id,
        preferredEmail: user.email,
        upi: randomBytes(6).toString('hex').slice(0, 6),
        auid: generateRandomNumber(9),
        degreeType: DegreeType.Bachelor,
        degreeYear: 1,
    }
}
