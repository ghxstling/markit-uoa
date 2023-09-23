import { z } from 'zod'
import { DegreeType } from './degreeType'

export const applicationSchema = z
    .object({
        hasCompletedCourse: z.boolean(),
        previouslyAchievedGrade: z.string().optional(),
        hasTutoredCourse: z.boolean(),
        hasMarkedCourse: z.boolean(),
        equivalentQualification: z.string().optional(),
    })
    .required()
    .superRefine(({ hasCompletedCourse, previouslyAchievedGrade }, ctx) => {
        if (hasCompletedCourse == true && (previouslyAchievedGrade == undefined || previouslyAchievedGrade == null)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Previously achieved grade is required if you have completed the course',
            })
        }
        if (hasCompletedCourse == false && (previouslyAchievedGrade != undefined || previouslyAchievedGrade != null)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Internal error: previouslyAchievedGrade should be null if hasCompletedCourse is false',
            })
        }
    })

export const courseSchema = z
    .object({
        courseCode: z.string().toUpperCase().nonempty({ message: 'Please provide the Course Code' }),
        courseDescription: z.string().nonempty({ message: 'Please provide the Course Description' }),
        numOfEstimatedStudents: z.number().int().nonnegative(),
        numOfEnrolledStudents: z.number().int().nonnegative(),
        markerHours: z.number().int().nonnegative(),
        markerResponsibilities: z.string().nonempty({ message: 'Please add a Marker Resposibilities Description' }),
        needMarkers: z.boolean(),
        markersNeeded: z.number().int().nonnegative(),
        semester: z.string(),
    })
    .required()

export const studentSchema = z
    .object({
        upi: z.string().toLowerCase().nonempty(),
        auid: z
            .number()
            .int()
            .gte(100000000, { message: 'Please enter a valid AUID' })
            .lte(999999999, { message: 'Please enter a valid AUID' })
            .nonnegative({ message: 'Please enter a valid AUID' }),
        overseas: z.boolean(),
        residencyStatus: z.boolean(),
        validWorkVisa: z.boolean(),
        degreeType: z.nativeEnum(DegreeType),
        degreeYear: z.number().int().positive({ message: 'Years into study should be greater than 0' }),
        maxWorkHours: z
            .number()
            .int()
            .gte(5, { message: 'Minimum work hours should be at least 5 hours' })
            .positive({ message: 'Minimum work hours should be at least 5 hours' }),
    })
    .required()
