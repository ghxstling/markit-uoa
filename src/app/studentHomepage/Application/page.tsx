'use client'

import CVAndTranscript from '@/app/components/ApplicationForms/CVAndTranscript'
import EmploymentDetails from '@/app/components/ApplicationForms/EmploymentDetails'
import PersonalDetails from '@/app/components/ApplicationForms/PersonalDetails'
import Sidebar from '@/app/components/Sidebar'
import { IFormValues } from '@/types/IFormValues'
import { Box, Button, Container, Paper, Snackbar, Step, StepLabel, Stepper, Typography } from '@mui/material'
import React, { useState } from 'react'
import validator from 'validator'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import CoursePreferences from '@/app/components/ApplicationForms/CoursePreferences'

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

    //TODO If there is an existing application, fetch existing application and update formValues

    const [snackbarMessage, setSnackbarMessage] = useState('Please enter 9 digits for your student ID')
    const [openSnackBar, setOpenSnackBar] = useState(false)

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }

        setOpenSnackBar(false)
    }

    const handleNext = () => {
        if (activeStep === steps.length - 1) {
            //check individual fields
            if (validator.isEmail(formValues.email) === false) {
                setSnackbarMessage('Please enter a valid email address')
                setOpenSnackBar(true)
                return
            } else if ((formValues.AUID as string).length !== 9) {
                setSnackbarMessage('Please enter 9 digits for your student ID')
                setOpenSnackBar(true)
                return
            } else if (formValues.degree === '') {
                setSnackbarMessage('Please select a degree type')
                setOpenSnackBar(true)
                return
            }

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
    }

    const handleBack = () => {
        setActiveStep(activeStep - 1)
    }

    return (
        <div>
            <>
                <Box sx={{ display: 'flex' }}>
                    {/* Create basic layout */}
                    <Box sx={{ width: '15rem' }}>
                        <Sidebar />
                    </Box>
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
                                        <Button variant="contained" onClick={handleNext} sx={{ mt: 3, ml: 1 }}>
                                            {activeStep === steps.length - 1 ? 'Submit Application' : 'Next'}
                                        </Button>
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
            </>
        </div>
    )
}

export default Application
