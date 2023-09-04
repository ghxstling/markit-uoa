import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const secret = process.env.NEXTAUTH_SECRET

if (secret == null) throw new Error('Missing env.NEXTAUTH_SECRET')

// Limit the middleware to paths starting with `/api/`
export const config = {
    matcher: '/api/:function*',
}

export async function middleware(req: NextRequest) {
    // middleware does not apply to auth routes
    if (req.nextUrl.pathname.startsWith('/api/auth')) return NextResponse.next()
    const token = await getToken({ req, secret })
    if (token == null) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: 'authentication failed',
            }),
            { status: 401, headers: { 'content-type': 'application/json' } }
        )
    }
}
