import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { Role } from '@/models/role'
import CourseRepo from '@/data/courseRepo'
import { courseSchema } from '@/models/ZodSchemas'
import CourseService from '@/services/courseService'

type Course = {
    courseCode: string,
    courseDescription: string,
    numOfEstimatedStudents: number,
    numOfEnrolledStudents: number,
    markerHours: number,
    markerResponsibilities: string,
    needMarkers: boolean,
    markersNeeded: number,
    semester: string,
}

// GET /api/courses/
export async function GET(req: NextRequest) {
    const courses = await CourseRepo.getAllCourses()
    return NextResponse.json(courses, {
        status: 200,
        statusText: 'OK',
    })
}

// POST /api/courses/
export async function POST(req: NextRequest) {
    const token = await getToken({ req })
    if (token!.role != Role.Supervisor &&
        token!.role != Role.Coordinator) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: 'Only supervisors and coordinators can add courses',
            }),
            { status: 403, headers: { 'content-type': 'application/json' } }
        )
    }

    const course: Course = await req.json()
    const result = courseSchema.safeParse(course)
    if (!result.success) {
        return NextResponse.json(result.error, {
            status: 400,
            statusText: result.error.issues[0].message,
        })
    }

    const newCourse = await CourseRepo.addCourse(course)
    return NextResponse.json(newCourse, {
        status: 201,
        statusText: 'Course successfully created!',
    })
}

// PATCH /api/courses
export async function PATCH(req: NextRequest) {
    const token = await getToken({ req });
    if (token!.role !== Role.Coordinator) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: 'Only coordinators can access this endpoint',
            }),
            { status: 403, headers: { 'content-type': 'application/json' } }
        );
    }

    const {
        sourceSemester,
        targetSemester,
    } = await req.json();
    
    const importedCourses = await CourseService.importCourses(sourceSemester, targetSemester);  
    if (importedCourses == null) {
        return NextResponse.json(
            {
                status: 400,
                statusText: 'Error importing courses from ' + sourceSemester + ' to ' + targetSemester
            }, { status: 400 }
        );
    }
    
    return NextResponse.json(importedCourses, {
            status: 200,
            statusText: 'Courses successfully imported from ' + sourceSemester + ' to ' + targetSemester
        }
    )
}
