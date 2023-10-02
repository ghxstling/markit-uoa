import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { Role } from '@/models/role'
import ApplicationRepo from '@/data/applicationRepo'
import StudentRepo from '@/data/studentRepo'

type Params = {
    params: {
        courseId: string,
        markerId: string,
    }
}

// PATCH /api/courses/[courseId]/markers/[markerId]
export async function PATCH(req: NextRequest, { params }: Params) {}

// DELETE /api/courses/[courseId]/markers/[markerId]
export async function DELETE(req: NextRequest, { params }: Params) {}

