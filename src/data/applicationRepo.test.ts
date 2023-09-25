import type { Prisma } from '@prisma/client'
import ApplicationRepo from './applicationRepo'
import UserRepo from './userRepo'
import { DegreeType } from '@/models/degreeType'
import StudentRepo from './studentRepo'
import { courseInputHelper, resetDatabase } from '@/helpers/testHelper'
import CourseRepo from './courseRepo'

let student: { id: number } | null = null
let course: { id: number } | null = null

beforeAll(async () => {
    await resetDatabase()
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
    student = await StudentRepo.createStudent(studentInput)
    course = await CourseRepo.addCourse(courseInputHelper('COMPSCI 101', 'Introduction to Software Development'))
})

afterAll(async () => {
    await resetDatabase()
})

const createApplicationInput = (studentId: number, courseId: number): Prisma.ApplicationUncheckedCreateInput => {
    return {
        applicationStatus: 'pending',
        studentId,
        courseId,
        hasCompletedCourse: true,
        previouslyAchievedGrade: 'B+',
        hasTutoredCourse: true,
        hasMarkedCourse: true,
    }
}

describe('ApplicationRepo', () => {
    it('can create an application', async () => {
        const input = createApplicationInput(student!.id, course!.id)
        const data = await ApplicationRepo.createApplication(input)
        expect(await ApplicationRepo.getApplicationById(data.id)).toMatchObject(data)
    })
    it('can get all applications', async () => {})
})
