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
    it('can create a student from email', async () => {
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
            auid: auid,
            degreeType,
            degreeYear,
        }
        const data = await StudentRepo.createStudentFromEmail(email, studentInput)
        const student = await StudentRepo.getStudentByUpi(upi)
        expect(student).toMatchObject(data)
        expect(student?.userId).toBe(user.id)
    })
    it("can get a student by their user's email", async () => {
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
            auid: auid,
            degreeType,
            degreeYear,
        }
        const data = await StudentRepo.createStudentFromEmail(email, studentInput)
        const student = await StudentRepo.getStudentByEmail(email)
        expect(student).toMatchObject(data)
        expect(student?.userId).toBe(user.id)
    })

    it("can update a student's details through upsert", async () => {
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
            auid: auid,
            degreeType,
            degreeYear,
        }
        const data = await StudentRepo.createStudentFromEmail(email, studentInput)
        const student = await StudentRepo.getStudentByUpi(upi)
        expect(student).toMatchObject(data)
        expect(student?.userId).toBe(user.id)
        const updatedDegreeYear = 2019
        const studentInputUpdate = {
            preferredEmail: email,
            upi,
            auid: auid,
            degreeType,
            degreeYear: updatedDegreeYear,
        }
        const updatedData = await StudentRepo.createStudentFromEmail(email, studentInputUpdate)
        const studentUpdated = await StudentRepo.getStudentByUpi(upi)
        expect(studentUpdated).toMatchObject(updatedData)
        expect(studentUpdated?.degreeYear).toBe(updatedDegreeYear)
    })
})
