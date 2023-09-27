import { NextRequest, NextResponse } from 'next/server'
import StudentRepo from '@/data/studentRepo'
import UserRepo from '@/data/userRepo'
import { getToken } from 'next-auth/jwt'
import { Role } from '@/models/role'
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import s3Client from '@/libs/s3client'
import S3Service from '@/services/s3Service'

// GET /api/students/me/transcript
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
    const user = await UserRepo.getUserbyEmail(String(token!.email))
    const student = await StudentRepo.getStudentByUserId(user!.id)

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

    // Construct the command object for retrieving the file from the bucket
    const command = new GetObjectCommand({
        Bucket: 'student-academictranscripts',
        Key: student.upi + '-' + fileName,
        ResponseContentType: 'application/pdf',
    })

    // Attempt to retrieve the file from the bucket
    try {
        console.log('Retrieving file ' + fileName + ' from student ' + student.upi + '...')
        const response = await s3Client.send(command)

        // If successful, return the file with status 200 OK
        const contentType = response.ContentType
        const bytes = await response.Body?.transformToByteArray()
        // const res = new NextResponse(
        //     new File([bytes!], fileName, { type: "application/pdf" }),
        //     {
        //         status: 200,
        //         statusText: 'File ' + fileName + ' successfuly retrieved from Bucket student-academictranscripts for student ' + student.upi,
        //         headers: {
        //             'Content-Type': 'application/pdf',
        //         }
        //     }
        // )
        // console.log("Success! Response body:\n" + res.body)
        const outResponse = new NextResponse(bytes)
        outResponse.headers.set('Content-Type', contentType!)
        return outResponse
    } catch (err) {
        // If unsuccessful, return 400 BAD REQUEST
        console.error(err)
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

// POST /api/students/me/transcript
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

    // Fetch the file from the incoming request
    const data = req.formData()
    const file: File | null = (await data).get('file') as File

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

    try {
        const { response, updatedStudent } = await S3Service.uploadTranscript(student, file)
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
