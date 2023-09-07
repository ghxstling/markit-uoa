import { Box, Button, FormControlLabel, Grid, MenuItem, Radio, RadioGroup, TextField, Typography } from '@mui/material'
import React from 'react'

const CourseApplication = ({ application, updateApplication, removeCourseApplication }) => {
    const thisApplicationId = application.id
    const thisApplicationData = application.data
    const coursePrefId = application.prefId

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        const newData = {
            course: data.get('course'),
            grade: data.get('grade'),
            explainNotTaken: data.get('explainNotTaken'),
            markedPreviously: data.get('markedPreviously'),
            tutoredPreviously: data.get('tutoredPreviously'),
            explainNotPrevious: data.get('explainNotPrevious'),
        }
        handleDataChange(newData)
    }

    const handleDataChange = (updatedData: any) => {
        const updatedApplication = {
            id: thisApplicationId,
            data: updatedData,
        }
        updateApplication(updatedApplication)
    }

    return (
        <>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={3} justifyContent="center" direction="column">
                    <Grid item>
                        <Typography variant="h4">Preference {coursePrefId}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField name="course" id="course" label="Select Course" select fullWidth required>
                            <MenuItem value={'COMPSCI 101'}>COMPSCI 101</MenuItem>
                            <MenuItem value={'COMPSCI 110'}>COMPSCI 110</MenuItem>
                            {/* 
                                Need to fetch all courses then do a .map() and render all menu items
                                with smth like: <MenuItem value={{Course.id}}>{Course.name}</MenuItem>
                            */}
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField name="grade" id="grade" label="Grade Received When Taken" select fullWidth required>
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
                        ></TextField>
                    </Grid>
                    <Grid item>
                        {/* Radio marked course previously? */}
                        <Grid container direction="column" spacing={0} justifyContent="center" alignItems="center">
                            <Grid item>
                                <Typography>Have you marked this course previously?</Typography>
                            </Grid>
                            <Grid item>
                                <RadioGroup row name="markedPreviously" id="markedPreviously" defaultValue="No">
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
                                <RadioGroup row name="tutoredPreviously" id="tutoredPreviously" defaultValue="No">
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
                        {/* Explanation for not marking or tutoring course previously */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" sx={{ mb: '10px' }}>
                                If you haven’t marked or tutored this course previously, please explain any other
                                relevant experience that you have
                            </Typography>
                            <TextField
                                name="explainNotPrevious"
                                id="explainNotPrevious"
                                label="Explanation..."
                                rows={4}
                                multiline
                                fullWidth
                            ></TextField>
                        </Grid>
                    </Grid>
                </Grid>
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                    Submit Details
                </Button>
            </Box>

            <Button onClick={() => removeCourseApplication(thisApplicationId)}>Remove Application</Button>
        </>
    )
}

export default CourseApplication
