import type { Prisma } from '@prisma/client'
import ApplicationRepo from './applicationRepo'
import UserRepo from './userRepo'
import { DegreeType } from '@/models/degreeType'
import StudentRepo from './studentRepo'
import { courseInputHelper, studentInputHelper, resetDatabase } from '@/helpers/testHelper'
import CourseRepo from './courseRepo'

let student1: { id: number, upi: string } | null = null
let student2: { id: number, upi: string } | null = null
let course1: { id: number } | null = null
let course2: { id: number } | null = null
let course3: { id: number } | null = null
let course4: { id: number } | null = null

beforeAll(async () => {
    await resetDatabase()
    const userInput1 = { email: 'example1@gmail.com' }
    const userInput2 = { email: 'example2@gmail.com' }
    const user1 = await UserRepo.createUser(userInput1)
    const user2 = await UserRepo.createUser(userInput2)
    student1 = await StudentRepo.createStudent(studentInputHelper(user1))
    student2 = await StudentRepo.createStudent(studentInputHelper(user2))
    course1 = await CourseRepo.addCourse(courseInputHelper('COMPSCI 101', 'Introduction to Software Development'))
    course2 = await CourseRepo.addCourse(courseInputHelper('COMPSCI 110', 'Introduction to Computer Systems'))
    course3 = await CourseRepo.addCourse(courseInputHelper('COMPSCI 120', 'Mathematics for Computer Science'))
    course4 = await CourseRepo.addCourse(courseInputHelper('COMPSCI 130', 'Advanced Python Programming'))
})

afterAll(async () => {
    await resetDatabase()
})

let prefIdCounter = 0

const createApplicationInput = (studentId: number, courseId: number): Prisma.ApplicationUncheckedCreateInput => {
    return {
        applicationStatus: 'pending',
        preferenceId: ++prefIdCounter,
        studentId,
        courseId,
        hasCompletedCourse: true,
        previouslyAchievedGrade: 'B+',
        hasTutoredCourse: true,
        hasMarkedCourse: true,
        notTakenExplanation: 'I have no clue',
        equivalentQualification: 'I did it in high school'
    }
}

describe('ApplicationRepo', () => {
    it('can create an application', async () => {
        prefIdCounter = 0
        const input = createApplicationInput(student1!.id, course1!.id)
        const data = await ApplicationRepo.createApplication(input)
        expect(await ApplicationRepo.getApplicationById(data.id)).toMatchObject(data)
    })
    it('can get application by id', async () => {
        prefIdCounter = 0
        const applicationInput1 = createApplicationInput(student2!.id, course2!.id)
        const applicationInput2 = createApplicationInput(student1!.id, course3!.id)

        const application1 = await ApplicationRepo.createApplication(applicationInput1)
        const application2 = await ApplicationRepo.createApplication(applicationInput2)

        const result1 = await ApplicationRepo.getApplicationById(application1.id)
        const result2 = await ApplicationRepo.getApplicationById(application2.id)

        expect(result1).toMatchObject(applicationInput1)
        expect(result2).toMatchObject(applicationInput2)
    })
    it('can get all applications', async () => {
        prefIdCounter = 0
        const applicationInput1 = createApplicationInput(student1!.id, course1!.id)
        const applicationInput2 = createApplicationInput(student2!.id, course2!.id)
        const applicationInput3 = createApplicationInput(student1!.id, course3!.id)

        const result = await ApplicationRepo.getAllApplications()

        expect(result).toMatchObject([applicationInput1, applicationInput2, applicationInput3])
    })
    it('can get student applications', async () => {
        prefIdCounter = 0
        const applicationInput1 = createApplicationInput(student1!.id, course1!.id)
        const applicationInput2 = createApplicationInput(student2!.id, course2!.id)
        const applicationInput3 = createApplicationInput(student1!.id, course3!.id)

        const result1 = await ApplicationRepo.getStudentApplications(student1!.upi)
        const result2 = await ApplicationRepo.getStudentApplications(student2!.upi)

        expect(result1).toMatchObject([applicationInput1, applicationInput3])
        expect(result2).toMatchObject([applicationInput2])
    })
    it('can get applications by course', async () => {
        prefIdCounter = 0
        const applicationInput1 = createApplicationInput(student1!.id, course1!.id)
        const applicationInput2 = createApplicationInput(student2!.id, course2!.id)
        const applicationInput3 = createApplicationInput(student1!.id, course3!.id)
        const applicationInput4 = createApplicationInput(student1!.id, course2!.id)

        await ApplicationRepo.createApplication(applicationInput4)

        const result1 = await ApplicationRepo.getApplicationsByCourse(course1!.id)
        const result2 = await ApplicationRepo.getApplicationsByCourse(course2!.id)
        const result3 = await ApplicationRepo.getApplicationsByCourse(course3!.id)

        expect(result1).toMatchObject([applicationInput1])
        expect(result2).toMatchObject([applicationInput2, applicationInput4])
        expect(result3).toMatchObject([applicationInput3])
    })
    it('can get applications by status', async () => {
        prefIdCounter = 0
        let applicationInput1 = createApplicationInput(student1!.id, course1!.id)
        let applicationInput2 = createApplicationInput(student2!.id, course2!.id)
        let applicationInput3 = createApplicationInput(student1!.id, course3!.id)
        let applicationInput4 = createApplicationInput(student1!.id, course2!.id)
        let applicationInput5 = createApplicationInput(student1!.id, course4!.id)

        applicationInput2.applicationStatus = 'approved'
        applicationInput3.applicationStatus = 'approved'
        applicationInput5.applicationStatus = 'denied'

        const result1 = await ApplicationRepo.getApplicationsByStatus('pending')
        const result2 = await ApplicationRepo.getApplicationsByStatus('approved')
        const result3 = await ApplicationRepo.getApplicationsByStatus('denied')

        expect(result1).toMatchObject([applicationInput1, applicationInput4])
        expect(result2).toMatchObject([applicationInput2, applicationInput3])
        expect(result3).toMatchObject([applicationInput5])
    })
    it('can update the status of an application', async () => {
        prefIdCounter = 0
        const input = createApplicationInput(student1!.id, course4!.id)
        const data = await ApplicationRepo.createApplication(input)
        const updatedData = await ApplicationRepo.updateApplicationStatus(data.id, 'accepted')
        expect(updatedData).toMatchObject({
            ...data,
            applicationStatus: 'accepted'
        })
    })
    it('can update the course preferences for student application', async () => {
        prefIdCounter = 0
        const applications = await ApplicationRepo.getStudentApplications(student1!.upi)
        const application1 = applications[0]
        const application2 = applications[1]
        const application3 = applications[2]
        const application4 = applications[3]

        expect(application1.preferenceId).toMatchObject(1!)
        expect(application2.preferenceId).toMatchObject(2)
        expect(application3.preferenceId).toMatchObject(3)
        expect(application4.preferenceId).toMatchObject(4)
        
        const updatedApplication1 = await ApplicationRepo.updateCoursePreference(application1.id, 4)
        const updatedApplication2 = await ApplicationRepo.updateCoursePreference(application2.id, 3)
        const updatedApplication3 = await ApplicationRepo.updateCoursePreference(application3.id, 2)
        const updatedApplication4 = await ApplicationRepo.updateCoursePreference(application4.id, 1)

        expect(updatedApplication1.preferenceId).toMatchObject(4)
        expect(updatedApplication2.preferenceId).toMatchObject(3)
        expect(updatedApplication3.preferenceId).toMatchObject(2)
        expect(updatedApplication4.preferenceId).toMatchObject(1)
    })
})
