import { NextRequest, NextResponse } from 'next/server'
import StudentRepo from '@/data/studentRepo'
import { getToken } from 'next-auth/jwt'
import { Role } from '@/models/role'
import S3Service from '@/services/s3Service'

// GET /api/students/me/cv
export async function GET(req: NextRequest) {
    // Check user token for authorised credentials
    const token = await getToken({ req })
    if (token!.role != Role.Student) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: 'Only students are permitted to access this endpoint.',
            }),
            { status: 403, headers: { 'content-type': 'application/json' } }
        )
    }

    // Get respective Student object from database using client's logged in email
    const student = await StudentRepo.getStudentByEmail(String(token!.email))

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

    // Get file name of CV from student
    const fileName = student.CV

    // If no file name exists under student, return 404 NOT FOUND
    if (!fileName) {
        return NextResponse.json(
            {
                success: false,
                status: 404,
                statusText: 'CV file not found',
            },
            { status: 404 }
        )
    }

    // Attempt to retrieve the file from the bucket
    try {
        const { contentType, data } = await S3Service.getCV(student)
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

// POST /api/students/me/cv
export async function POST(req: NextRequest) {
    // Check user token for authorised credentials
    const token = await getToken({ req })
    if (token!.role != Role.Student) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: 'Only students are permitted to access this endpoint.',
            }),
            { status: 403, headers: { 'content-type': 'application/json' } }
        )
    }

    // Get respective Student object from database using client's logged in email
    const student = await StudentRepo.getStudentByEmail(String(token!.email))

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

    // extract file from the incoming request
    const data = req.formData()
    const file: File | null = (await data).get('file') as unknown as File

    // If file cannot be found, return 400 BAD REQUEST
    if (!file) {
        return NextResponse.json(
            {
                success: false,
                status: 400,
                statusText: 'Error while fetching the file',
            },
            { status: 400 }
        )
    }

    // Attempt to send the file to the bucket
    try {
        const { response, updatedStudent } = await S3Service.uploadCV(student, file)
        return NextResponse.json(
            { updatedStudent, response },
            {
                status: 200,
                statusText: 'File ' + file.name + ' successfuly sent to Bucket student-cvs for student ' + student.upi,
            }
        )
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
