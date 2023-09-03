'use client'

import CVAndTranscript from '@/app/components/ApplicationForms/CVAndTranscript'
import EmploymentDetails from '@/app/components/ApplicationForms/EmploymentDetails'
import PersonalDetails from '@/app/components/ApplicationForms/PersonalDetails'
import Sidebar from '@/app/components/Sidebar'
import {
    Box,
    Button,
    Container,
    Paper,
    Step,
    StepLabel,
    Stepper,
    Typography,
} from '@mui/material'
import React, { useState, Component } from 'react'

const steps = [
    'Personal Details',
    'Employment Details',
    'CV and Academic Transcript Upload',
]

function getStepContent(step: number) {
    switch (step) {
        case 0:
            return <PersonalDetails />
        case 1:
            return <EmploymentDetails />
        case 2:
            return <CVAndTranscript />
        default:
            throw new Error('Unknown step')
    }
}

const Application = () => {
    const [activeStep, setActiveStep] = useState(0)

    const handleNext = () => {
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
                    <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
                        <Paper
                            variant="outlined"
                            sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
                        >
                            <Typography
                                component="h1"
                                variant="h4"
                                align="center"
                            >
                                Application
                            </Typography>
                            <Stepper
                                activeStep={activeStep}
                                sx={{ pt: 3, pb: 5 }}
                            >
                                {steps.map((label) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                            {activeStep === steps.length ? (
                                //Add a snackbar to this later
                                <>
                                    <Typography variant="h5" gutterBottom>
                                        Thank you for your application.
                                    </Typography>
                                </>
                            ) : (
                                <>
                                    {getStepContent(activeStep)}
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                        }}
                                    >
                                        {activeStep !== 0 && (
                                            <Button
                                                onClick={handleBack}
                                                sx={{ mt: 3, ml: 1 }}
                                            >
                                                Back
                                            </Button>
                                        )}
                                        <Button
                                            variant="contained"
                                            onClick={handleNext}
                                            sx={{ mt: 3, ml: 1 }}
                                        >
                                            {activeStep === steps.length - 1
                                                ? 'Submit Application'
                                                : 'Next'}
                                        </Button>
                                    </Box>
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
