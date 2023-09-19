import { Button, Grid, Typography } from '@mui/material'
import React, { useState } from 'react'
import CourseApplication from './CourseApplication'
import { IFormValues } from '@/types/IFormValues'
import { CourseApplicationType } from '@/types/CourseApplicationType'

interface CoursePreferenceProps {
    formValues: IFormValues
    setFormValues: React.Dispatch<React.SetStateAction<IFormValues>>
}

const CoursePreferences: React.FC<CoursePreferenceProps> = ({ formValues, setFormValues }) => {
    const [coursePreferenceID, setCoursePreferenceID] = useState(1)

    const addCourseApplication = () => {
        let newApplications: CourseApplicationType[] = [
            ...formValues.coursePreferences,
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

        setFormValues({ ...formValues, coursePreferences: newApplications })
        setCoursePreferenceID(coursePreferenceID + 1)
    }

    const updateCoursePreference = (updatedApplication: CourseApplicationType) => {
        let currentApplications = formValues.coursePreferences
        currentApplications = currentApplications.map((coursePreference: CourseApplicationType) =>
            coursePreference.id === updatedApplication.id ? updatedApplication : coursePreference
        )
        setFormValues({ ...formValues, coursePreferences: currentApplications })
    }

    const removeCoursePreference = (id: number) => {
        let prefIdCounter = 1
        const updatedApplications = formValues.coursePreferences.filter(
            (coursePreference) => coursePreference.id !== id
        )
        updatedApplications.forEach((coursePreference, index) => {
            coursePreference.prefId = index + 1
            prefIdCounter++
        })
        setFormValues({ ...formValues, coursePreferences: updatedApplications })
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
                        {formValues.coursePreferences.map((coursePreference) => (
                            <Grid item width={400} key={coursePreference.id}>
                                <CourseApplication
                                    application={coursePreference}
                                    updateCoursePreference={updateCoursePreference}
                                    removeCoursePreference={removeCoursePreference}
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