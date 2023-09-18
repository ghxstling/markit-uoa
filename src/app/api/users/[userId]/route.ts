import { NextRequest, NextResponse } from 'next/server';
import UserRepo from '@/data/userRepo';
import { Role } from '@/models/role';
import { getToken } from 'next-auth/jwt';

type Params = {
    params: {
        userId: string;
    };
};

// GET /api/users/{userId}
export async function GET(req: NextRequest, { params }: Params) {
    // Store params.userId into userId for readability
    const userId = parseInt(params.userId);

    // Get the user from the database by ID
    const user = await UserRepo.getUserById(userId);

    // If it doesn't exist, return status code 404 NOT FOUND
    if (user == null) {
        return NextResponse.json(
            {
                status: 404,
                statusText: 'User not found',
            },
            { status: 404 }
        );
    }

    // Return the user details with status code 200 OK
    return NextResponse.json(user, {
        status: 200,
        statusText: 'Found user',
    });
}

// PATCH /api/users/{userId}
export async function PATCH(req: NextRequest, { params }: Params) {
    const token = await getToken({ req });
    if (token!.role !== Role.Coordinator) {  // Only allow coordinators to change user roles
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: 'Only coordinators can update user roles',
            }),
            { status: 403, headers: { 'content-type': 'application/json' } }
        );
    }

    // Store params.userId into userId for readability
    const userId = parseInt(params.userId);

    // Check if user exists in the database
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

    // Get updated role from the request body
    const { role } = await req.json();

    // Check if the role is valid 
    if (!Object.values(Role).includes(role)) {
        return NextResponse.json(
            {
                status: 400,
                statusText: 'Invalid role provided',
            },
            { status: 400 }
        );
    }

    // Update the user role
    const updatedUser = await UserRepo.updateUserRole(userId, role);

    // Return the updated user details with status code 200 OK
    return NextResponse.json(updatedUser, {
        status: 200,
        statusText: 'Updated user role',
    });
}

