import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { Role } from '@/models/role'

import ApplicationRepo from '@/data/applicationRepo'
import StudentRepo from '@/data/studentRepo'
import UserRepo from '@/data/userRepo'
import { applicationSchema } from '@/models/ZodSchemas'
import { Application } from '@prisma/client'

// GET /api/applications/
export async function GET(req: NextRequest) {
    const token = await getToken({ req })
    if(token!.role != Role.Supervisor &&
        token!.role != Role.Coordinator) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: 'Only supervisors and coordinators can access this endpoint'
            }),
            { status: 403, headers: { 'content-type': 'application/json' } }
        )
    }

    const applications = await ApplicationRepo.getAllApplications()
    return NextResponse.json(applications, 
        {
            status: 200,
            statusText: 'Applications retrieved successfully',
        }
    )
}

// POST /api/applications/
export async function POST(req: NextRequest) {
    const token = await getToken({ req })
    if(token!.role != Role.Student) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: 'Only students can access this endpoint'
            }),
            { status: 403, headers: { 'content-type': 'application/json' } }
        )
    }

    const user = await UserRepo.getUserbyEmail(token!.email!)
    const student = await StudentRepo.getStudentByUserId(user!.id)

    let applications: Array<Application> = new Array<Application>()
    let prefId = (await ApplicationRepo.getStudentApplications(student!.upi)).length
    const coursePreferences = await req.json()
    for (const pref of coursePreferences) {
        let applicationData = {
            preferenceId: ++prefId,
            studentId: student!.id,
            courseId: pref.course,
            hasCompletedCourse: pref.grade === 'NotTaken' ? false : true,
            previouslyAchievedGrade: pref.grade,
            hasTutoredCourse: pref.tutoredPreviously,
            hasMarkedCourse: pref.markedPreviously,
            notTakenExplanation: pref.explainNotTaken,
            equivalentQualification: pref.explainNotPrevious,
        }
        const result = applicationSchema.safeParse(applicationData)

        if (!result.success) {
            return NextResponse.json(result.error, {
                status: 400,
                statusText: result.error.issues[0].message,
            })
        }

        let application
        const check = await ApplicationRepo.doesApplicationExist(applicationData.studentId, applicationData.courseId)
        if (check == false) {
            application = await ApplicationRepo.createApplication(applicationData)
        } else {
            const exisitingApplication = (await ApplicationRepo.getStudentApplications(student!.upi)).find((apps) => apps.courseId === applicationData.courseId)
            application = await ApplicationRepo.updateApplication(exisitingApplication!.id, applicationData)
        }
        applications.push(application)
    }

    if (applications.length == 0) {
        return NextResponse.json(
        {
            status: 400,
            statusText: 'No applications were created',
        }, { status: 400 })
    }

    return NextResponse.json(applications,
        {
            status: 201,
            statusText: 'Applications created successfully for student ' + student!.upi,
        })
}
