import { NextRequest, NextResponse } from 'next/server'
import StudentRepo from '@/data/studentRepo'
import { studentSchema } from '@/models/ZodSchemas'
import { getToken } from 'next-auth/jwt'
import { Role } from '@/models/role'
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"
import s3Client from '@/libs/s3client'

type Params = {
    params: {
        studentId: string
    }
}

// GET /api/students/{studentId}/transcript
export async function GET(req: NextRequest, { params }: Params) {

    // Check user token for authorised credentials
    const token = await getToken({ req })
    if (token!.role != Role.Student && token!.role != Role.Coordinator) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: 'Only students and coordinators are permitted to view students\' transcripts',
            }),
            { status: 403, headers: { 'content-type': 'application/json' } }
        )
    }

    // Store params.studentId into studentId for readability
    const studentId = parseInt(params.studentId)

    // Get the student from the database by ID
    const student = await StudentRepo.getStudentById(studentId)

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

    // Constrcut the command object for retrieving the file from the bucket
    const command = new GetObjectCommand({
        Bucket: "student-academictranscripts",
        Key: fileName,
    })

    // Attempt to retrieve the file from the bucket
    try {
        console.log("Retrieving file " + fileName + " ...")
        const response = await s3Client.send(command)

        // If successful, return the file with status 200 OK
        const str = await response.Body?.transformToString()
        console.log("Success! Response body:\n" + str)

        return NextResponse.json(response, {
            status: 200,
            statusText: 'File ' + fileName + ' successfuly sent to Bucket student-academictranscript',
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

// POST /api/students/{studentId}/transcript
export async function POST(req: NextRequest, { params }: Params) {
    
    // Check user token for authorised credentials
    const token = await getToken({ req })
    if (token!.role != Role.Student) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: 'Only students are permitted to upload transcripts',
            }),
            { status: 403, headers: { 'content-type': 'application/json' } }
        )
    }

    // Store params.studentId into studentId for readability
    const studentId = parseInt(params.studentId)

    // Get the student from the database by ID
    const student = await StudentRepo.getStudentById(studentId)

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
    const file: File | null = (await data).get('file') as unknown as File

    // If file cannot be found, return 400 BAD REQUEST
    if (!file) {
        return NextResponse.json({
            success: false,
            status: 400,
            statusText: "Error while fetching the file"
        }, { status: 400 })
    }

    // Constuct the command object for sending the file to the bucket
    const fileName = file.name
    const command = new PutObjectCommand({
        Bucket: "student-academictranscript",
        Key: fileName,
        Body: JSON.stringify({
            studentId: studentId,
            studentName: student.name,
            fileName: fileName
        })
    })

    // Attempt to send the file to the bucket
    try {
        console.log("Sending file " + file.name + " ...")
        const response = await s3Client.send(command)

        // If successful, store the file name under the student object in database
        console.log("Success! Response:\n" + response)
        const updatedStudent = await StudentRepo.setTranscriptFilename(studentId, fileName)

        // Return the updated student with status 200 OK
        return NextResponse.json({ updatedStudent, response }, {
            status: 200,
            statusText: 'File ' + fileName + ' successfuly sent to Bucket student-academictranscript',
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
