import type { Prisma } from '@prisma/client'
import ApplicationRepo from '@/data/applicationRepo'
import CourseRepo from '@/data/courseRepo'
import { ApplicationStatus } from '@/models/applicationStatus'

type Application = Exclude<Prisma.PromiseReturnType<typeof ApplicationRepo.getApplicationById>, null>
type Course = Exclude<Prisma.PromiseReturnType<typeof CourseRepo.getCourseById>, null>
type CourseWithMarkeData = Course & { totalMarkers: number, totalHours: number }

export default class CourseService {

    static async createCourseObjecs(courses: Course[]) {
        let coursesArray = new Array<CourseWithMarkeData>()
        for (const c of courses) {
            const courseApplications = (await ApplicationRepo.getAllApplications())
                .filter(app => app.courseId === c.id)
            const totalMarkers = (await this._getAssignedMarkers(courseApplications)).length
            const totalHours = await this._getAllocatedHours(courseApplications)
            const modifiedCourses = {
                ...c,
                totalMarkers,
                totalHours,
            }
            coursesArray.push(modifiedCourses)
        }
        return coursesArray
    }

    static async _getAssignedMarkers(applications: Application[]) {
        const markers = applications.filter((app) => app.applicationStatus === ApplicationStatus.Approved)
        return markers
    }

    static async _getAllocatedHours(applications: Application[]) {
        const hours = applications.reduce((total, app) => total + app.allocatedHours, 0)
        return hours
    }
}