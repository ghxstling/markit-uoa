import type { Prisma } from '@prisma/client'
import ApplicationRepo from '@/data/applicationRepo'
import { ApplicationStatus } from '@/models/applicationStatus'
import CourseRepo from '@/data/courseRepo'

type Application = Exclude<Prisma.PromiseReturnType<typeof ApplicationRepo.getApplicationById>, null>
type Course = Exclude<Prisma.PromiseReturnType<typeof CourseRepo.getCourseById>, null>

export default class MarkerService {
    static async getAssignedMarkers(applications: Application[]) {
        const markers = applications.filter((app) => app.applicationStatus === ApplicationStatus.Approved)
        return markers
    }

    static async assignMarkers(applications: Application[], course: Course) {
        try {
            let updatedApplications = new Array<Application>()
            for (const app of applications) {
                await ApplicationRepo.updateApplicationStatus(app.id, ApplicationStatus.Approved)
                const newApplication = await ApplicationRepo.updateAllocatedHours(app.id, app.allocatedHours)
                updatedApplications.push(newApplication)
            }
            if (await this._hasMetRequirements(updatedApplications, course)) {
                await CourseRepo.updateCourse(course.id, { needMarkers: false })
            }
            return updatedApplications
        } catch (err) {
            console.log(err)
            return null
        }
    }

    static async _hasMetRequirements(applications: Application[], course: Course) {
        const totalHours = applications.reduce((total, app) => total + app.allocatedHours, 0)
        const totalMarkers = await this.getAssignedMarkers(applications).then((markers) => markers.length)
        if (totalHours >= course.markerHours && totalMarkers >= course.markersNeeded) {
            return true
        } else {
            return false
        }
    }
}