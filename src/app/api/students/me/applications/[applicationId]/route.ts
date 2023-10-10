import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { Role } from '@/models/role'
import ApplicationRepo from '@/data/applicationRepo'
import StudentRepo from '@/data/studentRepo'
import UserRepo from '@/data/userRepo'

type Params = {
    params: {
        applicationId: string,
    }
}

// GET /api/students/me/applications/[applicationId]
export async function GET(req: NextRequest, { params }: Params) {
    const token = await getToken({ req })
    if(token!.role != Role.Student) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: 'Only students are permitted to access this endpoint.',
            }),
            { status: 403, headers: { 'content-type': 'application/json' } }
        )
    }

    const id = parseInt(params.applicationId)

    const user = await UserRepo.getUserbyEmail(token!.email!)
    const student = await StudentRepo.getStudentByUserId(user!.id)
    const applications = await ApplicationRepo.getStudentApplications(student!.upi)
    if (applications.length === 0) {
        return NextResponse.json( 
            {
                status: 404,
                statusText: 'No applications were found for the student ' + student!.upi,
            },
            { status: 404 }
        )
    }

    const application = await ApplicationRepo.getApplicationById(id)
    if (!application) {
        return NextResponse.json( 
            {
                status: 404,
                statusText: 'Application ID ' + id + ' does not exist',
            },
            { status: 404 }
        )
    }

    if (applications.find(app => app.id === id) === undefined) {
        return NextResponse.json( 
            {
                status: 403,
                statusText: 'Application ID ' + id + ' doesn\'t exist for student ' + student!.upi,
            },
            { status: 403 }
        )
    }

    return NextResponse.json(application, 
        {
            status: 200,
            statusText: 'Application ID ' + id + ' retrieved successfully for student ' + student!.upi,
        }
    )
}

// PATCH /api/students/me/applications/[applicationId]
export async function PATCH(req: NextRequest, { params }: Params) {
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

    const id = parseInt(params.applicationId)
    const application = await ApplicationRepo.getApplicationById(id)
    if (!application) {
        return NextResponse.json( 
            {
                status: 404,
                statusText: 'Application ID ' + id + ' does not exist',
            },
            { status: 404 }
        )
    }

    if (application.studentId !== student!.id) {
        return NextResponse.json( 
            {
                status: 403,
                statusText: 'Internal Error: Application ID ' + id + ' doesn\'t exist for student ' + student!.upi,
            },
            { status: 403 }
        )
    }
    
    const { preferenceId } = await req.json()
    const updatedApplication = await ApplicationRepo.updateCoursePreference(id, preferenceId)
    if (!updatedApplication) {
        const totalApplications = (await ApplicationRepo.getStudentApplications(student!.upi)).length
        return NextResponse.json( 
            {
                status: 400,
                statusText: 'Internal Error: preferenceId ' + preferenceId + ' should be between 1 and ' + totalApplications + ' for student ' + student!.upi,
            },
            { status: 400 }
        )
    }
    
    return NextResponse.json(updatedApplication, 
        {
            status: 200,
            statusText: 'Application ID ' + id + ' updated successfully',
        }
    )
}
