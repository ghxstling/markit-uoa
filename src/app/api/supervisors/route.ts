import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { Role } from '@/models/role';
import SupervisorRepo from '@/data/supervisorRepo';

// GET /api/supervisors/
export async function GET(req: NextRequest) {
    const token = await getToken({ req })
    if(token!.role != Role.Coordinator) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: 'Only coordinators can access this endpoint'
            }),
            { status: 403, headers: { 'content-type': 'application/json' } }
        )
    }
    
    const supervisors = await SupervisorRepo.getAllSupervisors()
    return NextResponse.json(supervisors, {
        status: 200,
        statusText: 'Supervisors retrieved successfully',
    })
}
