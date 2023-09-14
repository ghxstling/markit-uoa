import { NextRequest, NextResponse } from 'next/server'
import StudentRepo from '@/data/studentRepo'
import { studentSchema } from '@/models/ZodSchemas'
import { getToken } from 'next-auth/jwt'
import { Role } from '@/models/role'

type Params = {
    params: {
        studentUpi: string
    }
}

// GET /api/students/{studentUpi}
export async function GET(req: NextRequest, { params }: Params) {
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

    // Return the student with status code 200 OK
    return NextResponse.json(student, {
        status: 200,
        statusText: 'Found student ' + student.upi,
    })
}

// PATCH /api/students/{studentUpi}
export async function PATCH(req: NextRequest, { params }: Params) {
    const token = await getToken({ req })
    if (token!.role != Role.Student) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: 'Only students can update their information',
            }),
            { status: 403, headers: { 'content-type': 'application/json' } }
        )
    }
    // Store params.studentUpi into studentUpi for readability
    const studentUpi = params.studentUpi

    // Get the student from the database by UPI
    const student = await StudentRepo.getStudentByUpi(studentUpi)

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

    // Get updated information from student
    const {
        upi,
        AUID,
        currentlyOverseas,
        citizenOrPermanentResident,
        workVisa,
        degree,
        degreeYears,
        workHours,
    } = await req.json()

    const studentData = {
        userId: student?.id,
        upi: upi,
        auid: AUID,
        overseas: currentlyOverseas === 'Yes',
        residencyStatus: citizenOrPermanentResident === 'Yes',
        validWorkVisa: workVisa === 'Yes',
        degreeType: degree,
        degreeYear: degreeYears,
        maxWorkHours: workHours,
    }

    // If some information is missing, return code 400 BAD REQUEST
    const result = studentSchema.safeParse(studentData)

    if (!result.success) {
        return NextResponse.json(result.error, {
            status: 400,
            statusText: result.error.issues[0].message,
        })
    }

    // Update the student information
    const updatedStudent = await StudentRepo.updateStudent(upi, studentData)

    // Return the updated student with status code 200 OK
    return NextResponse.json(updatedStudent, {
        status: 200,
        statusText: 'Updated student information for student ' + upi,
    })
}
