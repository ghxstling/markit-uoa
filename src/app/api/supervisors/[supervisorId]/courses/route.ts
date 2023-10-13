import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { Role } from '@/models/role'
import SupervisorRepo from '@/data/supervisorRepo'
import CourseRepo from '@/data/courseRepo'
import UserRepo from '@/data/userRepo'

type Params = {
    params: {
        supervisorId: string
    }
}

// GET /api/supervisors/[supervisorId]/courses
export async function GET(req: NextRequest, { params }: Params) {
    const token = await getToken({ req })
    if(token!.role != Role.Coordinator) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: 'Only coordinators can access this endpoint'
            }),
            { status: 403, headers: { 'content-type': 'application/json' } }
        )
    }

    const supervisorId = parseInt(params.supervisorId)
    const supervisor = await SupervisorRepo.getSupervisorByUserId(supervisorId)
    if (!supervisor) {
        return NextResponse.json( 
            {
                status: 400,
                statusText: 'Supervisor ID ' + supervisorId + ' does not exist.',
            },
            { status: 400 }
        )
    }

    const user = await UserRepo.getUserById(supervisorId)
    const courses = await CourseRepo.getSupervisorCourses(user!.email)
    return NextResponse.json(courses, 
        {
            status: 200,
            statusText: 'Courses for Supervisor ID ' + supervisor.id + ' retrieved successfully',
        }
    )
}
