import UserRepo from '@/data/userRepo'
import NextAuth, { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const clientId = process.env.GOOGLE_CLIENT_ID
const clientSecret = process.env.GOOGLE_CLIENT_SECRET

if (!clientId) throw new Error('Missing env.GOOGLE_CLIENT_ID')
if (!clientSecret) throw new Error('Missing env.GOOGLE_CLIENT_SECRET')

const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId,
            clientSecret,
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        async signIn({ user }) {
            const userFromEmail = await UserRepo.getUserbyEmail(user.email!)
            if (userFromEmail == null) {
                await UserRepo.createUser({
                    email: user.email!,
                    name: user.name!,
                })
            }
            return true
        },
        async jwt({ token, profile }) {
            // profile not null on first sign in
            if (profile) {
                const userFromEmail = await UserRepo.getUserbyEmail(profile.email!)
                token.role = userFromEmail!.role
            }
            return token
        },
        async session({ session, token }) {
            session.role = token.role
            return session
        },
    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
