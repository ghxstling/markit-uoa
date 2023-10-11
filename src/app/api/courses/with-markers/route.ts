import CourseService from '@/services/courseService'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const coursesWithMarkerData = await CourseService.getCourseWithMarkerData()
    return NextResponse.json(coursesWithMarkerData, {
        status: 200,
        statusText: 'OK',
    })
}
