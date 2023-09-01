import { NextRequest, NextResponse } from 'next/server'
import CourseRepo from '@/data/courseRepo'

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

// PATCH /api/courses/{id}
export async function PATCH(req: NextRequest) {

    // Get Course ID from URL
    var courseId = +req.url.split('/')[-1]
    console.log(courseId)

    // Get the course from the database by ID
    const course = await CourseRepo.getCourseById(courseId);

    // If it doesn't exist, return status code 404 NOT FOUND
    if (course == null) {
        return NextResponse.json({
            status: 404,
            statusText: ' Course not found'
        });
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
    } = await req.json();

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

    // Return the updated course with status code 204 NO CONTENT
    return NextResponse.json(updatedCourse, {
        status: 204,
        statusText: 'Updated course information'
    })
}
