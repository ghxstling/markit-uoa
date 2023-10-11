import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { Role } from '@/models/role'
import ApplicationService from '@/services/applicationService'

// GET /api/applications/csv
export async function GET(req: NextRequest) {
    const token = await getToken({ req })
    if (token!.role != Role.Coordinator) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: 'Only coordinators can access this endpoint'
            }),
            { status: 403, headers: { 'content-type': 'application/json' } }
        )
    }

    const result = await ApplicationService.createCsvFile()
    if (result == false) {
        return NextResponse.json(
            {
                status: 400,
                statusText: 'Failed to create CSV file',
            }, { status: 400 })
    }

    const {
        fileStream,
        stat,
    } = await ApplicationService.getCsvFile()
    const outResponse = new NextResponse(fileStream)

    res.headers.set('Content-Type', 'text/csv')
    res.headers.set('Content-Length', stat.size.toString())
    res.headers.set('Content-Disposition', 'attachment; filename="applications.csv"');
    console.log(fileStream)
    return NextResponse.json({res, fileStream}, 
        {
            status: 200,
            statusText: 'Applications retrieved successfully',
        }
    )
}
