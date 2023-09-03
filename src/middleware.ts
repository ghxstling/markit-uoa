import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const secret = process.env.NEXTAUTH_SECRET

// Limit the middleware to paths starting with `/api/`
export const config = {
    matcher: '/api/:function*',
}

export async function middleware(req: NextRequest) {
    // Call our authentication function to check the request
    const token = await getToken({ req, secret })
    if (token == null) {
        // Respond with JSON indicating an error message
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: 'authentication failed',
            }),
            { status: 401, headers: { 'content-type': 'application/json' } }
        )
    }
}
