import { z } from "zod"

export const courseSchema = z.object({
    courseCode: z.string()
        .toUpperCase()
        .nonempty({ message: "Please provide the Course Code" }),
    courseDescription: z.string()
        .nonempty({ message: "Please provide the Course Description" }),
    numOfEstimatedStudents: z.number()
        .int().nonnegative(),
    numOfEnrolledStudents: z.number()
        .int().nonnegative(),
    markerHours: z.number()
        .int().nonnegative(),
    markerResponsibilities: z.string()
        .nonempty({ message: "Please add a Marker Resposibilities Description" }),
    needMarkers: z.boolean(),
    markersNeeded: z.number()
        .int().nonnegative(),
    semester: z.string(),
}).required()

export const applicationSchema = z.object({
    hasCompletedCourse: z.boolean(),
    previouslyAchievedGrade: z.string().optional(),
    hasTutoredCourse: z.boolean(),
    hasMarkedCourse: z.boolean(),
    equivalentQualification: z.string().optional()
}).required().superRefine(({ hasCompletedCourse, previouslyAchievedGrade }, ctx) => {
    if (hasCompletedCourse == true && (previouslyAchievedGrade == undefined || previouslyAchievedGrade == null)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Previously achieved grade is required if you have completed the course"
        })
    }
    if (hasCompletedCourse == false && (previouslyAchievedGrade != undefined || previouslyAchievedGrade != null)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Internal error: previouslyAchievedGrade should be null if hasCompletedCourse is false"
        })
    }
})
