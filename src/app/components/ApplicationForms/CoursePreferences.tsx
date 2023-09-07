import { Box, Button, Grid, Typography } from '@mui/material'
import React, { useState } from 'react'
import CourseApplication from './CourseApplication'

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

const CoursePreferences = () => {
    const [courseApplications, setCourseApplications] = useState<CourseApplicationType[]>([])
    const [coursePreferenceID, setCoursePreferenceID] = useState(1)

    const addCourseApplication = () => {
        setCourseApplications((prevApplications) => [
            ...prevApplications,
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
        ])
        setCoursePreferenceID(coursePreferenceID + 1)
    }

    const updateApplication = (updatedApplication: any) => {
        setCourseApplications((prevApplications) =>
            prevApplications.map((application) =>
                application.id === updatedApplication.id ? updatedApplication : application
            )
        )
        courseApplications.forEach((application) => {
            console.log(application.data)
        })
    }

    const removeCourseApplication = (id: number) => {
        let prefIdCounter = 1
        const updatedApplications = courseApplications.filter((application) => application.id !== id)
        updatedApplications.forEach((application, index) => {
            application.prefId = index + 1
            prefIdCounter++
        })
        setCourseApplications(updatedApplications)
        setCoursePreferenceID(prefIdCounter)
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
                    <Grid container width={400} spacing={3} direction="column">
                        {courseApplications.map((application) => (
                            <Grid item width={400}>
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
