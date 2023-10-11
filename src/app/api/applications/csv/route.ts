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

    try {
        const csv = await ApplicationService.createCsvFile()
        if (csv == null) {
            return NextResponse.json(
                {
                    status: 400,
                    statusText: 'Failed to create CSV file',
                }, { status: 400 })
        }

        const data = Buffer.from(csv, 'utf-8')
        const outResponse = new NextResponse(data, 
            {
                status: 201,
                statusText: 'CSV File created successfully',
            })
        outResponse.headers.set('Content-Length', data.length.toString())
        outResponse.headers.set('Content-Disposition', 'attachment; filename="applications.csv"')
        outResponse.headers.set('Content-Type', 'text/csv; charset=utf-8')
        return outResponse
    } catch (err) {
        console.log(err)
        return NextResponse.json(
            {
                status: 500,
                statusText: 'Internal server error',
            }, { status: 500 })
    }
}
