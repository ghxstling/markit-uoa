import UserRepo from '@/data/userRepo'
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const clientId = process.env.GOOGLE_CLIENT_ID
const clientSecret = process.env.GOOGLE_CLIENT_SECRET

if (!clientId) throw new Error('Missing env.GOOGLE_CLIENT_ID')
if (!clientSecret) throw new Error('Missing env.GOOGLE_CLIENT_SECRET')

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId,
            clientSecret,
        }),
    ],
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
    },
})

export { handler as GET, handler as POST }
