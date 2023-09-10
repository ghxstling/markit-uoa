import prisma from '@/libs/prisma'
import StudentRepo from './studentRepo'
import UserRepo from './userRepo'
import { Role } from '@/models/role'

beforeEach(async () => {
    await prisma.user.deleteMany()
})

describe('StudentRepo', () => {
    it('can create a student', async () => {
        const email = 'example@gmail.com'
        const userInput = { email }
        await UserRepo.createUser(userInput)
        const upi = 'abc123'
        const auid = 123456789
        const degreeType = 'bachelor'
        const degreeYear = 1
        const studentInput = {
            preferredEmail: email,
            upi,
            auID: auid,
            degreeType,
            degreeYear,
            user: prisma.user.findUnique({ where: { email } })
        }
        const data = await StudentRepo.createStudent(studentInput)
        expect(await StudentRepo.getStudentByUpi(email)).toMatchObject(data)
    })
})
