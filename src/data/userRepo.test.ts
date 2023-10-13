import prisma from '@/libs/prisma'
import UserRepo from './userRepo'
import { Role } from '@/models/role'
import { resetDatabase } from '@/helpers/testHelper'

afterAll(async () => {
    await resetDatabase()
})

beforeEach(async () => {
    await prisma.user.deleteMany()
})

afterAll(async () => {
    await resetDatabase()
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
    it("can get all users", async () => {
        const email1 = 'example1@email.com'
        const email2 = 'example2@email.com'
        const email3 = 'example3@email.com'

        const userInput1 = { email: email1 }
        const userInput2 = { email: email2 }
        const userInput3 = { email: email3 }

        const user1 = await UserRepo.createUser(userInput1)
        const user2 = await UserRepo.createUser(userInput2)
        const user3 = await UserRepo.createUser(userInput3)

        const result = await UserRepo.getAllUsers()
        expect(result).toMatchObject([user1, user2, user3])
    })
    it("can get user by id", async () => {
        const email1 = 'example1@email.com'
        const email2 = 'example2@email.com'

        const userInput1 = { email: email1 }
        const userInput2 = { email: email2 }

        const user1 = await UserRepo.createUser(userInput1)
        const user2 = await UserRepo.createUser(userInput2)

        const result1 = await UserRepo.getUserById(user1.id)
        const result2 = await UserRepo.getUserById(user2.id)
        expect(result1).toMatchObject(user1)
        expect(result2).toMatchObject(user2)
    })
    it("can update a user's role", async () => {
        const email = 'example@email.com'
        const userInput = { email }
        const user = await UserRepo.createUser(userInput)
        expect(user.role).toBe(Role.Student)

        const result = await UserRepo.updateUserRole(user.id, Role.Coordinator)
        expect(result.role).toBe(Role.Coordinator)
    })
})
