import { NextRequest, NextResponse } from 'next/server'
import CourseRepo from '@/data/courseRepo'
import { courseSchema } from '@/models/ZodSchemas'
import { getToken } from 'next-auth/jwt'
import { Role } from '@/models/role'

// GET /api/courses/
export async function GET(req: NextRequest) {}

// POST /api/courses/
export async function POST(req: NextRequest) {}
