import { NextRequest, NextResponse } from 'next/server'
import CourseRepo from '@/data/courseRepo'

// GET /api/courses
// GET /api/courses/{id}
export async function GET(req: NextRequest) {

    // Get the Content-Location header from the HTTP request and split it
    var reqHeaderArray = req.headers.get('Content-Location')?.split('/');
    
    console.log("testing 1")
    // If the Content-Location header is not found, return status code 404 NOT FOUND 
    if (reqHeaderArray == null) {
        console.log("ok NULL")
        return NextResponse.json({
            status: 404,
            statusText: 'Content-Location not found',
        })
    }
    
    // If there is a Content-Location header:

    // If accessing /courses URI:
    console.log("testing 2")
    if (reqHeaderArray[reqHeaderArray.length - 1] == 'courses') {
        console.log("ok COURSES")

        // Get all courses from the database
        const courses = await CourseRepo.getAllCourses();
        console.log(courses);
        // Return all courses with status code 200 OK
        return NextResponse.json(courses, {
            status: 200,
            statusText: 'OK'
        });
    }
    
    console.log("testing 3")
    // If accessing /courses/{id} URI:
    if (!isNaN(+reqHeaderArray[reqHeaderArray.length - 1])) {
        console.log("ok COURSE ID " + reqHeaderArray[-1])
        // Get Course ID
        const courseId = +reqHeaderArray[-1];

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

    return NextResponse.json(reqHeaderArray, {
        status: 500,
        statusText: 'wtf happened',
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
