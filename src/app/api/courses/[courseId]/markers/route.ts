import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { Role } from '@/models/role'
import ApplicationRepo from '@/data/applicationRepo'
import CourseRepo from '@/data/courseRepo'
import MarkerService from '@/services/markerService'

type Params = {
    params: {
        courseId: string
    }
}

// GET /api/courses/[courseId]/markers
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

    const courseId = parseInt(params.courseId)
    const course = await CourseRepo.getCourseById(courseId)
    if (!course) {
        return NextResponse.json( 
            {
                status: 404,
                statusText: 'Course ID ' + courseId + ' does not exist',
            },
            { status: 404 }
        )
    }

    const applications = await ApplicationRepo.getApplicationsByCourse(courseId)
    if (applications.length === 0) {
        return NextResponse.json( 
            {
                status: 404,
                statusText: 'No applications were found for this course',
            },
            { status: 404 }
        )
    }

    const markers = await MarkerService.getAssignedMarkers(applications)
    if (markers.length === 0) {
        return NextResponse.json( 
            {
                status: 404,
                statusText: 'No markers were found for this course',
            },
            { status: 404 }
        )
    }

    return NextResponse.json(markers, 
        {
            status: 200,
            statusText: 'Markers retrieved successfully',
        }
    )
}
