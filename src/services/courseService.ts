import type { Prisma } from '@prisma/client'
import ApplicationRepo from '@/data/applicationRepo'
import CourseRepo from '@/data/courseRepo'
import { ApplicationStatus } from '@/models/applicationStatus'

type Application = Exclude<Prisma.PromiseReturnType<typeof ApplicationRepo.getApplicationById>, null>

export default class CourseService {
    static async getCourseWithMarkerData() {
        const courses = await CourseRepo.getAllCourses()
        const coursesWithMarkerData = courses.map((course) => {
            const assignedMarkers = this._getAssignedMarkers(course.application).length
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

    static async importCourses(source: string, target: string) {
        const coursesToUpdate = (await CourseRepo.getAllCourses()).filter((course) => course.semester === source)
        const updatedCoursesCount = await CourseRepo.updateCourseSemesters(source, { semester: target, needMarkers: true })
        if (coursesToUpdate.length === updatedCoursesCount.count) {
            const updatedCourses = (await CourseRepo.getAllCourses()).filter((course) => course.semester === target)
            return updatedCourses
        } else {
            return null
        }
    }
}
