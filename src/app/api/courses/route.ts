import { NextRequest, NextResponse } from 'next/server'
import CourseRepo from '@/data/courseRepo'

// GET /api/courses/{id}
export async function GET(req: NextRequest) {
    // Get course ID from supervisor
    const { courseId } = await req.json()

    // Try get the course from the database by ID
    const course = await CourseRepo.getCourseById(courseId)

    // If it doesn't exist, return status code 404 NOT FOUND
    if (course == null) {
        return NextResponse.json({
            status: 404,
            statusText: 'Course not found',
        })
    }

    // Return the course with status code 200 OK
    return NextResponse.json(course, {
        status: 200,
        statusText: 'Course found',
    })
}

export async function POST(req: NextRequest) {
    // Wait for supervisor to send course information
    const {
        courseCode,
        courseDescription,
        numOfEstimatedStudents,
        numOfEnrolledStudents,
        markerHours,
        needMarkers,
        markersNeeded,
        semester,
        markerResponsibilities,
    } = await req.json()

    // If some information is missing, return code 400 BAD REQUEST
    // TODO: Add more validation using Zod
    if (
        !courseCode ||
        !courseDescription ||
        !numOfEstimatedStudents ||
        !numOfEnrolledStudents ||
        !markerHours ||
        !needMarkers ||
        !markersNeeded ||
        !semester || 
        !markerResponsibilities
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
        needMarkers,
        markersNeeded,
        semester,
        markerResponsibilities,
    })

    // Return the newly created course with status code 201 CREATED
    return NextResponse.json(newCourse, {
        status: 201,
        statusText: 'Created',
    })
}
