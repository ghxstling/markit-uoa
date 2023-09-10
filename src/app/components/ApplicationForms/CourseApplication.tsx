import { Box, Button, FormControlLabel, Grid, MenuItem, Radio, RadioGroup, TextField, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'

interface Course {
    id: number
    courseCode: string
    courseDescription: string
    numOfEstimatedStudents: number
    numOfEnrolledStudents: number
    markerHours: number
    markerResponsibilities: string
    needMarkers: boolean
    markersNeeded: number
    semester: string
}

import { CourseApplicationType } from '@/types/CourseApplicationType'

interface CourseApplicationProps {
    application: CourseApplicationType
    updateCoursePreference: (updatedApplication: CourseApplicationType) => void
    removeCoursePreference: (id: number) => void
}

const CourseApplication: React.FC<CourseApplicationProps> = ({
    application,
    updateCoursePreference,
    removeCoursePreference,
}) => {
    const [formData, setFormData] = useState(application.data)
    const [courseData, setCourseData] = useState<Course[]>([])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const response = await fetch('/api/courses', { method: 'GET' })
            const jsonData = await response.json()
            setCourseData(jsonData)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    const thisApplicationId = application.id
    const coursePrefId = application.prefId

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        setFormData(
            (prevFormData: {
                course: string
                grade: string
                explainNotTaken: string
                markedPreviously: string
                tutoredPreviously: string
                explainNotPrevious: string
            }) => ({
                ...prevFormData,
                [name]: value,
            })
        )
    }

    const handleApplicationUpdate = () => {
        console.log(formData) //remvoe this later
        const updatedApplication: CourseApplicationType = {
            id: thisApplicationId,
            prefId: coursePrefId,
            data: formData,
        }
        submitFormData(updatedApplication)
    }

    const submitFormData = (newApplication: CourseApplicationType) => {
        updateCoursePreference(newApplication)
    }

    return (
        <>
            <Box component="form" noValidate sx={{ mt: 3 }}>
                <Grid container spacing={3} justifyContent="center" direction="column">
                    <Grid item>
                        <Typography variant="h4">Preference {coursePrefId}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="course"
                            id="course"
                            label="Select Course"
                            select
                            fullWidth
                            required
                            value={formData.course}
                            onChange={handleChange}
                            onBlur={handleApplicationUpdate}
                        >
                            {courseData.map((course) => (
                                <MenuItem value={course.id}>{course.courseCode}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="grade"
                            id="grade"
                            label="Grade Received When Taken"
                            select
                            fullWidth
                            required
                            value={formData.grade}
                            onChange={handleChange}
                            onBlur={handleApplicationUpdate}
                        >
                            <MenuItem value={'A+'}>A+</MenuItem>
                            <MenuItem value={'A'}>A</MenuItem>
                            <MenuItem value={'B+'}>B+</MenuItem>
                            <MenuItem value={'B'}>B</MenuItem>
                            <MenuItem value={'B-'}>B-</MenuItem>
                            <MenuItem value={'C+'}>C+</MenuItem>
                            <MenuItem value={'C'}>C</MenuItem>
                            <MenuItem value={'C-'}>C-</MenuItem>
                            <MenuItem value={'D+'}>D+</MenuItem>
                            <MenuItem value={'D'}>D</MenuItem>
                            <MenuItem value={'D-'}>D-</MenuItem>
                            <MenuItem value={'NotTaken'}>Not Taken Previously</MenuItem>
                        </TextField>
                        <Typography variant="caption">
                            If You Have Not Taken The Course Before, Select{' '}
                            <b>
                                <i>Not Taken Previously</i>
                            </b>{' '}
                            for the grade
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ mb: '10px' }}>
                            Explanation of why you’re qualified if you haven’t taken this course previously (leave blank
                            if you have)
                        </Typography>
                        <TextField
                            name="explainNotTaken"
                            id="explainNotTaken"
                            label="Explanation..."
                            rows={4}
                            multiline
                            fullWidth
                            value={formData.explainNotTaken}
                            onChange={handleChange}
                            onBlur={handleApplicationUpdate}
                        ></TextField>
                    </Grid>
                    <Grid item>
                        <Grid container direction="column" spacing={0} justifyContent="center" alignItems="center">
                            <Grid item>
                                <Typography>Have you marked this course previously?</Typography>
                            </Grid>
                            <Grid item>
                                <RadioGroup
                                    row
                                    name="markedPreviously"
                                    id="markedPreviously"
                                    value={formData.markedPreviously}
                                    onChange={handleChange}
                                    onBlur={handleApplicationUpdate}
                                >
                                    <Grid container spacing={4}>
                                        <Grid item>
                                            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                                        </Grid>
                                        <Grid item>
                                            <FormControlLabel value="No" control={<Radio />} label="No" />
                                        </Grid>
                                    </Grid>
                                </RadioGroup>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container direction="column" spacing={0} justifyContent="center" alignItems="center">
                            <Grid item>
                                <Typography>Have you tutored this course previously?</Typography>
                            </Grid>
                            <Grid item>
                                <RadioGroup
                                    row
                                    name="tutoredPreviously"
                                    id="tutoredPreviously"
                                    value={formData.tutoredPreviously}
                                    onChange={handleChange}
                                    onBlur={handleApplicationUpdate}
                                >
                                    <Grid container spacing={4}>
                                        <Grid item>
                                            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                                        </Grid>
                                        <Grid item>
                                            <FormControlLabel value="No" control={<Radio />} label="No" />
                                        </Grid>
                                    </Grid>
                                </RadioGroup>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ mb: '10px' }}>
                            If you haven’t marked or tutored this course previously, please explain any other relevant
                            experience that you have (leave blank if you have)
                        </Typography>
                        <TextField
                            name="explainNotPrevious"
                            id="explainNotPrevious"
                            label="Explanation..."
                            rows={4}
                            multiline
                            fullWidth
                            value={formData.explainNotPrevious}
                            onChange={handleChange}
                            onBlur={handleApplicationUpdate}
                        ></TextField>
                    </Grid>
                </Grid>
            </Box>

            <Button onClick={() => removeCoursePreference(thisApplicationId)}>Remove Application</Button>
        </>
    )
}

export default CourseApplication
