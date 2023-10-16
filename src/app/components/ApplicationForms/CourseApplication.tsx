import {
    Box,
    Button,
    Chip,
    FormControlLabel,
    Grid,
    MenuItem,
    Radio,
    RadioGroup,
    TextField,
    Typography,
} from '@mui/material'
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
import { number } from 'zod'

interface CourseApplicationProps {
    application: CourseApplicationType
    disableRemove: boolean
    disableCourseName: boolean
    updateCoursePreference: (updatedApplication: CourseApplicationType) => void
    removeCoursePreference: (id: number) => void
}

const CourseApplication: React.FC<CourseApplicationProps> = ({
    application,
    updateCoursePreference,
    removeCoursePreference,
    disableRemove,
    disableCourseName,
}) => {
    let data = {
        course: application.course,
        courseName: application.courseName,
        grade: application.grade,
        explainNotTaken: application.explainNotTaken,
        markedPreviously: application.markedPreviously,
        tutoredPreviously: application.tutoredPreviously,
        explainNotPrevious: application.explainNotPrevious,
    }

    const [formData, setFormData] = useState(data)
    const [courseData, setCourseData] = useState<Course[]>([])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const response = await fetch('/api/courses', { method: 'GET' })
            let jsonData = await response.json()
            jsonData = jsonData.sort(
                (a: any, b: any) => parseInt(a.courseCode.split(' ')[1]) - parseInt(b.courseCode.split(' ')[1])
            )
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
                course: number | ''
                courseName: string
                grade: string
                explainNotTaken: string
                markedPreviously: boolean
                tutoredPreviously: boolean
                explainNotPrevious: string
            }) => ({
                ...prevFormData,
                [name]: value,
                ...(name === 'course' && {
                    course: parseInt(value),
                    courseName: courseData.find((course) => course.id === parseInt(value))?.courseCode,
                }),
                ...(name === 'markedPreviously' && {
                    markedPreviously: value === 'Yes',
                }),
                ...(name === 'tutoredPreviously' && {
                    tutoredPreviously: value === 'Yes',
                }),
            })
        )
    }

    const handleApplicationUpdate = () => {
        const updatedApplication: CourseApplicationType = {
            id: thisApplicationId,
            courseName: formData.courseName,
            prefId: coursePrefId,
            course: formData.course,
            grade: formData.grade,
            explainNotTaken: formData.explainNotTaken,
            markedPreviously: formData.markedPreviously,
            tutoredPreviously: formData.tutoredPreviously,
            explainNotPrevious: formData.explainNotPrevious,
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
                    <Grid container spacing={3} justifyContent="center" alignItems="center" direction="column">
                        <Grid item xs={12}>
                            <Typography variant="h4" fontSize="34px">
                                Preference {coursePrefId}
                            </Typography>
                        </Grid>
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
                            disabled={disableCourseName}
                        >
                            {courseData.map((course) => (
                                <MenuItem key={course.id} value={course.id}>
                                    {course.courseCode}
                                </MenuItem>
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
                            <MenuItem value={'A-'}>A-</MenuItem>
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
                                    value={String(formData.markedPreviously) === 'true' ? 'Yes' : 'No'}
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
                                    value={String(formData.tutoredPreviously) === 'true' ? 'Yes' : 'No'}
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

            <Button onClick={() => removeCoursePreference(thisApplicationId)} disabled={disableRemove}>
                Remove Application
            </Button>
        </>
    )
}

export default CourseApplication
