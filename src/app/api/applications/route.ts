import { NextRequest, NextResponse } from 'next/server'
import ApplicationRepo from '@/data/applicationRepo'
import StudentRepo from '@/data/studentRepo'
import { applicationSchema } from '@/models/ZodSchemas'
import { getToken } from 'next-auth/jwt'
import { Role } from '@/models/role'
import UserRepo from '@/data/userRepo'
import { Application } from '@prisma/client'
import prisma from '@/libs/prisma'

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

    // TODO: FOR TESTING ONLY, DO NOT KEEP !!!
    // await prisma.application.deleteMany()

    const user = await UserRepo.getUserbyEmail(token!.email!)
    const student = await StudentRepo.getStudentByUserId(user!.id)

    let applications: Array<Application> = new Array<Application>()
    const coursePreferences = await req.json()
    for (const pref of coursePreferences) {
        let applicationData = {
            preferenceId: pref.prefId,
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

        const application = await ApplicationRepo.createApplication(applicationData)
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
