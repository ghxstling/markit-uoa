import { NextRequest, NextResponse } from 'next/server'
import CourseRepo from '@/data/courseRepo'
import { z } from "zod"

const DEFAULT_ERROR_MSG = "Missing required information"
const courseSchema = z.object({
    courseCode: z.string()
        .toUpperCase()
        .nonempty({ message: "Please provide the Course Code" }),
    courseDescription: z.string()
        .nonempty({ message: "PLease provide the Course Description" }),
    numOfEstimatedStudents: z.number()
        .int()
        .nonnegative(),
    numOfEnrolledStudents: z.number()
        .int().nonnegative(),
    markerHours: z.number()
        .int().nonnegative(),
    markerResponsibilities: z.string()
        .nonempty({ message: "Please add a description of Marker Resposibilities" }),
    needMarkers: z.boolean(),
    markersNeeded: z.number()
        .int().nonnegative(),
    semester: z.string(),
})

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
            statusText: DEFAULT_ERROR_MSG,
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
