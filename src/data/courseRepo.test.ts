import CourseRepo from "./courseRepo";
import prisma from "@/libs/prisma";
import type { Prisma } from "@prisma/client";

const courseInputHelper = (
    courseCode: string,
    courseDescription: string
): Prisma.CourseCreateInput => {
    return {
        courseCode,
        courseDescription,
        numOfEstimatedStudents: 5,
        numOfEnrolledStudents: 6,
        markerHours: 7,
        needMarkers: true,
        markersNeeded: 9,
    };
};

beforeEach(async () => {
    await prisma.course.deleteMany();
});

describe("CourseRepo", () => {
    it("can create a course", async () => {
        const courseName = "Compsci101";
        const courseDescription = "Intro to computer science";
        const courseInput = courseInputHelper(courseName, courseDescription);
        const course = await CourseRepo.addCourse(courseInput);
        expect(course).toMatchObject(courseInput);
    });
    it("can get course by id", async () => {
        const courseName = "Compsci101";
        const courseDescription = "Intro to computer science";
        const courseName2 = "Compsci120";
        const courseDescription2 = "Learn some maths";

        const courseInput = courseInputHelper(courseName, courseDescription);
        const courseInput2 = courseInputHelper(courseName2, courseDescription2);

        await CourseRepo.addCourse(courseInput);
        const course2 = await CourseRepo.addCourse(courseInput2);
        const result = await CourseRepo.getCourseById(course2.id);
        expect(result).toMatchObject(course2);
    });
    it("can get all courses", async () => {
        const courseName = "Compsci101";
        const courseDescription = "Intro to computer science";
        const courseName2 = "Compsci120";
        const courseDescription2 = "Learn some maths";

        const courseInput = courseInputHelper(courseName, courseDescription);
        const courseInput2 = courseInputHelper(courseName2, courseDescription2);

        await CourseRepo.addCourse(courseInput);
        await CourseRepo.addCourse(courseInput2);
        const result = await CourseRepo.getAllCourses();
        expect(result).toMatchObject([courseInput, courseInput2]);
    });
    it("can update a course", async () => {
        const courseName = "Compsci101";
        const courseDescription = "Intro to computer science";
        const courseInput = courseInputHelper(courseName, courseDescription);
        const course = await CourseRepo.addCourse(courseInput);
        const updatedCourse = await CourseRepo.updateCourse(course.id, {
            courseCode: "Compsci102",
            courseDescription: "Intro to computer science 2",
        });
        expect(updatedCourse).toMatchObject({
            ...courseInput,
            courseCode: "Compsci102",
            courseDescription: "Intro to computer science 2",
        });
    });
    it("can delete a course", async () => {
        const courseName = "Compsci101";
        const courseDescription = "Intro to computer science";
        const courseInput = courseInputHelper(courseName, courseDescription);
        const course = await CourseRepo.addCourse(courseInput);
        await CourseRepo.deleteCourse(course.id);
        const result = await CourseRepo.getCourseById(course.id);
        expect(result).toBeNull();
    });
});
