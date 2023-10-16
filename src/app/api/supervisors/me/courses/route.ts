import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { Role } from '@/models/role'
import SupervisorRepo from '@/data/supervisorRepo'
import CourseService from '@/services/courseService'

// GET /api/supervisors/me/courses
export async function GET(req: NextRequest) {
    const token = await getToken({ req })
    if (token!.role != Role.Supervisor && token!.role != Role.Coordinator) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: 'Only supervisors and coordinators can access this endpoint',
            }),
            { status: 403, headers: { 'content-type': 'application/json' } }
        )
    }

    const supervisor = await SupervisorRepo.getSupervisorbyEmail(token!.email!)
    if (!supervisor) {
        return NextResponse.json(
            {
                status: 400,
                statusText: 'Internal Error: Supervisor Object with email ' + token!.email! + ' does not exist.',
            },
            { status: 400 }
        )
    }

    const courses = await CourseService.getSupervisorWithMarkerData(token!.email!)
    return NextResponse.json(courses, {
        status: 200,
        statusText: 'Courses for Supervisor ID ' + supervisor.id + ' retrieved successfully',
    })
}
