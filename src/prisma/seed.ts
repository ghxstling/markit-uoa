import { parseArgs } from 'node:util'
import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient()

const options = {
    "datasetType": {
        type: "string" as const,
    },
}

async function generateData(seedOption?: number) {
    if (seedOption !== null) {
        faker.seed(seedOption)
    }

    // Seed Courses
    for (let i = 0; i < 10; i++) {
        await prisma.course.create({
          data: {
            courseCode: faker.helpers.fromRegExp('COMPSCI[1-9]{3}'),
            courseDescription: faker.hacker.ingverb() + " " + faker.hacker.adjective() + " " + faker.hacker.noun(),
            numOfEstimatedStudents: faker.number.int({ min: 1, max: 2000 }),
            numOfEnrolledStudents: faker.number.int({ min: 1, max: 2000 }),
            markerHours: faker.number.int({ min: 5, max: 200 }),
            markerResponsibilities: faker.lorem.paragraph({ min: 1, max: 4 }),
            // TODO: check allocated markers numbers to course for the field below
            needMarkers: faker.datatype.boolean(0.5),
            markersNeeded: faker.number.int({ min: 1, max: 20 }),
            semester: (faker.number.int({ min: 2023, max: 2035 }).toString()) + faker.helpers.arrayElement(["SS", "S1", "S2"]),
          },
        });
      }
  
    //   // Seed Users (Students)
    //   for (let i = 0; i < 20; i++) {
    //     await prisma.user.create({
    //       data: {
    //         email: faker.internet.email(),
    //         name: faker.name.findName(),
    //         role: "student",
    //         student: {
    //           create: {
    //             preferredEmail: faker.internet.email(),
    //             upi: faker.random.alphaNumeric(7).toUpperCase(),
    //             auid: faker.datatype.number({ min: 100000000, max: 999999999 }),
    //             overseas: faker.datatype.boolean(),
    //             overseasStatus: faker.random.arrayElement([
    //               "Exchange Student",
    //               "International Student",
    //               null,
    //             ]),
    //             residencyStatus: faker.datatype.boolean(),
    //             validWorkVisa: faker.datatype.boolean(),
    //             degreeType: faker.random.arrayElement([
    //               "Bachelor's",
    //               "Master's",
    //               "Ph.D.",
    //             ]),
    //             degreeYear: faker.datatype.number({ min: 2010, max: 2023 }),
    //             maxWorkHours: faker.datatype.number({ min: 5, max: 20 }),
    //             otherContracts: faker.datatype.boolean(),
    //             otherContractsDetails: faker.lorem.sentence(),
    //             CV: faker.system.fileName(),
    //             academicTranscript: faker.system.fileName(),
    //           },
    //         },
    //       },
    //     });
    //   }
  
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
