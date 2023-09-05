import prisma from '@/libs/prisma'
import UserRepo from './userRepo'
import { Role } from '@/models/role'

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
    it('can check if user has student role', async () => {
        const email = 'example@email.com'
        const userInput = { email }
        await UserRepo.createUser(userInput)
        expect(await UserRepo.doesUserHaveRole(email, Role.Student)).toBe(true)
    })
    it('can check if user has coordinator role', async () => {
        const email = 'example@email.com'
        const userInput = { email, role: Role.Coordinator }
        await UserRepo.createUser(userInput)
        expect(await UserRepo.doesUserHaveRole(email, Role.Coordinator)).toBe(
            true
        )
    })
    it("can check if user doesn't have coordinator role", async () => {
        const email = 'example@email.com'
        const userInput = { email }
        await UserRepo.createUser(userInput)
        expect(await UserRepo.doesUserHaveRole(email, Role.Coordinator)).toBe(
            false
        )
    })
    it("can detect if user doesn't exist when checking for roles", async () => {
        const email = 'notindatabase@email.com'
        expect(await UserRepo.doesUserHaveRole(email, Role.Student)).toBe(false)
    })
})
