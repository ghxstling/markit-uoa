import { NextRequest, NextResponse } from 'next/server';
import UserRepo from '@/data/userRepo';

// GET /api/users/
export async function GET(req: NextRequest) {
    // Get all users from the repo
    const users = await UserRepo.getAllUsers();

    // Return the users with status code 200 OK
    return NextResponse.json(users, {
        status: 200,
        statusText: 'GET successful',
    })
}
