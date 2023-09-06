import { NextRequest, NextResponse } from 'next/server'
import CourseRepo from '@/data/courseRepo'
import { courseSchema } from '@/models/ZodSchemas'
import { getToken } from 'next-auth/jwt'
import { Role } from '@/models/role'

type Params = {
    params: {
        courseId: string
    }
}

// GET /api/courses/{courseId}
export async function GET(req: NextRequest, { params }: Params) {}

// PATCH /api/courses/{courseId}
export async function PATCH(req: NextRequest, { params }: Params) {}
