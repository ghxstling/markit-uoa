import { courseInputHelper, resetDatabase } from '@/helpers/testHelper'
import CourseRepo from './courseRepo'
import UserRepo from './userRepo'
import SupervisorRepo from './supervisorRepo'
import prisma from '@/libs/prisma'

beforeAll(async () => {
    await resetDatabase()
})

beforeEach(async () => {
    await prisma.course.deleteMany()
    await prisma.supervisor.deleteMany()
    await prisma.user.deleteMany()
})

afterAll(async () => {
    await resetDatabase()
})

describe('CourseRepo', () => {
    it('can create a course', async () => {
        const courseName = 'Compsci101'
        const courseDescription = 'Intro to computer science'
        const courseInput = courseInputHelper(courseName, courseDescription)
        const course = await CourseRepo.addCourse(courseInput)
        expect(course).toMatchObject(courseInput)
    })
    it('can get course by id', async () => {
        const courseName = 'Compsci101'
        const courseDescription = 'Intro to computer science'
        const courseName2 = 'Compsci120'
        const courseDescription2 = 'Learn some maths'

        const courseInput = courseInputHelper(courseName, courseDescription)
        const courseInput2 = courseInputHelper(courseName2, courseDescription2)

        await CourseRepo.addCourse(courseInput)
        const course2 = await CourseRepo.addCourse(courseInput2)
        const result = await CourseRepo.getCourseById(course2.id)
        expect(result).toMatchObject(course2)
    })
    it('can get all courses', async () => {
        const courseName = 'Compsci101'
        const courseDescription = 'Intro to computer science'
        const courseName2 = 'Compsci120'
        const courseDescription2 = 'Learn some maths'

        const courseInput = courseInputHelper(courseName, courseDescription)
        const courseInput2 = courseInputHelper(courseName2, courseDescription2)

        await CourseRepo.addCourse(courseInput)
        await CourseRepo.addCourse(courseInput2)
        const result = await CourseRepo.getAllCourses()
        expect(result).toMatchObject([courseInput, courseInput2])
    })
    it('can get supervisor courses', async () => {
        const courseName = 'Compsci101'
        const courseDescription = 'Intro to computer science'
        const courseName2 = 'Compsci120'
        const courseDescription2 = 'Learn some maths'
        const courseName3 = 'Compsci130'
        const courseDescription3 = 'More Python'

        const courseInput = courseInputHelper(courseName, courseDescription)
        const courseInput2 = courseInputHelper(courseName2, courseDescription2)
        const courseInput3 = courseInputHelper(courseName3, courseDescription3)

        let course1 = await CourseRepo.addCourse(courseInput)
        let course2 = await CourseRepo.addCourse(courseInput2)
        let course3 = await CourseRepo.addCourse(courseInput3)

        const email = 'example@gmail.com'
        const userInput = { email }
        const user = await UserRepo.createUser(userInput)
        const supervisorInput = {
            userId: user.id,
        }
        const supervisor = await SupervisorRepo.createSupervisorFromEmail(email, supervisorInput)

        const courseUpdateInput = {
            supervisor: {
                connect: {
                    id: supervisor.id,
                }
            }
        }
        course1 = await CourseRepo.updateCourse(course1.id, courseUpdateInput)
        course2 = await CourseRepo.updateCourse(course2.id, courseUpdateInput)

        const result = await CourseRepo.getSupervisorCourses(email)
        expect(result).toMatchObject([course1, course2])
        expect(course1.supervisorId).toBe(supervisor.id)
        expect(course2.supervisorId).toBe(supervisor.id)
        expect(course3.supervisorId).toBe(null)

        const result2 = await CourseRepo.getSupervisorCourses('idontexist@email.com')
        expect(result2).toBe(null)

        const email2 = 'example2@gmail.com'
        const userInput2 = { email: email2 }
        const user2 = await UserRepo.createUser(userInput2)
        const result3 = await CourseRepo.getSupervisorCourses(email2)
        expect(result3).toBe(null)
    })
    it('can update a course', async () => {
        const courseName = 'Compsci101'
        const courseDescription = 'Intro to computer science'
        const courseInput = courseInputHelper(courseName, courseDescription)
        const course = await CourseRepo.addCourse(courseInput)
        const updatedCourse = await CourseRepo.updateCourse(course.id, {
            courseCode: 'Compsci102',
            courseDescription: 'Intro to computer science 2',
        })
        expect(updatedCourse).toMatchObject({
            ...courseInput,
            courseCode: 'Compsci102',
            courseDescription: 'Intro to computer science 2',
        })
    })
    it('can update multiple courses', async () => {
        const courseName1 = 'Compsci101'
        const courseDescription1 = 'Intro to computer science'
        const courseName2 = 'Compsci120'
        const courseDescription2 = 'Learn some maths'

        const courseInput1 = courseInputHelper(courseName1, courseDescription1)
        const courseInput2 = courseInputHelper(courseName2, courseDescription2)

        const course1 = await CourseRepo.addCourse(courseInput1)
        const course2 = await CourseRepo.addCourse(courseInput2)

        const updatedCourse1 = await CourseRepo.updateCourse(course1.id, {
            courseCode: 'Compsci102',
            courseDescription: 'Intro to computer science 2',
        })
        const updatedCourse2 = await CourseRepo.updateCourse(course2.id, {
            semester: '2030SS',
            needMarkers: true,
        })
        expect(updatedCourse1).toMatchObject({
            ...courseInput1,
            courseCode: 'Compsci102',
            courseDescription: 'Intro to computer science 2',
        })
        expect(updatedCourse2).toMatchObject({
            ...courseInput2,
            semester: '2030SS',
            needMarkers: true,
        })
    })
    it('can delete a course', async () => {
        const courseName = 'Compsci101'
        const courseDescription = 'Intro to computer science'
        const courseInput = courseInputHelper(courseName, courseDescription)
        const course = await CourseRepo.addCourse(courseInput)
        await CourseRepo.deleteCourse(course.id)
        const result = await CourseRepo.getCourseById(course.id)
        expect(result).toBeNull()
    })
})
