'use client'

import CVAndTranscript from '@/app/components/ApplicationForms/CVAndTranscript'
import EmploymentDetails from '@/app/components/ApplicationForms/EmploymentDetails'
import PersonalDetails from '@/app/components/ApplicationForms/PersonalDetails'
import { IFormValues } from '@/types/IFormValues'
import { Box, Button, Container, Paper, Snackbar, Step, StepLabel, Stepper, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import validator from 'validator'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import CoursePreferences from '@/app/components/ApplicationForms/CoursePreferences'
import { useSession } from 'next-auth/react'
import type { Prisma } from '@prisma/client'
import CustomTheme from '@/app/CustomTheme'
import { ThemeProvider } from '@mui/material/styles'
import Sidebar from '@/app/components/Sidebar'
import { ICvAndTranscript } from '@/types/ICvAndTranscript'

const steps = ['Personal Details', 'Employment Details', 'CV and Academic Transcript Upload', 'Course Preferences']

// get content for each application step
function getStepContent(
    step: number,
    formValues: IFormValues,
    setFormValues: React.Dispatch<React.SetStateAction<IFormValues>>,
    cvTranscriptName: ICvAndTranscript,
    setCvTranscriptName: React.Dispatch<React.SetStateAction<ICvAndTranscript>>
) {
    switch (step) {
        case 0:
            return <PersonalDetails formValues={formValues} setFormValues={setFormValues} />
        case 1:
            return <EmploymentDetails formValues={formValues} setFormValues={setFormValues} />
        case 2:
            return <CVAndTranscript cvTranscriptName={cvTranscriptName} setCvTranscriptName={setCvTranscriptName} />
        case 3:
            return <CoursePreferences formValues={formValues} setFormValues={setFormValues} />
        default:
            throw new Error('Unknown step')
    }
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const mapFormValuesToStudentDetails = (formValues: IFormValues): Prisma.StudentUncheckedCreateWithoutUserInput => {
    return {
        preferredEmail: formValues.email,
        upi: formValues.upi,
        auid: Number(formValues.AUID),
        overseas: formValues.currentlyOverseas === 'Yes',
        residencyStatus: formValues.citizenOrPermanentResident === 'Yes',
        validWorkVisa: formValues.citizenOrPermanentResident === 'Yes' ? true : formValues.workVisa === 'Yes',
        degreeType: formValues.degree,
        degreeYear: formValues.degreeYears,
        maxWorkHours: formValues.workHours,
    }
}

const postStudentDetails = async (formValues: IFormValues) => {
    const studentDetails = mapFormValuesToStudentDetails(formValues)
    const res = await fetch('/api/students', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentDetails),
    })
    return res
}

const postCourseApplications = async (formValues: IFormValues) => {
    console.log(formValues.coursePreferences)
    const courseApplications = formValues.coursePreferences
    const res = await fetch('/api/applications', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseApplications),
    })
    return res
}

const getCourseNameById = async (courseId: number) => {
    const res = await fetch(`/api/courses/${courseId}`, {
        method: 'GET',
    })
    if (res.ok) {
        return res.statusText.split(' ')[2] + ' ' + res.statusText.split(' ')[3]
    } else {
        alert('Error occured on get course name')
    }
}

interface ApplicantsData {
    id: number
    hasMarkedCourse: boolean
    previouslyAchievedGrade: string
    studentId: number
    courseId: number
    isQualified: boolean
    applicationStatus: string
    allocatedHours: number
}

