import { z } from 'zod'
import { DegreeType } from './degreeType'

export const applicationSchema = z
    .object({
        preferenceId: z.number().int().positive(),
        studentId: z.number().int().positive(),
        courseId: z.number().int().positive(),
        hasCompletedCourse: z.boolean(),
        previouslyAchievedGrade: z.string().optional(),
        hasTutoredCourse: z.boolean(),
        hasMarkedCourse: z.boolean(),
        notTakenExplanation: z.string().optional(),
        equivalentQualification: z.string().optional(),
    })
    .required()
    .superRefine((
        {
            hasCompletedCourse,
            notTakenExplanation,
            previouslyAchievedGrade,
            equivalentQualification,
            hasMarkedCourse,
            hasTutoredCourse,
        }, ctx) => {
            if (hasMarkedCourse == false && hasTutoredCourse == false &&
                (equivalentQualification == undefined || equivalentQualification == null || equivalentQualification == '')) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Your equivalent qualification is required if you have not marked/tutored the course before'
                })
            }
            if (hasCompletedCourse == false) {
                if (notTakenExplanation == undefined || notTakenExplanation == null || notTakenExplanation == '') {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'An explanation is required if you have not completed the course'
                    })
                }
                if (previouslyAchievedGrade != undefined && previouslyAchievedGrade != null && !(previouslyAchievedGrade == 'NotTaken')) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Internal error: previouslyAchievedGrade should be set to 'NotTaken' if hasCompletedCourse is false",
                    })
                }
            } else {
                if (previouslyAchievedGrade == undefined || previouslyAchievedGrade == null || previouslyAchievedGrade == 'NotTaken') {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Previously achieved grade is required if you have completed the course',
                    })
                }
            }
        })

export const courseSchema = z
    .object({
        courseCode: z.string().toUpperCase().nonempty({ message: 'Please provide the Course Code' }),
        courseDescription: z.string().nonempty({ message: 'Please provide the Course Description' }),
        supervisorId: z.number().int().nullable(),
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
