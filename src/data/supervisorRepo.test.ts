import prisma from '@/libs/prisma'
import UserRepo from './userRepo'
import SupervisorRepo from './supervisorRepo'
import { resetDatabase } from '@/helpers/testHelper'

beforeAll(async () => {
    await resetDatabase()
})

beforeEach(async () => {
    await prisma.user.deleteMany()
    await prisma.supervisor.deleteMany()
})

afterAll(async () => {
    await resetDatabase()
})

describe('SupervisorRepo', () => {
    it('can create a supervisor', async () => {
        const email = 'example@gmail.com'
        const userInput = { email }
        const user = await UserRepo.createUser(userInput)
        const supervisorInput = {
            userId: user.id
        }
        const result = await SupervisorRepo.createSupervisor(supervisorInput)
        const supervisor = await SupervisorRepo.getSupervisorbyEmail(email)
        expect(supervisor).toMatchObject(result)
    })
    it('can create a supervisor from email', async () => {
        const email = 'example@gmail.com'
        const userInput = { email }
        const user = await UserRepo.createUser(userInput)
        const supervisorInput = {
            userId: user.id
        }
        const result = await SupervisorRepo.createSupervisorFromEmail(email, supervisorInput)
        const supervisor = await SupervisorRepo.getSupervisorbyEmail(email)
        expect(supervisor).toMatchObject(result)
    })
    it('can get a supervisor by their user\'s email', async () => {
        const email = 'example@gmail.com'
        const userInput = { email }
        const user = await UserRepo.createUser(userInput)
        const supervisorInput = {
            userId: user.id
        }
        const result = await SupervisorRepo.createSupervisorFromEmail(email, supervisorInput)
        const supervisor = await SupervisorRepo.getSupervisorbyEmail(email)
        expect(supervisor).toMatchObject(result)
        expect(supervisor?.userId).toBe(user.id)

        const email2 = 'example2@gmail.com'
        const result2 = await SupervisorRepo.getSupervisorbyEmail(email2)
        expect(result2).toBe(null)
    })
    it('can get all supervisors', async () => {
        let email = 'example1@gmail.com'
        const userInput1 = { email }
        const user1 = await UserRepo.createUser(userInput1)
        const supervisorInput1 = {
            userId: user1.id
        }
        const supervisor1 = await SupervisorRepo.createSupervisorFromEmail(email, supervisorInput1)

        email = 'example2@gmail.com'
        const userInput2 = { email }
        const user2 = await UserRepo.createUser(userInput2)
        const supervisorInput2 = {
            userId: user2.id
        }
        const supervisor2 = await SupervisorRepo.createSupervisorFromEmail(email, supervisorInput2)

        const result = await SupervisorRepo.getAllSupervisors()
        expect(result).toMatchObject([supervisor1, supervisor2])
    })
})