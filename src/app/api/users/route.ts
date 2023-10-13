import { NextRequest, NextResponse } from 'next/server';
import UserRepo from '@/data/userRepo';
import { getToken } from 'next-auth/jwt';
import { Role } from '@/models/role';

// GET /api/users
export async function GET(req: NextRequest) {
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
    
    const users = await UserRepo.getAllUsers();
    return NextResponse.json(users, {
        status: 200,
        statusText: 'GET successful',
    })
}
