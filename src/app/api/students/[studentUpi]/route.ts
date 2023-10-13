import { NextRequest, NextResponse } from 'next/server'
import StudentRepo from '@/data/studentRepo'
import { getToken } from 'next-auth/jwt'
import { Role } from '@/models/role'

type Params = {
    params: {
        studentUpi: string
    }
}

// GET /api/students/{studentUpi}
export async function GET(req: NextRequest, { params }: Params) {
    const token = await getToken({ req })
    if (token!.role != Role.Supervisor && token!.role != Role.Coordinator) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: 'Only supervisors and coordinators can access this endpoint',
            }),
            { status: 403, headers: { 'content-type': 'application/json' } }
        )
    }
    const upi = params.studentUpi
    const student = await StudentRepo.getStudentByUpi(upi)
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
