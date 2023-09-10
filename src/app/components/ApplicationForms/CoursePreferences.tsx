import { Box, Button, Grid, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import CourseApplication from './CourseApplication'
import { IFormValues } from '@/app/interfaces/FormValues'

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

interface CoursePreferenceProps {
    formValues: IFormValues
    setFormValues: React.Dispatch<React.SetStateAction<IFormValues>>
}

const CoursePreferences: React.FC<CoursePreferenceProps> = ({ formValues, setFormValues }) => {
    const [coursePreferenceID, setCoursePreferenceID] = useState(1)

    const addCourseApplication = () => {
        let newApplications: CourseApplicationType[] = [
            ...formValues.applications,
            {
                id: new Date().getTime(),
                prefId: coursePreferenceID,
                data: {
                    course: '',
                    grade: '',
                    explainNotTaken: '',
                    markedPreviously: 'No',
                    tutoredPreviously: 'No',
                    explainNotPrevious: '',
                },
            },
        ]

        setFormValues({ ...formValues, applications: newApplications })
        setCoursePreferenceID(coursePreferenceID + 1)
    }

    const updateApplication = (updatedApplication: CourseApplicationType) => {
        let currentApplications = formValues.applications
        currentApplications = currentApplications.map((application) =>
            application.id === updatedApplication.id ? updatedApplication : application
        )
        setFormValues({ ...formValues, applications: currentApplications })
    }

    const removeCourseApplication = (id: number) => {
        let prefIdCounter = 1
        const updatedApplications = formValues.applications.filter((application) => application.id !== id)
        updatedApplications.forEach((application, index) => {
            application.prefId = index + 1
            prefIdCounter++
        })
        setFormValues({ ...formValues, applications: updatedApplications })
        setCoursePreferenceID(prefIdCounter)
    }

    return (
        <>
            <Grid container spacing={3} direction="column" justifyContent="center" alignItems="center">
                <Grid item>
                    <Grid container direction="column" justifyContent="center" alignItems="center">
                        <Grid item>
                            <Typography variant="h5" fontWeight="bold">
                                Course Preference Selection and Application
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container width={400} spacing={3} direction="column">
                        {formValues.applications.map((application) => (
                            <Grid item width={400} key={application.id}>
                                <CourseApplication
                                    application={application}
                                    updateApplication={updateApplication}
                                    removeCourseApplication={removeCourseApplication}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>

            <Grid container justifyContent="right" alignItems="right">
                <Grid item>
                    <Button variant="contained" onClick={addCourseApplication} sx={{ mt: '40px', align: 'right' }}>
                        Add a Course
                    </Button>
                </Grid>
            </Grid>
        </>
    )
}

export default CoursePreferences
