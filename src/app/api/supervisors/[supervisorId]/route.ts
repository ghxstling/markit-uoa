import { NextRequest, NextResponse } from 'next/server';
import { Role } from '@/models/role';
import { getToken } from 'next-auth/jwt';
import SupervisorRepo from '@/data/supervisorRepo';

type Params = {
    params: {
        supervisorId: string
    }
}

// GET /api/supervisors/[supervisorId]
export async function GET(req: NextRequest, { params }: Params) {
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

    const supervisorId = parseInt(params.supervisorId)
    const supervisor = await SupervisorRepo.getSupervisorByUserId(supervisorId)
    if (supervisor == null) {
        return NextResponse.json(
            {
                status: 404,
                statusText: 'Supervisor not found',
            },
            { status: 404 }
        );
    }

    return NextResponse.json(supervisor, {
        status: 200,
        statusText: 'Found supervisor ID ' + supervisor.id,
    });
}
