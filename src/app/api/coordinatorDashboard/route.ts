import { NextRequest, NextResponse } from 'next/server'
import CourseRepo from '@/data/courseRepo'

// GET /api/coordinatorDashboard/
export async function GET(req: NextRequest) {
    // Get the 20 most recently updated courses from the repo
    const courses = await CourseRepo.getUpdatedCoures()

    // Return the courses with status code 200 OK
    return NextResponse.json(courses, {
        status: 200,
        statusText: 'GET successful',
    })
}
