import prisma from '@/libs/prisma'
import { Prisma } from '@prisma/client'

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
