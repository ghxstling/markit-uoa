import { NextRequest, NextResponse } from 'next/server'
import StudentRepo from '@/data/studentRepo'
import { getToken } from 'next-auth/jwt'
import { Role } from '@/models/role'
import S3Service from '@/services/s3Service'

type Params = {
    params: {
        studentUpi: string
    }
}

// GET /api/students/{studentUpi}/transcript
export async function GET(req: NextRequest, { params }: Params) {
    // Check user token for authorised credentials
    const token = await getToken({ req })
    if (token!.role != Role.Supervisor && token!.role != Role.Coordinator) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: 'Only supervisors and coordinators are permitted to access this endpoint.',
            }),
            { status: 403, headers: { 'content-type': 'application/json' } }
        )
    }

    // Store params.studentUpi into upi for readability
    const upi = params.studentUpi

    // Get the student from the database by UPI
    const student = await StudentRepo.getStudentByUpi(upi)

    // If it doesn't exist, return status code 404 NOT FOUND
    if (student == null) {
        return NextResponse.json(
            {
                status: 404,
                statusText: 'Student not found',
            },
            { status: 404 }
        )
    }

    // Get file name of transcript from student
    const fileName = student.academicTranscript

    // If no file name exists under student, return 404 NOT FOUND
    if (!fileName) {
        return NextResponse.json(
            {
                success: false,
                status: 404,
                statusText: 'Transcript file not found',
            },
            { status: 404 }
        )
    }

    // Attempt to retrieve the file from the bucket
    try {
        const { contentType, data } = await S3Service.getTranscript(student)
        const outResponse = new NextResponse(data)
        outResponse.headers.set('Content-Type', contentType!)
        return outResponse
    } catch (err) {
        // If unsuccessful, return 400 BAD REQUEST
        return NextResponse.json(
            {
                success: false,
                status: 400,
                statusText: err,
            },
            { status: 400 }
        )
    }
}
