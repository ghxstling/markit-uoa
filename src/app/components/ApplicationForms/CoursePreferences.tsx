import { Box, Button, Grid, Typography } from '@mui/material'
import React, { useState } from 'react'
import CourseApplication from './CourseApplication'

type CourseApplicationType = {
    id: number
    data: {
        course: string
        grade: string
        explainQualified: string
        markedPreviously: string
        tutoredPreviously: string
        explainNoPrevious: string
    }
}

const CoursePreferences = () => {
    const [courseApplications, setCourseApplications] = useState<CourseApplicationType[]>([])

    const addCourseApplication = () => {
        setCourseApplications((prevApplications) => [
            ...prevApplications,
            {
                id: new Date().getTime(),
                data: {
                    course: '',
                    grade: '',
                    explainQualified: '',
                    markedPreviously: 'No',
                    tutoredPreviously: 'No',
                    explainNoPrevious: '',
                },
            },
        ])
    }

    const updateApplication = (updatedApplication: any) => {
        setCourseApplications((prevApplications) =>
            prevApplications.map((application) =>
                application.id === updatedApplication.id ? updatedApplication : application
            )
        )
    }

    const removeCourseApplication = (id: number) => {
        setCourseApplications((prevApplications) => prevApplications.filter((application) => application.id !== id))
    }

    return (
        <>
            <Grid container spacing={3} direction="column" justifyContent="center" alignItems="center">
                <Grid item>
                    <Typography variant="h5" fontWeight="bold">
                        Course Preference Selection and Application
                    </Typography>
                </Grid>
                <Grid item>
                    <Grid container spacing={3} direction="column">
                        {courseApplications.map((application) => (
                            <Grid item>
                                <CourseApplication
                                    key={application.id}
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
