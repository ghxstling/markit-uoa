import prisma from '@/libs/prisma'
import UserRepo from './userRepo'

beforeEach(async () => {
    await prisma.user.deleteMany()
})

describe('UserRepo', () => {
    it('can create a user', async () => {
        const email = 'example@email.com'
        const userInput = { email }
        const data = await UserRepo.createUser(userInput)
        expect(await UserRepo.getUserbyEmail(email)).toMatchObject(data)
    })
})
