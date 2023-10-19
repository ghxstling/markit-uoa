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

    let markerRes
    let supervisorRes
    for (const msg of markerMsgs) {
        const res = await emailSender.sendEmail(msg)
        if (res == null || res[0].statusCode != 202) {
            console.log(res)
            return NextResponse.json(res,
                {
                    status: 400,
                    statusText: 'Failed to send marker emails',
                }
            )
        } else {
            markerRes = res
        }
    }

    for (const msg of supervisorMsgs) {
        const res = await emailSender.sendEmail(msg)
        if (res == null || res[0].statusCode != 202) {
            console.log(res)
            return NextResponse.json(res,
                {
                    status: 400,
                    statusText: 'Failed to send supervisor emails',
                }
            )
        } else {
            supervisorRes = res
        }
    }

    return NextResponse.json(
        {
            success: true,
            message: 'Successfully sent emails to markers and supervisors',
            markerRes,
            supervisorRes,
        }, { status: 200, statusText: 'Emails sent successfully' }
    )
}
