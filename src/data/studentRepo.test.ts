import prisma from '@/libs/prisma'
import StudentRepo from './studentRepo'
import UserRepo from './userRepo'
import { DegreeType } from '@/models/degreeType'
import { resetDatabase } from '@/helpers/testHelper'

beforeAll(async () => {
    await resetDatabase()
})

beforeEach(async () => {
    await prisma.user.deleteMany()
    await prisma.student.deleteMany()
})

afterAll(async () => {
    await resetDatabase()
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
        
        const student2 = await StudentRepo.getStudentByEmail('invalid@email.com')
        expect(student2).toBe(null)
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
    it("can get all students", async () => {
        const email1 = 'example1@gmail.com'
        const email2 = 'example2@gmail.com'
        const userInput1 = { email: email1 }
        const userInput2 = { email: email2 }
        const user1 = await UserRepo.createUser(userInput1)
        const user2 = await UserRepo.createUser(userInput2)

        const studentInput1 = {
            userId: user1.id,
            preferredEmail: email1,
            upi: 'abc123',
            auid: 123456789,
            degreeType: DegreeType.Bachelor,
            degreeYear: 1,
        }
        const studentInput2 = {
            userId: user2.id,
            preferredEmail: email2,
            upi: 'def123',
            auid: 987654321,
            degreeType: DegreeType.Honours,
            degreeYear: 4,
        }

        const student1 = await StudentRepo.createStudent(studentInput1)
        const student2 = await StudentRepo.createStudent(studentInput2)

        const result = await StudentRepo.getAllStudents()
        expect(result).toMatchObject([student1, student2])
    })
    it('can update a student\'s details', async () => {
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
        const student = await StudentRepo.createStudent(studentInput)
        expect(await StudentRepo.getStudentByEmail(email)).toMatchObject(student)

        const updatedStudentInput = {
            preferredEmail: 'updated@email.com',
            overseas: true,
            CV: 'cv.pdf',
            academicTranscript: 'transcript.pdf',
        }
        const result = await StudentRepo.updateStudentDetails(upi, updatedStudentInput)
        expect(await StudentRepo.getStudentByEmail(email)).toMatchObject(result)
        expect(result.preferredEmail).toBe(updatedStudentInput.preferredEmail)
        expect(result.overseas).toBe(updatedStudentInput.overseas)
        expect(result.CV).toBe(updatedStudentInput.CV)
        expect(result.academicTranscript).toBe(updatedStudentInput.academicTranscript)
    })
    it("can get a student by their user ID", async () => {
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
        const student = await StudentRepo.getStudentByUserId(user.id)
        expect(student).toMatchObject(data)
        expect(student?.userId).toBe(user.id)
    })
    it("can get a student by their ID", async () => {
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
        const student = await StudentRepo.getStudentById(data.id)
        expect(student).toMatchObject(data)
        expect(student?.id).toBe(data.id)
    })
    it("can set a student's CV filename", async () => {
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
        const student = await StudentRepo.createStudentFromEmail(email, studentInput)
        expect(student.CV).toBe(null)

        const result = await StudentRepo.setCVFilename(upi, 'cv.pdf')
        expect(result.CV).toBe('cv.pdf')
    })
    it("can set a student's Transcript filename", async () => {
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
        const student = await StudentRepo.createStudentFromEmail(email, studentInput)
        expect(student.academicTranscript).toBe(null)

        const result = await StudentRepo.setTranscriptFilename(upi, 'transcript.pdf')
        expect(result.academicTranscript).toBe('transcript.pdf')
    })
})
