type CourseApplicationType = {
    id: number
    prefId: number
    data: {
        course: string
        grade: string
        explainNotTaken: string
        markedPreviously: string
        tutoredPreviously: string
        explainNotPrevious: string
    }
}

export interface IFormValues {
    name: string
    upi: string
    email: string
    AUID: string
    currentlyOverseas: string
    citizenOrPermanentResident: string
    workVisa: string
    degree: string
    degreeYears: number
    workHours: number
    applications: CourseApplicationType[]
}
