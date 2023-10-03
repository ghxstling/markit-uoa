import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { Role } from '@/models/role'
import ApplicationRepo from '@/data/applicationRepo'
import CourseRepo from '@/data/courseRepo'
import { ApplicationStatus } from '@/models/applicationStatus'
import MarkerService from '@/services/markerService'

type Params = {
    params: {
        courseId: string,
        markerId: string,
    }
}

// PATCH /api/courses/[courseId]/markers/[markerId]
export async function PATCH(req: NextRequest, { params }: Params) {
    const token = await getToken({ req })
    if (token!.role != Role.Coordinator) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: 'Only coordinators can add courses',
            }),
            { status: 403, headers: { 'content-type': 'application/json' } }
        )
    }

    const courseId = parseInt(params.courseId)
    const course = await CourseRepo.getCourseById(courseId)
    if (!course) {
        return NextResponse.json( 
            {
                status: 404,
                statusText: 'Course ID ' + courseId + ' does not exist',
            },
            { status: 404 }
        )
    }

    // markerId is the ID of the student's application for easier handling of data
    // Recall that a Student becomes a Marker when their Application has been approved
    const markerId = parseInt(params.markerId)
    const marker = await ApplicationRepo.getApplicationById(markerId)
    if (!marker) {
        return NextResponse.json( 
            {
                status: 404,
                statusText: 'Application ID ' + markerId + ' does not exist',
            },
            { status: 404 }
        )
    }
    if (marker.applicationStatus !== ApplicationStatus.Approved) {
        return NextResponse.json( 
            {
                status: 400,
                statusText: 'Internal Error: Status of Application ID ' + markerId + ' is not approved, therefore Student ID ' + marker.studentId + ' is not a Marker',
            },
            { status: 400 }
        )
    }
    if (await ApplicationRepo.doesApplicationExist(marker.studentId, courseId) == false) {
        return NextResponse.json( 
            {
                status: 400,
                statusText: 'Application ID ' + markerId + ' does not belong to course ID ' + courseId,
            },
            { status: 400 }
        )
    }

    const { allocatedHours } = await req.json()
    const updatedMarker = await MarkerService.allocateHours(marker, allocatedHours)
    if (updatedMarker == null) {
        return NextResponse.json(
            {
                status: 400,
                statusText: 'Error allocating the hours to marker ID ' + marker.id
            },
            { status: 400}
        )
    } else {
        return NextResponse.json(updatedMarker, 
            {
                status: 200,
                statusText: 'Successfully updated hours allocated to marker ID ' + marker.id,
            }
        )
    }
}

// DELETE /api/courses/[courseId]/markers/[markerId]
export async function DELETE(req: NextRequest, { params }: Params) {
    const token = await getToken({ req })
    if (token!.role != Role.Coordinator) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: 'Only coordinators can add courses',
            }),
            { status: 403, headers: { 'content-type': 'application/json' } }
        )
    }

    const courseId = parseInt(params.courseId)
    const course = await CourseRepo.getCourseById(courseId)
    if (!course) {
        return NextResponse.json( 
            {
                status: 404,
                statusText: 'Course ID ' + courseId + ' does not exist',
            },
            { status: 404 }
        )
    }

    // markerId is the ID of the student's application for easier handling of data
    // Recall that a Student becomes a Marker when their Application has been approved
    const markerId = parseInt(params.markerId)
    const marker = await ApplicationRepo.getApplicationById(markerId)
    if (!marker) {
        return NextResponse.json( 
            {
                status: 404,
                statusText: 'Application ID ' + markerId + ' does not exist',
            },
            { status: 404 }
        )
    }
    if (marker.applicationStatus !== ApplicationStatus.Approved) {
        return NextResponse.json( 
            {
                status: 400,
                statusText: 'Internal Error: Status of Application ID ' + markerId + ' is not approved, therefore Student ID ' + marker.studentId + ' is not a Marker',
            },
            { status: 400 }
        )
    }
    if (await ApplicationRepo.doesApplicationExist(marker.studentId, courseId) == false) {
        return NextResponse.json( 
            {
                status: 400,
                statusText: 'Application ID ' + markerId + ' does not belong to course ID ' + courseId,
            },
            { status: 400 }
        )
    }
    
    const deletedMarker = await MarkerService.removeMarker(marker)
    if (deletedMarker == null) {
        return NextResponse.json(
            {
                status: 400,
                statusText: 'Error removing marker ID ' + marker.id + ' from course ID ' + courseId
            },
            { status: 400}
        )
    } else {
        return NextResponse.json(deletedMarker, 
            {
                status: 200,
                statusText: 'Successfully removed marker ID ' + marker.id + ' from course ID ' + courseId,
            }
        )
    }
}

