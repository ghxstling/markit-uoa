'use client'

import CVAndTranscript from '@/app/components/ApplicationForms/CVAndTranscript'
import EmploymentDetails from '@/app/components/ApplicationForms/EmploymentDetails'
import PersonalDetails from '@/app/components/ApplicationForms/PersonalDetails'
import { IFormValues } from '@/types/IFormValues'
import { Box, Button, Container, Paper, Snackbar, Step, StepLabel, Stepper, Typography } from '@mui/material'
import React, { useState } from 'react'
import validator from 'validator'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import CoursePreferences from '@/app/components/ApplicationForms/CoursePreferences'
import CustomTheme from '@/app/CustomTheme'
import { ThemeProvider } from '@mui/material/styles'

const steps = ['Personal Details', 'Employment Details', 'CV and Academic Transcript Upload', 'Course Preferences']

// get content for each application step
function getStepContent(
    step: number,
    formValues: IFormValues,
    setFormValues: React.Dispatch<React.SetStateAction<IFormValues>>
) {
    switch (step) {
        case 0:
            return <PersonalDetails formValues={formValues} setFormValues={setFormValues} />
        case 1:
            return <EmploymentDetails formValues={formValues} setFormValues={setFormValues} />
        case 2:
            return <CVAndTranscript />
        case 3:
            return <CoursePreferences formValues={formValues} setFormValues={setFormValues} />
        default:
            throw new Error('Unknown step')
    }
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const Application = () => {
    //initialise use states
    const [activeStep, setActiveStep] = useState(0)
    const [formValues, setFormValues] = useState<IFormValues>({
        name: '',
        upi: '',
        email: '',
        AUID: '',
        currentlyOverseas: 'No',
        citizenOrPermanentResident: 'Yes',
        workVisa: 'Yes',
        degree: '',
        degreeYears: 1,
        workHours: 1,
        coursePreferences: [],
    })
    const [hasPreferences, setHasPreferences] = useState(true)

    //TODO Fetch existing application, get relevant values and update formValues

    const [snackbarMessage, setSnackbarMessage] = useState('Please enter 9 digits for your student ID')
    const [openSnackBar, setOpenSnackBar] = useState(false)

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }

        setOpenSnackBar(false)
    }

    const handleNext = () => {
        //if case = 0, check id and email
        if (activeStep === 0) {
            if (validator.isEmail(formValues.email) === false) {
                setSnackbarMessage('Please enter a valid email address')
                setOpenSnackBar(true)
                return
            } else if ((formValues.AUID as string).length !== 9) {
                setSnackbarMessage('Please enter 9 digits for your student ID')
                setOpenSnackBar(true)
                return
            }
        }

        //if activeStep === 1 check Degree is entered
        else if (activeStep === 1) {
            if (formValues.degree === '') {
                setSnackbarMessage('Please select a degree type')
                setOpenSnackBar(true)
                return
            }
        }

        if (activeStep === steps.length - 1) {
            //check all applications
            for (let coursePreference of formValues.coursePreferences) {
                if (coursePreference.data.course === '') {
                    setSnackbarMessage(
                        'One of your applications does not contain a selected Course, please select a course for all applications'
                    )
                    setOpenSnackBar(true)
                    return
                } else if (coursePreference.data.grade === '') {
                    setSnackbarMessage(
                        'One of your applications does not contain a selected Grade, please select a grade for all applications or select Not Taken Previously'
                    )
                    setOpenSnackBar(true)
                    return
                }
            }

            //TODO: check that there are 2 selected files (do this after the file storage method has been confirmed)
            console.log(formValues)
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
            <Box
                sx={{
                    display: 'flex',
                    mt: '40px',
                    ml: { sm: '50px', md: '100px', lg: '200px', xl: '250px', xxl: '300px', xxxl: '350px' },
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
                                {getStepContent(activeStep, formValues, setFormValues)}
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
                                    {activeStep === steps.length - 1 ? (
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
                            </>
                        )}
                    </Paper>
                </Container>
            </Box>
        </ThemeProvider>
    )
}

export default Application
