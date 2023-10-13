import { NextRequest, NextResponse } from 'next/server';
import UserRepo from '@/data/userRepo';
import SupervisorRepo from '@/data/supervisorRepo';
import { Role } from '@/models/role';
import { getToken } from 'next-auth/jwt';

type Params = {
    params: {
        userId: string;
    };
};

// GET /api/users/{userId}
export async function GET(req: NextRequest, { params }: Params) {
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
    
    const userId = parseInt(params.userId);
    const user = await UserRepo.getUserById(userId);
    if (user == null) {
        return NextResponse.json(
            {
                status: 404,
                statusText: 'User not found',
            },
            { status: 404 }
        );
    }

    return NextResponse.json(user, {
        status: 200,
        statusText: 'Found user',
    });
}

// PATCH /api/users/{userId}
export async function PATCH(req: NextRequest, { params }: Params) {
    const token = await getToken({ req });
    if (token!.role !== Role.Coordinator) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: 'Only coordinators can access this endpoint',
            }),
            { status: 403, headers: { 'content-type': 'application/json' } }
        );
    }

    const userId = parseInt(params.userId);
    const user = await UserRepo.getUserById(userId);
    if (user == null) {
        return NextResponse.json(
            {
                status: 404,
                statusText: 'User not found',
            },
            { status: 404 }
        );
    }

    const { role } = await req.json();
    if (!Object.values(Role).includes(role)) {
        return NextResponse.json(
            {
                status: 400,
                statusText: 'Invalid role provided',
            },
            { status: 400 }
        );
    }

    if (role === Role.Supervisor) {
        // Ensure the user has an entry in the supervisor table
        await SupervisorRepo.createSupervisorFromEmail(user.email, {});
    }

    const updatedUser = await UserRepo.updateUserRole(userId, role);
    return NextResponse.json(updatedUser, {
        status: 200,
        statusText: 'Updated user role for ID ' + userId,
    });

}
