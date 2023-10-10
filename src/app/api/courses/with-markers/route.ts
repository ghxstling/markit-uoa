import CourseRepo from '@/data/courseRepo'
import CourseService from '@/services/courseService'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const courses = await CourseRepo.getAllCourses()
    const newCourses = await CourseService.createCourseObjects(courses)

    return NextResponse.json(newCourses, {
        status: 200,
        statusText: 'OK',
    })
}
