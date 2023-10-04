import type { Prisma } from '@prisma/client'
import ApplicationRepo from '@/data/applicationRepo'
import CourseRepo from '@/data/courseRepo'
import { ApplicationStatus } from '@/models/applicationStatus'

type Application = Exclude<Prisma.PromiseReturnType<typeof ApplicationRepo.getApplicationById>, null>
type Course = Exclude<Prisma.PromiseReturnType<typeof CourseRepo.getCourseById>, null>

export default class MarkerService {

    static async getAssignedMarkers(applications: Application[]) {
        const markers = applications.filter((app) => app.applicationStatus === ApplicationStatus.Approved)
        return markers
    }

    static async assignMarkers(applications: Application[]) {
        try {
            const course = await CourseRepo.getCourseById(applications[0]!.courseId)
            const defaultAllocatedHours = Math.floor(course!.markerHours / course!.markersNeeded)
            let updatedApplications = new Array<Application>()
            for (const app of applications) {
                await ApplicationRepo.updateApplicationStatus(app.id, ApplicationStatus.Approved)
                const newApplication = await this._allocateHours(app, defaultAllocatedHours)
                updatedApplications.push(newApplication!)
            }
            if (await this._hasMetRequirements(course!)) {
                await CourseRepo.updateCourse(course!.id, { needMarkers: false })
            }
            return updatedApplications
        } catch (err) {
            console.log(err)
            return null
        }
    }

    static async updateMarker(applicationData: Application) {
        let updatedApplication
        try {
            updatedApplication = await this._allocateHours(applicationData, applicationData.allocatedHours)
            updatedApplication = await this._setQualificationStatus(updatedApplication!, applicationData.isQualified)
            return updatedApplication
        } catch (err) {
            console.log(err)
            return null
        }
    }

    static async removeMarker(application: Application) {
        try {
            const updatedApplication = await ApplicationRepo.updateApplicationStatus(application.id, ApplicationStatus.Denied)
            const course = await CourseRepo.getCourseById(application.courseId)
            if (await this._hasMetRequirements(course!) == false) {
                await CourseRepo.updateCourse(course!.id, { needMarkers: true })
            }
            return updatedApplication
        } catch (err) {
            console.log(err)
            return null
        }
    }

    static async getAllocatedHours(applications: Application[]) {
        const hours = applications.reduce((total, app) => total + app.allocatedHours, 0)
        return hours
    }

    static async _allocateHours(application: Application, hours: number) {
        try {
            const updatedApplication = await ApplicationRepo.updateAllocatedHours(application.id, hours)
            const course = await CourseRepo.getCourseById(updatedApplication.courseId)
            if (await this._hasMetRequirements(course!)) {
                await CourseRepo.updateCourse(course!.id, { needMarkers: false })
            }
            return updatedApplication
        } catch (err) {
            console.log(err)
            return null
        }
    }
    
    static async _setQualificationStatus(application: Application, isQualified: boolean) {
        try {
            const updatedApplication = await ApplicationRepo.updateApplication(application.id, { isQualified })
            return updatedApplication
        } catch (err) {
            console.log(err)
            return null
        }
    }
    
    static async _hasMetRequirements(course: Course) {
        const applications = await ApplicationRepo.getApplicationsByCourse(course!.id)
        const totalHours = await this.getAllocatedHours(applications)
        const totalMarkers = await this.getAssignedMarkers(applications).then((markers) => markers.length)
        if (totalHours >= course.markerHours && totalMarkers >= course.markersNeeded) return true
        else return false
    }
}