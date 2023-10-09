import { NextRequest, NextResponse } from 'next/server';
import CourseRepo from '@/data/courseRepo';
import { getToken } from 'next-auth/jwt';
import { Role } from '@/models/role';
import { courseSchema } from '@/models/ZodSchemas';
import { z } from 'zod'

type IncomingCourse = {
    courseCode: string;
    courseDescription: string;
    numOfEstimatedStudents: number;
    numOfEnrolledStudents: number;
    markerHours: number;
    markerResponsibilities: string;
    needMarkers: boolean;
    markersNeeded: number;
    semester: string;
    application: any;  // This field will be removed in the cleansing process
};
type CleanedCourse = Omit<IncomingCourse, 'application'>;


// POST /api/courses/import
export async function POST(req: NextRequest) {
    const token = await getToken({ req });

    // Verify user roles
    if (!token || (token.role !== Role.Supervisor && token.role !== Role.Coordinator)) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: 'Only supervisors and coordinators can import courses',
            }),
            { status: 403, headers: { 'content-type': 'application/json' } }
        );
    }

    let coursesToImport: IncomingCourse[] = await req.json();
    const validationResult = z.array(courseSchema).safeParse(coursesToImport);
    if (!validationResult.success) {
    console.error('Validation failed for imported courses:', validationResult.error);
    return NextResponse.json({ error: 'Invalid course data provided' }, {
        status: 400,
        statusText: validationResult.error.issues[0].message,
    });
}

// Cleanse the imported data by removing the 'application' field
const cleansedCourses: CleanedCourse[] = coursesToImport.map((course: IncomingCourse) => {
    const { application, ...cleanedCourse } = course;
    return cleanedCourse;
});

try {
    // This function will handle the database logic to insert multiple courses at once
    const importedCourses = await CourseRepo.importCourses(cleansedCourses);  

        // Return the imported courses with status code 201 CREATED
        return NextResponse.json({ message: 'Courses successfully imported!' }, {
            status: 201,
        });
    } catch (error) {
        console.error('Error importing courses:', error);
        return NextResponse.json({ error: 'Failed to import courses' }, {
            status: 400,
            statusText: 'Bad Request',
        });
    }
}
