import { NextRequest, NextResponse } from "next/server";
import CourseRepo from "@/data/courseRepo";

// POST /api/add-course
export async function POST(req: NextRequest) {

    // Wait for supervisor to send course information
    const { courseCode, courseDescription,
        numOfEstimatedStudents, numOfEnrolledStudents,
        markerHours, needMarkers, markersNeeded } = await req.json();

    // If some information is missing, return code 400 BAD REQUEST 
    if ( !courseCode || !courseDescription || 
        !numOfEstimatedStudents || !numOfEnrolledStudents ||
        !markerHours || !needMarkers || !markersNeeded ) {
            return NextResponse.json({
                status: 400,
                statusText: "Missing required information"
            })
        }

    // Add course to database
    const newCourse = await CourseRepo.addCourse({
            courseCode: courseCode,
            courseDescription: courseDescription,
            numOfEstimatedStudents: numOfEstimatedStudents,
            numOfEnrolledStudents: numOfEnrolledStudents,
            markerHours: markerHours,
            needMarkers: needMarkers,
            markersNeeded: markersNeeded
        });
    
    // Return the newly created course with status code 201 CREATED
    return NextResponse.json(newCourse, {
        status: 201,
        statusText: "Created"
    });
}
