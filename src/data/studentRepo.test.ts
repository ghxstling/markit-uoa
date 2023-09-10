import prisma from '@/libs/prisma'
import StudentRepo from './studentRepo'
import UserRepo from './userRepo'
import { DegreeType } from '@/models/degreeType'

beforeEach(async () => {
    await prisma.user.deleteMany()
    await prisma.student.deleteMany()
})

describe('StudentRepo', () => {
    it('can create a student', async () => {
        const email = 'example@gmail.com'
        const userInput = { email }
        const user = await UserRepo.createUser(userInput)
        const upi = 'abc123'
        const auid = 123456789
        const degreeType = DegreeType.Bachelor
        const degreeYear = 1
        const studentInput = {
            preferredEmail: email,
            upi,
            auID: auid,
            degreeType,
            degreeYear,
        }
        const input = { body: studentInput, userId: user.id }
        const data = await StudentRepo.createStudent(input)
        expect(await StudentRepo.getStudentByUpi(upi)).toMatchObject(data)
    })
})
