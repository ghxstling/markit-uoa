import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { Role } from '@/models/role'
import ApplicationRepo from '@/data/applicationRepo'
import StudentRepo from '@/data/studentRepo'
import UserRepo from '@/data/userRepo'

// GET /api/students/me/applications
export async function GET(req: NextRequest) {
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

    const user = await UserRepo.getUserbyEmail(token!.email!)
    const student = await StudentRepo.getStudentByUserId(user!.id)

    if (!student) {
        return NextResponse.json( 
            {
                status: 404,
                statusText: 'Student ' + student!.upi + ' does not exist',
            },
            { status: 404 }
        )
    }
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

    return NextResponse.json(applications, 
        {
            status: 200,
            statusText: 'Applications retrieved successfully',
        }
    )
}
