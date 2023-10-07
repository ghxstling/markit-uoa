import { NextRequest, NextResponse } from 'next/server';
import CourseRepo from '@/data/courseRepo';
import { getToken } from 'next-auth/jwt';
import { Role } from '@/models/role';

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

    const coursesToImport = await req.json();

    try {
        // This function will handle the database logic to insert multiple courses at once
        const importedCourses = await CourseRepo.importCourses(coursesToImport);

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
