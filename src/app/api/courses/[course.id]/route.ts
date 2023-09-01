import { NextRequest, NextResponse } from 'next/server'
import CourseRepo from '@/data/courseRepo'

// PATCH /api/courses/{course.id}
export async function PATCH(req: NextRequest) {

    // Get Course ID from URL
    console.log("url: " + req.url)
    var courseId = parseInt(req.url.split('/')[-1])
    console.log("number: " + courseId)
    
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
