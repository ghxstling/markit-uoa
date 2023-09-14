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

// GET /api/students/{studentUpi}/cv
export async function GET(req: NextRequest, { params }: Params) {

    // Check user token for authorised credentials
    const token = await getToken({ req })
    if (token!.role != Role.Student && token!.role != Role.Coordinator) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: 'Only students and coordinators are permitted to view students\' CVs',
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

    // Get file name of CV from student
    const fileName = student.CV

    // If no file name exists under student, return 404 NOT FOUND
    if (!fileName) {
        return NextResponse.json({
            success: false,
            status: 404,
            statusText: 'CV file not found'
        }, { status: 404 })
    }

    // Construct the command object for retrieving the file from the bucket
    const command = new GetObjectCommand({
        Bucket: "student-cvs",
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
            statusText: 'File ' + fileName + ' successfuly sent to Bucket student-cvs',
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

// POST /api/students/{studentUpi}/cv
export async function POST(req: NextRequest, { params }: Params) {
    
    // Check user token for authorised credentials
    const token = await getToken({ req })
    if (token!.role != Role.Student) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: 'Only students are permitted to upload CVs',
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

    // Convert PDF file to readable bytes
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Constuct the command object for sending the file to the bucket
    const fileName = file.name
    const command = new PutObjectCommand({
        Bucket: "student-cvs",
        Key: upi + "-" + fileName,
        Body: buffer,
        ContentType: "application/pdf",
    })


    // Attempt to send the file to the bucket
    try {
        console.log("Sending file " + file.name + " ...")
        const response = await s3Client.send(command)

        // If successful, store the file name under the student object in database
        console.log("Success! Response:\n" + response)
        const updatedStudent = await StudentRepo.setCVFilename(upi, fileName)

        // Return the updated student with status 200 OK
        return NextResponse.json({ updatedStudent, response }, {
            status: 200,
            statusText: 'File ' + fileName + ' successfuly sent to Bucket student-cvs',
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
