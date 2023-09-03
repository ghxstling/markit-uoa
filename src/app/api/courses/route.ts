import { NextRequest, NextResponse } from 'next/server'
import CourseRepo from '@/data/courseRepo'

// GET /api/courses/
export async function GET(req: NextRequest) {
    // Get all courses from the database
    const courses = await CourseRepo.getAllCourses()

    // Return the courses with status code 200 OK
    return NextResponse.json(courses, {
        status: 200,
        statusText: 'OK',
    })
}

// POST /api/courses/
export async function POST(req: NextRequest) {
    // Wait for supervisor to send course information
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
    // TODO: Add more validation using Zod
    if (
        !courseCode ||
        !courseDescription ||
        !numOfEstimatedStudents ||
        !numOfEnrolledStudents ||
        !markerHours ||
        !markerResponsibilities ||
        !needMarkers ||
        !markersNeeded ||
        !semester
    ) {
        return NextResponse.json({
            status: 400,
            statusText: 'Missing required information',
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
        statusText: 'Created',
    })
}
