import { NextRequest, NextResponse } from 'next/server'
import StudentRepo from '@/data/studentRepo'
import { studentSchema } from '@/models/ZodSchemas'
import { getToken } from 'next-auth/jwt'
import { Role } from '@/models/role'

// GET /api/students/
export async function GET(req: NextRequest) {
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

    const students = await StudentRepo.getAllStudents()

    return NextResponse.json(students, {
        status: 200,
        statusText: 'Students successfully retrieved',
    })
}

// POST /api/students/ (For students to submit their details)
// TODO: modify to support upsert
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

    const {
        preferredEmail,
        upi,
        auid,
        overseas,
        overseasStatus,
        residencyStatus,
        validWorkVisa,
        degreeType,
        degreeYear,
        maxWorkHours,
        otherContracts,
        otherContractsDetails,
    } = await req.json()

    const studentData = {
        preferredEmail,
        upi,
        auid,
        overseas,
        overseasStatus,
        residencyStatus,
        validWorkVisa,
        degreeType,
        degreeYear,
        maxWorkHours,
        otherContracts,
        otherContractsDetails,
    }

    const email = token!.email!

    // FIXME: Move to this to frontend
    // const studentData = {
    //     userId: Number(userFromEmail?.id),
    //     upi: upi.toLowerCase(),
    //     auid: AUID,
    //     overseas: currentlyOverseas === 'Yes',
    //     residencyStatus: citizenOrPermanentResident == 'Yes',
    //     validWorkVisa: workVisa == 'Yes',
    //     degreeType: degree,
    //     degreeYear: degreeYears,
    //     maxWorkHours: workHours,
    // }

    // If some information is missing, return code 400 BAD REQUEST
    const result = studentSchema.safeParse(studentData)

    if (!result.success) {
        return NextResponse.json(result.error, {
            status: 400,
            statusText: result.error.issues[0].message,
        })
    }

    const newStudent = await StudentRepo.createStudentFromEmail(email, studentData)

    return NextResponse.json(newStudent, {
        status: 201,
        statusText: 'Student ' + newStudent.upi + ' successfully created!',
    })
}
