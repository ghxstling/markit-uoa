import { parseArgs } from 'node:util'
import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
import csCourses from './csClassList.json'

const prisma = new PrismaClient()

const options = {
    datasetType: {
        type: 'string' as const,
    },
}

let list: string[] = []

async function generateData(seedOption?: number) {
    if (seedOption !== null) {
        faker.seed(seedOption)
    }

    // Seed Courses
    console.log('Seeding Courses ...')
    for (const [key, value] of Object.entries(csCourses)) {
        await prisma.course.create({
            data: {
                courseCode: key,
                courseDescription: value,
                numOfEstimatedStudents: faker.number.int({ min: 400, max: 2000 }),
                numOfEnrolledStudents: faker.number.int({ min: 1, max: 2000 }),
                markerHours: faker.number.int({ min: 5, max: 200 }),
                markerResponsibilities: faker.lorem.paragraph({ min: 1, max: 4 }),
                markersNeeded: faker.number.int({ min: 1, max: 20 }),
                semester: '2023S2',
            },
        })
    }

    // Seed Users (Students)
    console.log('Seeding Students ...')
    for (let i = 0; i < 350; i++) {
        let firstName = faker.person.firstName()
        let lastName = faker.person.lastName()
        let fullName = firstName + ' ' + lastName
        let upi = ''
        let upi1stPart = firstName.slice(0, 1).toLowerCase()
        for (let i = 0; 4 > upi1stPart.length; i++) {
            if (lastName.charAt(i).match(/[a-zA-Z]/g)) {
                upi1stPart += lastName.charAt(i).toLowerCase()
            }
        }
        let upi2ndPart = faker.string.numeric(3)
        upi = upi1stPart + upi2ndPart
        let email = upi + '@aucklanduni.ac.nz'

        while (
            (await prisma.user.findFirst({
                where: {
                    email: {
                        equals: email,
                    },
                },
            })) !== null
        ) {
            upi2ndPart = faker.string.numeric(3)
            upi = upi1stPart + upi2ndPart
            email = upi + '@aucklanduni.ac.nz'
        }

        let residencyStatus = faker.datatype.boolean(0.8)
        let validWorkVisa
        if (residencyStatus === false) {
            validWorkVisa = faker.datatype.boolean(0.8)
        } else {
            validWorkVisa = null
        }

        let auid = parseInt(faker.string.numeric({ length: 9, allowLeadingZeros: false }))
        while (
            (await prisma.student.findFirst({
                where: {
                    auid: {
                        equals: auid,
                    },
                },
            })) !== null
        ) {
            auid = parseInt(faker.string.numeric({ length: 9, allowLeadingZeros: false }))
        }

        await prisma.user.create({
            data: {
                email: email,
                name: fullName,
                role: 'student',
                student: {
                    create: {
                        preferredEmail: email,
                        upi: upi,
                        auid: auid,
                        overseas: faker.datatype.boolean(0.2),
                        residencyStatus: residencyStatus,
                        validWorkVisa: validWorkVisa,
                        degreeType: faker.helpers.arrayElement([
                            'bachelor',
                            'bachelor honours',
                            'graduate certificate',
                            'graduate diploma',
                            'masters',
                            'phd',
                        ]),
                        degreeYear: faker.number.int({ min: 1, max: 10 }),
                        maxWorkHours: faker.number.int({ min: 5, max: 25 }),
                    },
                },
            },
        })
    }

    // Seed Users (Supervisors)
    console.log('Seeding Supervisors ...')
    for (let i = 0; i < 100; i++) {
        let firstName = faker.person.firstName()
        let lastName = faker.person.lastName()
        let fullName = firstName + ' ' + lastName
        let email = firstName.toLowerCase() + '.' + lastName.toLowerCase() + '@auckland.ac.nz'

        if (
            (await prisma.user.findFirst({
                where: {
                    email: {
                        equals: email,
                    },
                },
            })) !== null
        ) {
            email =
                firstName.toLowerCase() +
                '.' +
                lastName.toLowerCase() +
                '.' +
                faker.number.int({ min: 1, max: 9 }).toString() +
                '@auckland.ac.nz'
        }

        let supervisorCourses = []
        let coursesLeft = await prisma.course.findMany({
            where: { supervisorId: null },
        })

        if (coursesLeft.length !== 0) {
            for (let i = 0; i < faker.number.int({ min: 0, max: 3 }); i++) {
                supervisorCourses.push({
                    id: coursesLeft[faker.number.int({ min: 0, max: coursesLeft.length - 1 })].id,
                })
            }
        }

        await prisma.user.create({
            data: {
                email: email,
                name: fullName,
                role: 'supervisor',
                supervisor: {
                    create: {
                        courses: {
                            connect: supervisorCourses,
                        },
                    },
                },
            },
        })
    }

    // Seed Applications
    console.log('Seeding Applications ...')

    const students = await prisma.student.findMany()
    const courses = await prisma.course.findMany()

    const gradeArray = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'Not Taken Previously']

    for (let i = 0; i < 500; i++) {
        let student = students[faker.number.int({ min: 0, max: students.length - 1 })]
        let course = courses[faker.number.int({ min: 0, max: courses.length - 1 })]
        if (
            (await prisma.application.findFirst({
                where: {
                    AND: [
                        {
                            studentId: {
                                equals: student.id,
                            },
                        },
                        {
                            courseId: {
                                equals: course.id,
                            },
                        },
                    ],
                },
            })) === null
        ) {
            let previouslyAchievedGrade = faker.helpers.arrayElement(gradeArray)
            let hasCompletedCourse, hasTutoredCourse, hasMarkedCourse, notTakenExplanation
            if (previouslyAchievedGrade === 'Not Taken Previously') {
                hasCompletedCourse = false
                hasTutoredCourse = false
                hasMarkedCourse = false
                notTakenExplanation = faker.lorem.sentences({ min: 3, max: 5 })
            } else {
                hasCompletedCourse = true
                hasTutoredCourse = faker.datatype.boolean(0.5)
                hasMarkedCourse = faker.datatype.boolean(0.5)
            }

            let equivalentQualification
            if ((hasMarkedCourse || hasTutoredCourse) !== true) {
                equivalentQualification = faker.lorem.sentences({ min: 3, max: 5 })
            }

            let preferenceId = 1
            preferenceId += await prisma.application.count({
                where: {
                    studentId: {
                        equals: student.id,
                    },
                },
            })

            let isQualified = faker.datatype.boolean(0.5)
            let applicationStatus = faker.helpers.arrayElement(['pending', 'approved', 'denied'])
            let allocatedHours = applicationStatus === 'approved' ? 10 : 0

            await prisma.application.create({
                data: {
                    applicationStatus: applicationStatus,
                    allocatedHours: allocatedHours,
                    preferenceId: preferenceId,
                    student: { connect: { id: student.id } },
                    course: { connect: { id: course.id } },
                    hasCompletedCourse: hasCompletedCourse,
                    previouslyAchievedGrade: previouslyAchievedGrade,
                    hasTutoredCourse: hasTutoredCourse,
                    hasMarkedCourse: hasMarkedCourse,
                    notTakenExplanation: notTakenExplanation,
                    equivalentQualification: equivalentQualification,
                    isQualified: isQualified,
                },
            })
        } else {
            console.log('Application already exists - Regenerating...')
            i--
        }
    }
    console.log('Seeding completed.')
}

async function main() {
    const {
        values: { datasetType },
    } = parseArgs({ options })

    try {
        switch (datasetType) {
            case 'constant':
                console.log('CONSTANT seeding in progress.')
                generateData(123)
                break
            case 'random':
                console.log('RANDOM seeding in progress.')
                generateData()
                break
            default:
                console.log('No seeding was completed.')
                break
        }
    } catch (error) {
        console.error('Error seeding database:', error)
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
