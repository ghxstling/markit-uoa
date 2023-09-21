import { NextRequest, NextResponse } from 'next/server'
import CourseRepo from '@/data/courseRepo'
import { courseSchema } from '@/models/ZodSchemas'
import { getToken } from 'next-auth/jwt'
import { Role } from '@/models/role'

type Params = {
    params: {
        courseId: string
    }
}

// GET /api/courses/{courseId}
export async function GET(req: NextRequest, { params }: Params) {
    // Store params.courseId into courseId for readability
    const courseId = parseInt(params.courseId)

    // Get the course from the database by ID
    const course = await CourseRepo.getCourseById(courseId)

    // If it doesn't exist, return status code 404 NOT FOUND
    if (course == null) {
        return NextResponse.json(
            {
                status: 404,
                statusText: 'Course not found',
            },
            { status: 404 }
        )
    }

    // Return the course with status code 200 OK
    return NextResponse.json(course, {
        status: 200,
        statusText: 'Found course ' + course.courseCode,
    })
}

// PATCH /api/courses/{courseId}
export async function PATCH(req: NextRequest, { params }: Params) {
    const token = await getToken({ req })
    if (token!.role != Role.Supervisor &&
        token!.role != Role.Coordinator) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: 'Only supervisors and coordinators can update courses',
            }),
            { status: 403, headers: { 'content-type': 'application/json' } }
        )
    }
    // Store params.courseId into courseId for readability
    const courseId = parseInt(params.courseId)

    // Get the course from the database by ID
    const course = await CourseRepo.getCourseById(courseId)

    // If it doesn't exist, return status code 404 NOT FOUND
    if (course == null) {
        return NextResponse.json(
            {
                status: 404,
                statusText: 'Course not found',
            },
            { status: 404 }
        )
    }

    // Get updated course information from supervisor
    const {
        courseCode,
        courseDescription,
        numOfEstimatedStudents,
        numOfEnrolledStudents,
        markerHours,
        markerResponsibilities,
        needMarkers,
        markersNeeded,
        semester,
    } = await req.json()

    // If some information is missing, return code 400 BAD REQUEST
    const result = courseSchema.safeParse({
        courseCode,
        courseDescription,
        numOfEstimatedStudents,
        numOfEnrolledStudents,
        markerHours,
        markerResponsibilities,
        needMarkers,
        markersNeeded,
        semester,
    })

    if (!result.success) {
        return NextResponse.json(result.error, {
            status: 400,
            statusText: result.error.issues[0].message,
        })
    }

    // Update the course information
    const updatedCourse = await CourseRepo.updateCourse(courseId, {
        courseCode,
        courseDescription,
        numOfEstimatedStudents,
        numOfEnrolledStudents,
        markerHours,
        markerResponsibilities,
        needMarkers,
        markersNeeded,
        semester,
    })

    // Return the updated course with status code 200 OK
    return NextResponse.json(updatedCourse, {
        status: 200,
        statusText: 'Updated course information',
    })
}
