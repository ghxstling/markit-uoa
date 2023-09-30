import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { Role } from '@/models/role'
import ApplicationRepo from '@/data/applicationRepo'
import StudentRepo from '@/data/studentRepo'

type Params = {
    params: {
        studentUpi: string
    }
}

// GET /api/students/[studentUpi]/applications
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

    return NextResponse.json(applications, 
        {
            status: 200,
            statusText: 'Applications retrieved successfully',
        }
    )
}
