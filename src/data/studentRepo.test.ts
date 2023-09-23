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
            userId: user.id,
            preferredEmail: email,
            upi,
            auid: auid,
            degreeType,
            degreeYear,
        }
        const data = await StudentRepo.createStudent(studentInput)
        expect(await StudentRepo.getStudentByUpi(upi)).toMatchObject(data)
    })
})
