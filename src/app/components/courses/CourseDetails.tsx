'use client'

import {
    Container,
    Paper,
    Grid,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Button,
    Snackbar,
    Input,
} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import TextField from '@mui/material/TextField'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CourseDetails() {
    const [courseCode, setCourseCode] = useState('')
    const [courseDescription, setCourseDescription] = useState('')
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
    const [selectedSemester, setSelectedSemester] = useState<string>('SS')

    const [estimatedStudents, setEstimatedStudents] = useState({ slider: 0, manual: '0' })
    const [enrolledStudents, setEnrolledStudents] = useState({ slider: 0, manual: '0' })
    const [markerHours, setMarkerHours] = useState({ slider: 0, manual: '0' })
    const [markersNeeded, setMarkersNeeded] = useState({ slider: 0, manual: '0' })

    const [description, setDescription] = useState<string>('')
    const [wordCount, setWordCount] = useState<number>(0)
    const currentYear = new Date().getFullYear()
    const yearOptions = [currentYear, currentYear + 1]
    const semesterOptions = ['SS', 'S1', 'S2']
    const [openSnackbar, setOpenSnackbar] = React.useState(false)
    const [snackbarMessage, setSnackbarMessage] = React.useState('')
    const [snackbarSeverity, setSnackbarSeverity] = React.useState<'success' | 'error'>('success')
    const router = useRouter()

    const handleManualInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        setState: React.Dispatch<React.SetStateAction<{ slider: number; manual: string }>>,
        max: number
    ) => {
        let inputValue = event.target.value

        if (inputValue !== '0' && inputValue[0] === '0') {
            inputValue = inputValue.slice(1)
        }

        if (inputValue === '') {
            inputValue = '0'
        }

        let numValue = parseInt(inputValue)
        if (numValue > max) {
            numValue = max
            inputValue = max.toString()
        }

        setState({ slider: numValue, manual: inputValue })
    }

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newDescription = event.target.value
        const newWordCount = newDescription.split(/\s+/).filter(Boolean).length

        setDescription(newDescription)
        setWordCount(newWordCount)
    }

    async function handleSubmit() {
        // Validation checks
        if (!courseCode.trim()) {
            setSnackbarMessage('Course Code cannot be empty.')
            setSnackbarSeverity('error')
            setOpenSnackbar(true)
            return
        }
        if (courseCode.length !== 3) {
            setSnackbarMessage('Course Code must be 3 digits long.')
            setSnackbarSeverity('error')
            setOpenSnackbar(true)
            return
        }

        if (!courseDescription.trim()) {
            setSnackbarMessage('Course Description cannot be empty.')
            setSnackbarSeverity('error')
            setOpenSnackbar(true)
            return
        }

        if (estimatedStudents.slider <= 0) {
            setSnackbarMessage('Estimated Number of Students to Enrol should be greater than 0.')
            setSnackbarSeverity('error')
            setOpenSnackbar(true)
            return
        }

        if (enrolledStudents.slider <= 0) {
            setSnackbarMessage('Number of Students Currently Enrolled should be greater than 0.')
            setSnackbarSeverity('error')
            setOpenSnackbar(true)
            return
        }

        if (markerHours.slider <= 0) {
            setSnackbarMessage('Estimated Number of Marker Hours Required should be greater than 0.')
            setSnackbarSeverity('error')
            setOpenSnackbar(true)
            return
        }

        if (markersNeeded.slider <= 0) {
            setSnackbarMessage('Preferred Number of Markers should be greater than 0.')
            setSnackbarSeverity('error')
            setOpenSnackbar(true)
            return
        }

        if (!description.trim()) {
            setSnackbarMessage('Description of Marker Responsibilities cannot be empty.')
            setSnackbarSeverity('error')
            setOpenSnackbar(true)
            return
        }

        const finalCourseCode = `COMPSCI ${courseCode}`

        const formData = {
            courseCode: finalCourseCode,
            courseDescription,
            numOfEstimatedStudents: estimatedStudents.slider,
            numOfEnrolledStudents: enrolledStudents.slider,
            markerHours: markerHours.slider,
            needMarkers: markersNeeded.slider > 0,
            markersNeeded: markersNeeded.slider,
            semester: `${selectedYear}${selectedSemester}`,
            markerResponsibilities: description,
        }
        console.log('Submitting form with data:', formData)
        try {
            const response = await fetch('/api/courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (response.status !== 201) {
                // Assuming 201 is the status code for successful creation
                // Handle server-side error
                console.error('Error:', data.statusText)
                setSnackbarMessage(data.statusText || 'Failed to add course.')
                setSnackbarSeverity('error')
                setOpenSnackbar(true)
                return
            }

            // Handle success
            console.log('Course added:', data)
            setSnackbarMessage('Course successfully added!')
            setSnackbarSeverity('success')
            setOpenSnackbar(true)

            // Clear form fields
            setCourseCode('')
            setCourseDescription('')
            setSelectedYear(new Date().getFullYear())
            setSelectedSemester('SS')
            setEstimatedStudents({ slider: 0, manual: '0' })
            setEnrolledStudents({ slider: 0, manual: '0' })
            setMarkerHours({ slider: 0, manual: '0' })
            setMarkersNeeded({ slider: 0, manual: '0' })

            setDescription('')
            setWordCount(0)
        } catch (error) {
            // Handle network or other unknown errors
            console.error('Error:', error)
            setSnackbarMessage('Failed to add course.')
            setSnackbarSeverity('error')
            setOpenSnackbar(true)
        }
    }

    function handleCancel() {
        router.push('/dashboard')
    }

    return (
        <Container maxWidth="sm" style={{ marginTop: '2em' }}>
            <Paper elevation={3} style={{ padding: '2em' }}>
                <Typography variant="h4" gutterBottom align="center" style={{ fontWeight: 700 }}>
                    Course Details
                </Typography>
                <Grid container spacing={3} justifyContent="center">
                    <Grid item style={{ width: '350px' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    variant="outlined"
                                    style={{ width: '100%' }}
                                    value="COMPSCI"
                                    disabled
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Course Code"
                                    variant="outlined"
                                    style={{ width: '100%' }}
                                    value={courseCode}
                                    onChange={(e) => {
                                        const val = e.target.value
                                        // Allow only digits and up to 3 characters
                                        if (/^\d{0,3}$/.test(val)) {
                                            setCourseCode(val)
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item>
                        <TextField
                            label="Course Description"
                            variant="outlined"
                            style={{ width: '350px' }}
                            value={courseDescription}
                            onChange={(e) => setCourseDescription(e.target.value)}
                        />
                    </Grid>
                    <Grid item>
                        <FormControl fullWidth style={{ width: '350px' }}>
                            <InputLabel id="year-select-label">Year</InputLabel>
                            <Select
                                labelId="year-select-label"
                                id="year-select"
                                value={selectedYear}
                                label="Year"
                                onChange={(event) => setSelectedYear(Number(event.target.value))}
                            >
                                {yearOptions.map((year) => (
                                    <MenuItem key={year} value={year}>
                                        {year}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <FormControl fullWidth style={{ width: '350px' }}>
                            <InputLabel id="semester-select-label">Semester</InputLabel>
                            <Select
                                labelId="semester-select-label"
                                id="semester-select"
                                value={selectedSemester}
                                label="Semester"
                                onChange={(event) => setSelectedSemester(String(event.target.value))}
                            >
                                {semesterOptions.map((semester) => (
                                    <MenuItem key={semester} value={semester}>
                                        {semester}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container direction="column" spacing={2} justifyContent="center" alignItems="center">
                            <Grid item>
                                <Typography gutterBottom>Estimated Number of Students to Enrol:</Typography>
                            </Grid>

                            <Grid item>
                                <Input
                                    id="students-enrol-input"
                                    type="number"
                                    value={estimatedStudents.manual}
                                    onChange={(e) => handleManualInputChange(e, setEstimatedStudents, 2000)}
                                    inputProps={{
                                        min: 0,
                                        max: 2000,
                                        'aria-labelledby': 'input-slider',
                                    }}
                                    size="small"
                                    style={{ width: '80px' }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container direction="column" spacing={2} justifyContent="center" alignItems="center">
                            <Grid item>
                                <Typography gutterBottom>Number of Students Currently Enrolled:</Typography>
                            </Grid>

                            <Grid item>
                                <Input
                                    id="students-currently-enrolled-input"
                                    type="number"
                                    value={enrolledStudents.manual}
                                    onChange={(e) => handleManualInputChange(e, setEnrolledStudents, 2000)}
                                    inputProps={{
                                        min: 0,
                                        max: 2000,
                                        'aria-labelledby': 'input-slider',
                                    }}
                                    size="small"
                                    style={{ width: '80px' }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container direction="column" spacing={2} justifyContent="center" alignItems="center">
                            <Grid item>
                                <Typography gutterBottom>Estimated Number of Marker Hours Required:</Typography>
                            </Grid>

                            <Grid item>
                                <Input
                                    id="marker-hours-input"
                                    type="number"
                                    value={markerHours.manual}
                                    onChange={(e) => handleManualInputChange(e, setMarkerHours, 500)}
                                    inputProps={{
                                        min: 0,
                                        max: 500,
                                        'aria-labelledby': 'input-slider',
                                    }}
                                    size="small"
                                    style={{ width: '80px' }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container direction="column" spacing={2} justifyContent="center" alignItems="center">
                            <Grid item>
                                <Typography gutterBottom>Preferred Number of Markers:</Typography>
                            </Grid>

                            <Grid item>
                                <Input
                                    id="preferred-markers-input"
                                    type="number"
                                    value={markersNeeded.manual}
                                    onChange={(e) => handleManualInputChange(e, setMarkersNeeded, 50)}
                                    inputProps={{
                                        min: 0,
                                        max: 50,
                                        'aria-labelledby': 'input-slider',
                                    }}
                                    size="small"
                                    style={{ width: '80px' }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container direction="column" spacing={2} justifyContent="center" alignItems="center">
                            <Grid item>
                                <TextField
                                    label="Description of Marker Responsibilities"
                                    variant="outlined"
                                    style={{ width: '350px' }}
                                    multiline
                                    rows={4}
                                    value={description}
                                    onChange={handleDescriptionChange}
                                />
                                <FormHelperText>{`${wordCount}/100`}</FormHelperText>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid container item alignItems="center" spacing={1} style={{ marginTop: '1em' }}>
                        <Grid item>
                            <Button variant="contained" color="primary" onClick={handleSubmit}>
                                CREATE
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="outlined" color="primary" onClick={handleCancel}>
                                BACK
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                message={snackbarMessage}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                action={
                    <IconButton size="small" color="inherit" onClick={() => setOpenSnackbar(false)}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            />
        </Container>
    )
}
