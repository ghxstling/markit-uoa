import type { Prisma } from '@prisma/client'
import ApplicationRepo from '@/data/applicationRepo'
import CourseRepo from '@/data/courseRepo'
import { ApplicationStatus } from '@/models/applicationStatus'

type Application = Exclude<Prisma.PromiseReturnType<typeof ApplicationRepo.getApplicationById>, null>

export default class CourseService {
    static async getCourseWithMarkerData() {
        const courses = await CourseRepo.getAllCourses()
        const coursesWithMarkerData = courses.map((course) => {
            const assignedMarkers = this._getAssignedMarkers(course.application)
            const allocatedHours = this._getAllocatedHours(course.application)
            const { application, ...courseWithoutApplication } = course
            return { ...courseWithoutApplication, assignedMarkers, allocatedHours }
        })

        return coursesWithMarkerData
    }

    static _getAssignedMarkers(applications: Application[]) {
        const markers = applications.filter((app) => app.applicationStatus === ApplicationStatus.Approved)
        return markers
    }

    static _getAllocatedHours(applications: Application[]) {
        const hours = applications.reduce((total, app) => {
            if (app.applicationStatus === ApplicationStatus.Approved) {
                return total + app.allocatedHours
            }
            return 0
        }, 0)
        return hours
    }
}
