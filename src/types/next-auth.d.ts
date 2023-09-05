import { Session } from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
    interface Session {
        role: string
        user?: DefaultUser & { role: string }
    }

    interface User {
        role: string
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        role: string
    }
}
