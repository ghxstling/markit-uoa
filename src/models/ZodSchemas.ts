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
