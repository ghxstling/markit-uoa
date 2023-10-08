import { NextRequest, NextResponse } from 'next/server';
import { Role } from '@/models/role';
import { getToken } from 'next-auth/jwt';
import SupervisorRepo from '@/data/supervisorRepo';


// GET /api/supervisors/me
export async function GET(req: NextRequest) {
    const token = await getToken({ req })
    if(token!.role != Role.Supervisor) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: 'Only supervisors can access this endpoint'
            }),
            { status: 403, headers: { 'content-type': 'application/json' } }
        )
    }

    const supervisor = await SupervisorRepo.getSupervisorbyEmail(token!.email!)
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
