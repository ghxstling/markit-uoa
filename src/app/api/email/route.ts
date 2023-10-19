import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { Role } from '@/models/role'
import MarkerService from '@/services/markerService'
import emailSender from '@/libs/emailSender'
import ApplicationRepo from '@/data/applicationRepo'

// POST /api/email
export async function POST(req: NextRequest) {
    const token = await getToken({ req })
    if (token!.role != Role.Coordinator) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: 'Only coordinators can access this endpoint',
            }),
            { status: 403, headers: { 'content-type': 'application/json' } }
        )
    }

    const applications = await ApplicationRepo.getAllApplications()
    const markers = await MarkerService.getAssignedMarkers(applications)
    
    const markerHashMap = await emailSender.createMarkerHashMap(markers)
    const supervisorHashMap = await emailSender.createSupervisorHashMap(markers)
    const markerMsgs = await emailSender.createMarkerEmails(markerHashMap)
    const supervisorMsgs = await emailSender.createSupervisorEmails(supervisorHashMap, markerHashMap)

    const markerResponse = await emailSender.sendEmail(markerMsgs)
    const supervisorResponse = await emailSender.sendEmail(supervisorMsgs)
    if (markerResponse == null || supervisorResponse == null) {
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to send emails, please check console',
            }, { status: 400 })
    }

    return NextResponse.json(
        {
            success: true,
            message: 'Successfully sent emails to markers and supervisors',
            markerResponse,
            supervisorResponse,
        }, { status: 200, statusText: 'Emails sent successfully' }
    )
}
