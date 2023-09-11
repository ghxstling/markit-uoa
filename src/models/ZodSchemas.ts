import { z } from "zod"
import { DegreeType } from "./degreeType"

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

export const studentSchema = z.object({
    user: z.any(),
    userId: z.number()
        .int(),
    upi: z.string()
        .toLowerCase().nonempty(),
    auid: z.number()
        .int().gte(100000000).lte(999999999).nonnegative({ message: "Please enter a valid AUID" }),
    overseas: z.boolean(),
    residencyStatus: z.boolean(),
    validWorkVisa: z.boolean(),
    degreeType: z.string()
        .nonempty(),
        degreeYear: z.number()
        .int().positive({ message: 'Years into study should be greater than 0' }),
        maxWorkHours: z.number()
        .int().gte(5).positive({ message: 'Minimum work hours should be at least 5 hours' }),
}).refine((data) => data.degreeType in DegreeType, {
    message: 'Internal error: name of degree does not match any DegreeType enums'
})
