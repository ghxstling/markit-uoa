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
        const result = await ApplicationService.createCsvFile()
        if (result == false) {
            return NextResponse.json(
                {
                    status: 400,
                    statusText: 'Failed to create CSV file',
                }, { status: 400 })
        }

        const { data, stat } = await ApplicationService.getCsvFile()
        const outResponse = new NextResponse(data, 
            {
                status: 201,
                statusText: 'CSV File created successfully',
            })
        outResponse.headers.set('Content-Length', stat.size.toString())
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
