import prisma from '@/libs/prisma'
import UserRepo from './userRepo'
import SupervisorRepo from './supervisorRepo'

beforeEach( async () => {
    await prisma.user.deleteMany()
    await prisma.supervisor.deleteMany()
})

describe('StudentRepo', () => {
    it('can create a supervisor', async () => {
        const email = 'example@gmail.com'
        const userInput = { email }
        const user = await UserRepo.createUser(userInput)
        const supervisorInput = {
            userId: user.id
        }
        const result = await SupervisorRepo.createSupervisor(supervisorInput)
        expect(await SupervisorRepo.getSupervisorbyEmail(email)).toMatchObject(result)
    })
    it('can create a supervisor from email', async () => {
        const email = 'example@gmail.com'
        const userInput = { email }
        const user = await UserRepo.createUser(userInput)
        const supervisorInput = {
            userId: user.id
        }
    })
})