const Application = () => {
    //initialise use states
    const { data: session } = useSession()
    const [activeStep, setActiveStep] = useState(0)
    const [formValues, setFormValues] = useState<IFormValues>({
        name: '',
        upi: '',
        email: session?.user?.email ?? '',
        AUID: '',
        currentlyOverseas: 'No',
        citizenOrPermanentResident: 'Yes',
        workVisa: 'Yes',
        degree: '',
        degreeYears: 1,
        workHours: 5,
        coursePreferences: [],
    })
    const [cvTranscriptName, setCvTranscriptName] = useState<ICvAndTranscript>({
        CvName: '',
        TranscriptName: '',
    })

    const [snackbarMessage, setSnackbarMessage] = useState('Please enter 9 digits for your student ID')
    const [openSnackBar, setOpenSnackBar] = useState(false)
    const [openSnackBarSuccess, setOpenSnackBarSuccess] = useState(false)
    const [snackbarSuccessMessage, setSnackbarSuccessMessage] = useState('Student submitted successfully!')

    //fetch existing student and application details, get relevant values and update formValues

    useEffect(() => {
        fetchApplicationsAndStudentData()
    }, [])

    const fetchApplicationsAndStudentData = async () => {
        try {
            const response1 = await fetch(`/api/students/me/applications`, { method: 'GET' })
            const response2 = await fetch(`/api/students/me`, { method: 'GET' })
            if (response1.ok && response2.ok) {
                let jsonData1 = await response1.json()
                jsonData1 = jsonData1.sort((a: any, b: any) => a.preferenceId - b.preferenceId)
                const jsonData2 = await response2.json()
                let currentCoursePreferences = jsonData1.map((application: any) => {
                    return {
                        id: application.id,
                        courseName: getCourseNameById(application.courseId),
                        prefId: application.preferenceId,
                        course: application.courseId,
                        grade: application.previouslyAchievedGrade,
                        explainNotTaken: application.notTakenExplanation,
                        markedPreviously: application.hasMarkedCourse,
                        tutoredPreviously: application.hasTutoredCourse,
                        explainNotPrevious: application.equivalentQualification,
                    }
                })
                setFormValues({
                    ...formValues,
                    AUID: jsonData2.auid,
                    currentlyOverseas: jsonData2.overseas === false ? 'No' : 'Yes',
                    citizenOrPermanentResident: jsonData2.residencyStatus === false ? 'No' : 'Yes',
                    workVisa: jsonData2.validWorkVisa === false ? 'No' : 'Yes',
                    degree: jsonData2.degreeType,
                    degreeYears: jsonData2.degreeYear,
                    workHours: jsonData2.maxWorkHours,
                    coursePreferences: currentCoursePreferences,
                })
            } else if (response1.ok && !response2.ok) {
                let jsonData1 = await response1.json()
                const currentIds: number[] = []
                jsonData1.forEach((application: ApplicantsData) => currentIds.push(application.courseId))
                jsonData1 = jsonData1.sort((a: any, b: any) => a.preferenceId - b.preferenceId)
                let currentCoursePreferences = jsonData1.map((application: any) => {
                    return {
                        id: application.id,
                        courseName: getCourseNameById(application.courseId),
                        prefId: application.preferenceId,
                        course: application.courseId,
                        grade: application.previouslyAchievedGrade,
                        explainNotTaken: application.notTakenExplanation,
                        markedPreviously: application.hasMarkedCourse,
                        tutoredPreviously: application.hasTutoredCourse,
                        explainNotPrevious: application.equivalentQualification,
                    }
                })
                setFormValues({ ...formValues, coursePreferences: currentCoursePreferences })
            } else if (response2.ok && !response1.ok) {
                const jsonData2 = await response2.json()
                setFormValues({
                    ...formValues,
                    AUID: jsonData2.auid,
                    currentlyOverseas: jsonData2.overseas === false ? 'No' : 'Yes',
                    citizenOrPermanentResident: jsonData2.residencyStatus === false ? 'No' : 'Yes',
                    workVisa: jsonData2.validWorkVisa === false ? 'No' : 'Yes',
                    degree: jsonData2.degreeType,
                    degreeYears: jsonData2.degreeYear,
                    workHours: jsonData2.maxWorkHours,
                })
            } else if (!response1.ok && !response2.ok) {
                throw new Error('Something went wrong')
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }

        setOpenSnackBar(false)
    }

    const handleCloseSuccess = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }
        setOpenSnackBarSuccess(false)
    }
    const handleNext = async () => {
        //if case = 0, check id and email
        if (activeStep === 0) {
            if (validator.isEmail(formValues.email) === false) {
                setSnackbarMessage('Please enter a valid email address')
                setOpenSnackBar(true)
                return
            } else if (String(formValues.AUID).length !== 9) {
                setSnackbarMessage('Please enter 9 digits for your student ID')
                setOpenSnackBar(true)
                return
            }
        }

        // if activeStep === 1 check Degree is entered
        else if (activeStep === 1) {
            if (formValues.degree === '') {
                setSnackbarMessage('Please select a degree type')
                setOpenSnackBar(true)
                return
            }
            const res = await postStudentDetails(formValues)
            if (res.ok) {
                setSnackbarSuccessMessage('Student submitted successfully')
                setOpenSnackBarSuccess(true)
            } else {
                setSnackbarMessage('Error submitting student details, please try again')
                setOpenSnackBar(true)
                return
            }
        }

        if (activeStep === 2) {
            //check cv and transcript have a name
            if (cvTranscriptName.CvName === '' || cvTranscriptName.TranscriptName === '') {
                setSnackbarMessage('Please upload both a CV and a Transcript')
                setOpenSnackBar(true)
                return
            }
        }

        if (activeStep === steps.length - 1) {
            //check all applications
            let uniqueCourses: Set<number> = new Set()
            for (let coursePreference of formValues.coursePreferences) {
                if (coursePreference.courseName === '' || coursePreference.course === '') {
                    setSnackbarMessage(
                        'One of your applications does not contain a selected Course, please select a course for all applications'
                    )
                    setOpenSnackBar(true)
                    return
                } else {
                    if (!uniqueCourses.has(coursePreference.course)) {
                        uniqueCourses.add(coursePreference.course)
                    } else {
                        setSnackbarMessage(
                            'You have more than one application for a course, please select a unique course for all applications'
                        )
                        setOpenSnackBar(true)
                        return
                    }
                }
                if (coursePreference.grade === '') {
                    setSnackbarMessage(
                        'One of your applications does not contain a selected Grade, please select a grade for all applications or select Not Taken Previously'
                    )
                    setOpenSnackBar(true)
                    return
                } else if (coursePreference.grade === 'NotTaken' && coursePreference.explainNotTaken === '') {
                    setSnackbarMessage(
                        'One of your applications is for a course you have not taken, please provide an explanation'
                    )
                    setOpenSnackBar(true)
                    return
                } else if (
                    (coursePreference.markedPreviously === false || coursePreference.tutoredPreviously === false) &&
                    coursePreference.explainNotPrevious === ''
                ) {
                    setSnackbarMessage(
                        'One of your applications is for a course you have not marked or tutored, please provide an explanation'
                    )
                    setOpenSnackBar(true)
                    return
                }
            }
            const res = await postCourseApplications(formValues)
            if (res.ok) {
                setSnackbarSuccessMessage('Course selection submitted successfully')
                setOpenSnackBarSuccess(true)
            } else {
                setSnackbarMessage('Error submitting course selection details, please try again')
                setOpenSnackBar(true)
                return
            }
        }
        setActiveStep(activeStep + 1)

        //if case = 0, check id and email

        //if case = 1, check
    }

    const handleBack = () => {
        setActiveStep(activeStep - 1)
    }

    return (
        <ThemeProvider theme={CustomTheme}>
            <Sidebar />
            <Box
                sx={{
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'safe center',
                    ml: '240px',
                }}
            >
                <Box
                    sx={{
                        mt: '20px',
                        ml: { sm: '60px', lg: '120px' },
                        mr: { sm: '60px', lg: '120px' },
                        mb: '20px',
                    }}
                >
                    {/* Create basic layout */}
                    <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
                        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                            <Typography component="h1" variant="h4" align="center">
                                Application
                            </Typography>
                            <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
                                {steps.map((label) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                            {activeStep === steps.length ? (
                                <>
                                    <Typography variant="h5" gutterBottom>
                                        Thank you for your application.
                                    </Typography>
                                </>
                            ) : (
                                <>
                                    {getStepContent(
                                        activeStep,
                                        formValues,
                                        setFormValues,
                                        cvTranscriptName,
                                        setCvTranscriptName
                                    )}
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                        }}
                                    >
                                        {activeStep !== 0 && (
                                            <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                                                Back
                                            </Button>
                                        )}
                                        {activeStep === 1 ? (
                                            <Button variant="contained" onClick={handleNext} sx={{ mt: 3, ml: 1 }}>
                                                Submit student details
                                            </Button>
                                        ) : activeStep === steps.length - 1 ? (
                                            formValues.coursePreferences.length === 0 ? (
                                                <Button
                                                    variant="contained"
                                                    disabled
                                                    onClick={handleNext}
                                                    sx={{ mt: 3, ml: 1 }}
                                                >
                                                    Submit Application
                                                </Button>
                                            ) : (
                                                <Button variant="contained" onClick={handleNext} sx={{ mt: 3, ml: 1 }}>
                                                    Submit Application
                                                </Button>
                                            )
                                        ) : (
                                            <Button variant="contained" onClick={handleNext} sx={{ mt: 3, ml: 1 }}>
                                                Next
                                            </Button>
                                        )}
                                    </Box>
                                    <Snackbar
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'right',
                                        }}
                                        open={openSnackBar}
                                        autoHideDuration={6000}
                                        onClose={handleClose}
                                    >
                                        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                                            {snackbarMessage}
                                        </Alert>
                                    </Snackbar>
                                    <Snackbar
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'right',
                                        }}
                                        open={openSnackBarSuccess}
                                        autoHideDuration={6000}
                                        onClose={handleCloseSuccess}
                                    >
                                        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
                                            {snackbarSuccessMessage}
                                        </Alert>
                                    </Snackbar>
                                </>
                            )}
                        </Paper>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    )
}

export default Application
