import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { Role } from '@/models/role'
import ApplicationRepo from '@/data/applicationRepo'
import StudentRepo from '@/data/studentRepo'

type Params = {
    params: {
        studentUpi: string,
        applicationId: string,
    }
}

// GET /api/students/[studentUpi]/applications/[applicationId]
export async function GET(req: NextRequest, { params }: Params) {
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

    const upi = params.studentUpi
    const id = parseInt(params.applicationId)

    const student = await StudentRepo.getStudentByUpi(upi)
    if (!student) {
        return NextResponse.json( 
            {
                status: 404,
                statusText: 'Student ' + upi + ' does not exist',
            },
            { status: 404 }
        )
    }

    const applications = await ApplicationRepo.getStudentApplications(upi)
    if (applications.length === 0) {
        return NextResponse.json( 
            {
                status: 404,
                statusText: 'No applications were found for the student ' + upi,
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
                statusText: 'Application ID ' + id + ' doesn\'t exist for student ' + upi,
            },
            { status: 403 }
        )
    }

    return NextResponse.json(application, 
        {
            status: 200,
            statusText: 'Application ID ' + id + ' retrieved successfully for student ' + upi ,
        }
    )
}
