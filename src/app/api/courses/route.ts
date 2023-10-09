import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { Role } from '@/models/role'
import CourseRepo from '@/data/courseRepo'
import { courseSchema } from '@/models/ZodSchemas'
import CourseService from '@/services/courseService'

// GET /api/courses/
export async function GET(req: NextRequest) {
    const courses = await CourseRepo.getAllCourses()
    const newCourses = await CourseService.createCourseObjecs(courses)

    return NextResponse.json(newCourses, {
        status: 200,
        statusText: 'OK',
    })
}

// POST /api/courses/
export async function POST(req: NextRequest) {
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
    // Wait for supervisor/coordinator to send course information
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

    // Add course to database
    const newCourse = await CourseRepo.addCourse({
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

    // Return the newly created course with status code 201 CREATED
    return NextResponse.json(newCourse, {
        status: 201,
        statusText: 'Course successfully created!',
    })
}
