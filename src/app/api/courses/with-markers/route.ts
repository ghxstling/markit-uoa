import { Role } from '@/models/role'
import CourseService from '@/services/courseService'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const token = await getToken({ req })

    if (token!.role != Role.Supervisor && token!.role != Role.Coordinator) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: 'Only supervisors and coordinators can add courses',
            }),
            { status: 403, headers: { 'content-type': 'application/json' } }
        )
    }
    const coursesWithMarkerData = await CourseService.getCourseWithMarkerData()
    return NextResponse.json(coursesWithMarkerData, {
        status: 200,
        statusText: 'OK',
    })
}
