import { NextRequest, NextResponse } from 'next/server'
import StudentRepo from '@/data/studentRepo'
import { getToken } from 'next-auth/jwt'
import { Role } from '@/models/role'

// GET /api/students/me
export async function GET(req: NextRequest) {
    const token = await getToken({ req })
    if (token!.role != Role.Student) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: 'Only students can access this endpoint',
            }),
            { status: 403, headers: { 'content-type': 'application/json' } }
        )
    }

    const student = await StudentRepo.getStudentByEmail(token!.email!)
    if (student == null) {
        return NextResponse.json(
            {
                status: 404,
                statusText: 'Student not found',
            },
            { status: 404 }
        )
    }
    return NextResponse.json(student, {
        status: 200,
        statusText: 'Found student ' + student.upi,
    })
}
