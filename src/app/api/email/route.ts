import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { Role } from '@/models/role'
import sgMail from '@/app/service/emailService'

// POST /api/mail
export async function POST(req: NextRequest) {

    // Check user token for authorised credentials
    const token = await getToken({ req })
    if (token!.role != Role.Coordinator) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: 'Only coordinators can send automated emails',
            }),
            { status: 403, headers: { 'content-type': 'application/json' } }
        )
    }

    // Wait for supervisor to click the 'Send Email' button
    /*
    A msg represents a single email to be sent. emails represent an array of msgs to send to different recipients
    Usage:
        msg: object = {
            to: array[string],  The recipient(s) of the email
            from: string,       Our verified sender on SendGrid (default: dcho282@aucklanduni.ac.nz)
            // subject: string,    The subject of the email
            // text: string,       The body of the email
            html: string        [OPTIONAL] Any HTML code to include in the email for formatting 
        }
        emails: array[objects] = [msg1, msg2, ...]
    */
    const data = await req.json()

}
