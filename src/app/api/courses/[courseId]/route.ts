import { NextRequest, NextResponse } from 'next/server'
import CourseRepo from '@/data/courseRepo'

// PATCH /api/courses/{courseId}
export async function PATCH(req: NextRequest, { params }: { params: { courseId: string } }) {
 
    // Store params.id into courseId for readability
    const courseId = parseInt(params.courseId);
    
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

    // Return the updated course with status code 200 OK
    return NextResponse.json(updatedCourse, {
        status: 200,
        statusText: 'Updated course information'
    })
}
