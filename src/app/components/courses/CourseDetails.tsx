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
    Slider,
    Box,
    FormHelperText,
    Button,
    Snackbar,
} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import TextField from '@mui/material/TextField'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CourseDetails() {
    const [courseCode, setCourseCode] = useState('')
    const [courseDescription, setCourseDescription] = useState('')
    const [selectedYear, setSelectedYear] = useState<number>(
        new Date().getFullYear()
    )
    const [selectedSemester, setSelectedSemester] = useState<string>('SS')

    const [sliderValue, setSliderValue] = useState(0)
    const [manualInputValue, setManualInputValue] = useState<string>(
        sliderValue.toString()
    )
    const [enrolledSliderValue, setEnrolledSliderValue] = useState(0)
    const [enrolledManualInputValue, setEnrolledManualInputValue] =
        useState<string>(enrolledSliderValue.toString())

    const [markerHoursSliderValue, setMarkerHoursSliderValue] = useState(0)
    const [markerHoursManualInputValue, setMarkerHoursManualInputValue] =
        useState<string>(markerHoursSliderValue.toString())
    const [markerSliderValue, setMarkerSliderValue] = useState(0)
    const [markerManualInputValue, setMarkerManualInputValue] =
        useState<string>(markerSliderValue.toString())
    const [description, setDescription] = useState<string>('')
    const [wordCount, setWordCount] = useState<number>(0)
    const currentYear = new Date().getFullYear()
    const yearOptions = [currentYear, currentYear + 1]
    const semesterOptions = ['SS', 'S1', 'S2']
    const [openSnackbar, setOpenSnackbar] = React.useState(false)
    const [snackbarMessage, setSnackbarMessage] = React.useState('')
    const [snackbarSeverity, setSnackbarSeverity] = React.useState<
        'success' | 'error'
    >('success')
    const router = useRouter()

    const handleManualInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.valueAsNumber
        if (value >= 0 && value <= 800) {
            setSliderValue(value)
            setManualInputValue(event.target.value)
        }
    }
    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        if (typeof newValue === 'number') {
            setSliderValue(newValue)
            setManualInputValue(newValue.toString())
        }
    }

    const handleEnrolledManualInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.valueAsNumber
        if (value >= 0 && value <= 800) {
            setEnrolledSliderValue(value)
            setEnrolledManualInputValue(event.target.value)
        }
    }
    const handleEnrolledSliderChange = (
        event: Event,
        newValue: number | number[]
    ) => {
        if (typeof newValue === 'number') {
            setEnrolledSliderValue(newValue)
            setEnrolledManualInputValue(newValue.toString())
        }
    }

    const handleMarkerHoursManualInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.valueAsNumber
        if (value >= 0 && value <= 200) {
            setMarkerHoursSliderValue(value)
            setMarkerHoursManualInputValue(event.target.value)
        }
    }
    const handleMarkerHoursSliderChange = (
        event: Event,
        newValue: number | number[]
    ) => {
        if (typeof newValue === 'number') {
            setMarkerHoursSliderValue(newValue)
            setMarkerHoursManualInputValue(newValue.toString())
        }
    }

    const handleMarkerManualInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.valueAsNumber
        if (value >= 0 && value <= 200) {
            setMarkerSliderValue(value)
            setMarkerManualInputValue(event.target.value)
        }
    }

    const handleMarkerSliderChange = (
        event: Event,
        newValue: number | number[]
    ) => {
        if (typeof newValue === 'number') {
            setMarkerSliderValue(newValue)
            setMarkerManualInputValue(newValue.toString())
        }
    }

    const handleDescriptionChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const newDescription = event.target.value
        const newWordCount = newDescription.split(/\s+/).filter(Boolean).length

        setDescription(newDescription)
        setWordCount(newWordCount)
    }

    async function handleSubmit() {
        const formData = {
            courseCode,
            courseDescription,
            numOfEstimatedStudents: sliderValue,
            numOfEnrolledStudents: enrolledSliderValue,
            markerHours: markerHoursSliderValue,
            needMarkers: markerSliderValue > 0,
            markersNeeded: markerSliderValue,
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
        } catch (error) {
            // Handle network or other unknown errors
            console.error('Error:', error)
            setSnackbarMessage('Failed to add course.')
            setSnackbarSeverity('error')
            setOpenSnackbar(true)
        }
    }

    function handleCancel() {
        router.back() // this navigates the user to the previous page in history
    }

    return (
        <Container maxWidth="sm" style={{ marginTop: '2em' }}>
            <Paper elevation={3} style={{ padding: '2em' }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    align="center"
                    style={{ fontWeight: 700 }}
                >
                    Course Details
                </Typography>
                <Grid container spacing={3} justifyContent="center">
                    <Grid item>
                        <TextField
                            label="Course Code"
                            variant="outlined"
                            style={{ width: '350px' }}
                            value={courseCode}
                            onChange={(e) => setCourseCode(e.target.value)}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            label="Course Description"
                            variant="outlined"
                            style={{ width: '350px' }}
                            value={courseDescription}
                            onChange={(e) =>
                                setCourseDescription(e.target.value)
                            }
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
                                onChange={(event) =>
                                    setSelectedYear(Number(event.target.value))
                                }
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
                            <InputLabel id="semester-select-label">
                                Semester
                            </InputLabel>
                            <Select
                                labelId="semester-select-label"
                                id="semester-select"
                                value={selectedSemester}
                                label="Semester"
                                onChange={(event) =>
                                    setSelectedSemester(
                                        String(event.target.value)
                                    )
                                }
                            >
                                {semesterOptions.map((semester) => (
                                    <MenuItem key={semester} value={semester}>
                                        {semester}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid
                        container
                        item
                        xs={12}
                        justifyContent="center"
                        spacing={3}
                    >
                        <Typography
                            variant="subtitle1"
                            style={{ marginTop: '20px' }}
                        >
                            Estimated number of students to enrol:
                        </Typography>
                        <Grid item xs={12}>
                            <Box sx={{ width: '350px', margin: '0 auto' }}>
                                <Slider
                                    aria-label="Number of students"
                                    defaultValue={0}
                                    valueLabelDisplay="auto"
                                    step={10}
                                    marks={[
                                        { value: 0, label: '0' },
                                        { value: 800, label: '800' },
                                    ]}
                                    min={0}
                                    max={800}
                                    value={sliderValue}
                                    onChange={handleSliderChange}
                                />
                                <Grid container justifyContent="center">
                                    <Grid item xs={6}>
                                        <Box
                                            display="flex"
                                            justifyContent="center"
                                        >
                                            {' '}
                                            <TextField
                                                type="number"
                                                value={manualInputValue}
                                                onChange={
                                                    handleManualInputChange
                                                }
                                                style={{ width: '90px' }}
                                                InputProps={{
                                                    inputProps: {
                                                        min: 0,
                                                        max: 800,
                                                    },
                                                }}
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>

                    <Grid
                        container
                        item
                        xs={12}
                        justifyContent="center"
                        spacing={3}
                    >
                        <Typography
                            variant="subtitle1"
                            style={{ marginTop: '20px' }}
                        >
                            Number of students currently enrolled:
                        </Typography>
                        <Grid item xs={12}>
                            <Box sx={{ width: '350px', margin: '0 auto' }}>
                                <Slider
                                    aria-label="Number of currently enrolled students"
                                    defaultValue={0}
                                    valueLabelDisplay="auto"
                                    step={10}
                                    marks={[
                                        { value: 0, label: '0' },
                                        { value: 800, label: '800' },
                                    ]}
                                    min={0}
                                    max={800}
                                    value={enrolledSliderValue}
                                    onChange={handleEnrolledSliderChange}
                                />
                                <Grid container justifyContent="center">
                                    <Grid item xs={6}>
                                        <Box
                                            display="flex"
                                            justifyContent="center"
                                        >
                                            {' '}
                                            <TextField
                                                type="number"
                                                value={enrolledManualInputValue}
                                                onChange={
                                                    handleEnrolledManualInputChange
                                                }
                                                style={{ width: '90px' }}
                                                InputProps={{
                                                    inputProps: {
                                                        min: 0,
                                                        max: 800,
                                                    },
                                                }}
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>

                    <Grid
                        container
                        item
                        xs={12}
                        justifyContent="center"
                        spacing={3}
                    >
                        <Typography
                            variant="subtitle1"
                            style={{ marginTop: '20px' }}
                        >
                            Estimated number of marker hours required:
                        </Typography>
                        <Grid item xs={12}>
                            <Box sx={{ width: '350px', margin: '0 auto' }}>
                                <Slider
                                    aria-label="Number of hours"
                                    defaultValue={0}
                                    valueLabelDisplay="auto"
                                    step={10}
                                    marks={[
                                        { value: 0, label: '0' },
                                        { value: 200, label: '200' },
                                    ]}
                                    min={0}
                                    max={200}
                                    value={markerHoursSliderValue}
                                    onChange={handleMarkerHoursSliderChange}
                                />
                                <Grid container justifyContent="center">
                                    <Grid item xs={6}>
                                        <Box
                                            display="flex"
                                            justifyContent="center"
                                        >
                                            {' '}
                                            <TextField
                                                type="number"
                                                value={
                                                    markerHoursManualInputValue
                                                }
                                                onChange={
                                                    handleMarkerHoursManualInputChange
                                                }
                                                style={{ width: '90px' }}
                                                InputProps={{
                                                    inputProps: {
                                                        min: 0,
                                                        max: 200,
                                                    },
                                                }}
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>

                    <Grid
                        container
                        item
                        xs={12}
                        justifyContent="center"
                        spacing={3}
                    >
                        <Typography
                            variant="subtitle1"
                            style={{ marginTop: '20px' }}
                        >
                            Preferred number of markers:
                        </Typography>
                        <Grid item xs={12}>
                            <Box sx={{ width: '350px', margin: '0 auto' }}>
                                <Slider
                                    aria-label="Number of markers"
                                    defaultValue={0}
                                    valueLabelDisplay="auto"
                                    step={1}
                                    marks={[
                                        { value: 0, label: '0' },
                                        { value: 20, label: '20' },
                                    ]}
                                    min={0}
                                    max={20}
                                    value={markerSliderValue}
                                    onChange={handleMarkerSliderChange}
                                />
                                <Grid container justifyContent="center">
                                    <Grid item xs={6}>
                                        <Box
                                            display="flex"
                                            justifyContent="center"
                                        >
                                            {' '}
                                            <TextField
                                                type="number"
                                                value={markerManualInputValue}
                                                onChange={
                                                    handleMarkerManualInputChange
                                                }
                                                style={{ width: '90px' }}
                                                InputProps={{
                                                    inputProps: {
                                                        min: 0,
                                                        max: 20,
                                                    },
                                                }}
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        item
                        xs={12}
                        justifyContent="center"
                        spacing={3}
                    >
                        <Grid item>
                            <TextField
                                label="Description of marker responsibilities"
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
                    <Grid
                        container
                        item
                        alignItems="center"
                        spacing={1}
                        style={{ marginTop: '1em' }}
                    >
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                            >
                                CREATE
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={handleCancel}
                            >
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
                    <IconButton
                        size="small"
                        color="inherit"
                        onClick={() => setOpenSnackbar(false)}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            />
        </Container>
    )
}
