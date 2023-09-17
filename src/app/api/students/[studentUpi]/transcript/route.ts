import { NextRequest, NextResponse } from 'next/server'
import StudentRepo from '@/data/studentRepo'
import { getToken } from 'next-auth/jwt'
import { Role } from '@/models/role'
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"
import s3Client from '@/libs/s3client'

type Params = {
    params: {
        studentUpi: string
    }
}

// GET /api/students/{studentUpi}/transcript
export async function GET(req: NextRequest, { params }: Params) {

    // Check user token for authorised credentials
    const token = await getToken({ req })
    if (token!.role != Role.Coordinator) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: 'Only coordinators are permitted to access this endpoint.',
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
        return NextResponse.json({
            success: false,
            status: 404,
            statusText: 'Transcript file not found'
        }, { status: 404 })
    }

    // Construct the command object for retrieving the file from the bucket
    const command = new GetObjectCommand({
        Bucket: "student-academictranscripts",
        Key: upi+"-"+fileName,
        ResponseContentType: "application/pdf",
    })

    // Attempt to retrieve the file from the bucket
    try {
        console.log("Retrieving file " + fileName + " from student " + upi + "...")
        const response = await s3Client.send(command)

        // If successful, return the file with status 200 OK
        // TODO: Convert response body to bytes from file and return file
        const bytes = await response.Body?.transformToString()
        console.log("Success! Response body:\n" + bytes)

        return NextResponse.json(response, {
            status: 200,
            statusText: 'File ' + fileName + ' successfuly retrieved from Bucket student-academictranscripts for student ' + upi,
        })
    }
    // If unsuccessful, return 400 BAD REQUEST
    catch (err) {
        return NextResponse.json({
            success: false,
            status: 400,
            statusText: err
        }, { status: 400 })
    }
}
