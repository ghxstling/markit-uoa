import { NextRequest, NextResponse } from 'next/server'
import StudentRepo from '@/data/studentRepo'
import UserRepo from '@/data/userRepo'
import { studentSchema } from '@/models/ZodSchemas'
import { getToken } from 'next-auth/jwt'
import { Role } from '@/models/role'

// GET /api/students/
export async function GET(req: NextRequest) {
    // Get all students from the database
    const students = await StudentRepo.getAllStudents()

    // Return the students with status code 200 OK
    return NextResponse.json(students, {
        status: 200,
        statusText: 'Students successfully retrieved',
    })
}

// POST /api/students/
export async function POST(req: NextRequest) {
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

    // Wait for student to send their personal information
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
    
    // Get User from repo via logged-in email to create association with new Student object
    const userFromEmail = await UserRepo.getUserbyEmail(String(token?.email))

    const studentData = {
        userId: Number(userFromEmail?.id),
        upi,
        auid: AUID,
        overseas: currentlyOverseas === 'Yes',
        residencyStatus: citizenOrPermanentResident == 'Yes',
        validWorkVisa: workVisa == 'Yes',
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

    // Add student to database
    const newStudent = await StudentRepo.addStudent(studentData)

    // Return the newly created student with status code 201 CREATED
    return NextResponse.json(newStudent, {
        status: 201,
        statusText: 'Student ' + newStudent.upi + ' successfully created!',
    })
}
