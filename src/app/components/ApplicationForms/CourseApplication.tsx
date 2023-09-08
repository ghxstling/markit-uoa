import {
    Box,
    Button,
    FormControlLabel,
    Grid,
    Hidden,
    MenuItem,
    Radio,
    RadioGroup,
    TextField,
    Typography,
} from '@mui/material'
import React, { useState, useEffect } from 'react'

const CourseApplication = ({ application, updateApplication, removeCourseApplication }) => {
    const [formData, setFormData] = useState({
        course: '',
        grade: '',
        explainNotTaken: '',
        markedPreviously: 'No',
        tutoredPreviously: 'No',
        explainNotPrevious: '',
    })

    const thisApplicationId = application.id
    const coursePrefId = application.prefId

    const handleChange = (event: any) => {
        const { name, value } = event.target
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }))
    }

    const handleApplicationUpdate = () => {
        console.log(formData)
        const updatedApplication = {
            id: thisApplicationId,
            data: formData,
        }
        submitFormData(updatedApplication)
    }

    const submitFormData = (newApplication: any) => {
        updateApplication(newApplication)
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
                            <MenuItem value={'COMPSCI 101'}>COMPSCI 101</MenuItem>
                            <MenuItem value={'COMPSCI 110'}>COMPSCI 110</MenuItem>
                            {/* 
                                Need to fetch all courses then do a .map() and render all menu items
                                with smth like: <MenuItem value={{Course.id}}>{Course.name}</MenuItem>
                            */}
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
                        {/* Radio marked course previously? */}
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
                        {/* Radio tutored course previously? */}
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
                    {/* Explanation for not marking or tutoring course previously */}
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

            <Button onClick={() => removeCourseApplication(thisApplicationId)}>Remove Application</Button>
        </>
    )
}

export default CourseApplication
