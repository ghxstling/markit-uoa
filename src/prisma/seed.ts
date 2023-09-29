import { parseArgs } from 'node:util'
import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker';
import csCourses from './csClassList.json'

const prisma = new PrismaClient()

const options = {
    "datasetType": {
        type: "string" as const,
    },
}

let list: string[] = [];


async function generateData(seedOption?: number) {
    if (seedOption !== null) {
        faker.seed(seedOption)
    }

    // Seed Courses
    for (const [key, value] of Object.entries(csCourses)) {
        await prisma.course.create({
          data: {
            courseCode: key,
            courseDescription: value,
            numOfEstimatedStudents: faker.number.int({ min: 400, max: 2000 }),
            numOfEnrolledStudents: faker.number.int({ min: 1, max: 2000 }),
            markerHours: faker.number.int({ min: 5, max: 200 }),
            markerResponsibilities: faker.lorem.paragraph({ min: 1, max: 4 }),
            // TODO: check allocated markers numbers to course for the field below
            needMarkers: faker.datatype.boolean(0.5),
            markersNeeded: faker.number.int({ min: 1, max: 20 }),
            semester: (faker.number.int({ min: 2023, max: 2024 }).toString()) + faker.helpers.arrayElement(["SS", "S1", "S2"]),
          },
        });
      }
  
      // Seed Users (Students)
      for (let i = 0; i < 200; i++) {
        let firstName = faker.person.firstName()
        let lastName = faker.person.lastName()
        let fullName = firstName + " " + lastName
        let upi = firstName.slice(0,1).toLowerCase()
        for (let i = 0; 4 > upi.length; i++) {
            if (lastName.charAt(i).match(/[a-zA-Z]/g)) {
                upi += lastName.charAt(i).toLowerCase()
              }
          }
        upi += faker.string.numeric(3)
        let email = upi + "@aucklanduni.ac.nz"

        let residencyStatus = faker.datatype.boolean(0.8)
        let validWorkVisa
        if (residencyStatus === false) {
            validWorkVisa = faker.datatype.boolean(0.8)
        } else {
            validWorkVisa = null
        }

        await prisma.user.create({
          data: {
            email: email,
            name: fullName,
            role: "student",
            student: {
              create: {
                preferredEmail: email,
                upi: upi,
                auid: parseInt(faker.string.numeric({length: 9, allowLeadingZeros: false })),
                overseas: faker.datatype.boolean(0.8),
                // overseasStatus not genereated
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
                // otherContracts not generated
                // otherContractsDetails not generated
                CV: "CV.pdf",
                academicTranscript: "Academic Transcript.pdf",
              },
            },
          },
        });
      }
  
    //   // Seed Applications
    //   const students = await prisma.student.findMany();
    //   const courses = await prisma.course.findMany();
  
    //   for (let i = 0; i < students.length; i++) {
    //     const student = students[i];
    //     const course = faker.random.arrayElement(courses);
  
    //     await prisma.application.create({
    //       data: {
    //         applicationStatus: faker.random.arrayElement([
    //           "pending",
    //           "approved",
    //           "rejected",
    //         ]),
    //         studentId: student.id,
    //         courseId: course.id,
    //         hasCompletedCourse: faker.datatype.boolean(),
    //         previouslyAchievedGrade: faker.random.word(),
    //         hasTutoredCourse: faker.datatype.boolean(),
    //         hasMarkedCourse: faker.datatype.boolean(),
    //         notTakenExplanation: faker.lorem.sentence(),
    //         equivalentQualification: faker.lorem.sentence(),
    //       },
    //     });
    //   }
}

async function main() {
    const {
        values: { datasetType },
      } = parseArgs({ options });
    
    try {
        switch (datasetType) {
            case "constant":
                generateData(123)
                console.log("CONSTANT seeding in progress.")
                break
            case "random":
                generateData()
                console.log("RANDOM seeding in progress.")
                break
            default:
                break
        }
      }
    catch (error) {
        console.error("Error seeding database:", error);
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
