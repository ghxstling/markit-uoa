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

type Course = {
    courseCode: string,
    courseDescription: string,
    supervisorId: number | null,
    numOfEstimatedStudents: number,
    numOfEnrolledStudents: number,
    markerHours: number,
    markerResponsibilities: string,
    needMarkers: boolean,
    markersNeeded: number,
    semester: string,
}

// GET /api/courses/{courseId}
export async function GET(req: NextRequest, { params }: Params) {

    const courseId = parseInt(params.courseId)
    const course = await CourseRepo.getCourseById(courseId)
    if (course == null) {
        return NextResponse.json(
            {
                status: 404,
                statusText: 'Course not found',
            },
            { status: 404 }
        )
    }

    const supervisorName = course?.supervisor?.user?.name;
    const supervisorId = course?.supervisorId;

    // Return the course with status code 200 OK, including only the supervisor's name and ID
    return NextResponse.json({
        ...course,
        supervisor: {
            name: supervisorName,
            id: supervisorId
        }
    }, {
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
    
    const courseId = parseInt(params.courseId)
    const course = await CourseRepo.getCourseById(courseId)
    if (course == null) {
        return NextResponse.json(
            {
                status: 404,
                statusText: 'Course not found',
            },
            { status: 404 }
        )
    }

    const courseData: Course = await req.json()
    const result = courseSchema.safeParse(courseData)
    if (!result.success) {
        return NextResponse.json(result.error, {
            status: 400,
            statusText: result.error.issues[0].message,
        })
    }

    const updatedCourse = await CourseRepo.updateCourse(courseId, courseData)
    return NextResponse.json(updatedCourse, {
        status: 200,
        statusText: 'Updated course information',
    })
}

// DELETE /api/courses/{courseId}
export async function DELETE(req: NextRequest, { params }: Params) {
    const token = await getToken({ req })
    if (token!.role != Role.Coordinator) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: 'Only coordinators can access this endpoint',
            }),
            { status: 403, headers: { 'content-type': 'application/json' } }
        )
    }
    
    const courseId = parseInt(params.courseId)
    const course = await CourseRepo.getCourseById(courseId)
    if (course == null) {
        return NextResponse.json(
            {
                status: 404,
                statusText: 'Course not found',
            },
            { status: 404 }
        )
    }

    const deletedCourse = await CourseRepo.deleteCourse(courseId)
    return NextResponse.json(deletedCourse, {
        status: 200,
        statusText: 'Deleted course ID ' + courseId,
    })
}
