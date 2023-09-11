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
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type EditCourseDetailsProps = {
    courseId: string // Assuming courseId is a string
}

export default function EditCourseDetails({
    courseId,
}: EditCourseDetailsProps) {
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
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [snackbarSeverity, setSnackbarSeverity] = useState<
        'success' | 'error'
    >('success')
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(true)
    const [isSaved, setIsSaved] = useState(false)

    const originalCourseDataRef = React.useRef<OriginalCourseData | null>(null)

    const toggleEdit = () => {
        setIsEditing(!isEditing)
    }

    const revertChanges = () => {
        const originalData = originalCourseDataRef.current

        if (originalData) {
            setCourseCode(originalData.courseCode)
            setCourseDescription(originalData.courseDescription)
            setSelectedYear(originalData.selectedYear)
            setSelectedSemester(originalData.selectedSemester)
            setSliderValue(originalData.sliderValue)
            setEnrolledSliderValue(originalData.enrolledSliderValue)
            setMarkerHoursSliderValue(originalData.markerHoursSliderValue)
            setMarkerSliderValue(originalData.markerSliderValue)
            setDescription(originalData.description)

            setIsEditing(false)
        }
    }

    type OriginalCourseData = {
        courseCode: string
        courseDescription: string
        selectedYear: number
        selectedSemester: string
        sliderValue: number
        enrolledSliderValue: number
        markerHoursSliderValue: number
        markerSliderValue: number
        description: string
    }

    type Course = {
        courseCode: string
        courseDescription: string
        semester: string
        numOfEstimatedStudents: number
        numOfEnrolledStudents: number
        markerHours: number
        markersNeeded: number
        markerResponsibilities: string
    }

    async function populateForm(course: Course) {
        try {
            // Store the original data of the course
            originalCourseDataRef.current = {
                courseCode: course.courseCode,
                courseDescription: course.courseDescription,
                selectedYear: parseInt(course.semester.substring(0, 4)),
                selectedSemester: course.semester.substring(4),
                sliderValue: course.numOfEstimatedStudents,
                enrolledSliderValue: course.numOfEnrolledStudents,
                markerHoursSliderValue: course.markerHours,
                markerSliderValue: course.markersNeeded,
                description: course.markerResponsibilities,
            }

            setCourseCode(course.courseCode)
            setCourseDescription(course.courseDescription)

            const year = parseInt(course.semester.substring(0, 4))
            const semester = course.semester.substring(4)

            setSelectedYear(year)
            setSelectedSemester(semester)
            setSliderValue(course.numOfEstimatedStudents)
            setManualInputValue(course.numOfEstimatedStudents.toString())
            setEnrolledSliderValue(course.numOfEnrolledStudents)
            setEnrolledManualInputValue(course.numOfEnrolledStudents.toString())
            setMarkerHoursSliderValue(course.markerHours)
            setMarkerHoursManualInputValue(course.markerHours.toString())
            setMarkerSliderValue(course.markersNeeded)
            setMarkerManualInputValue(course.markersNeeded.toString())
            setDescription(course.markerResponsibilities)

            const wordCount = course.markerResponsibilities
                .split(/\s+/)
                .filter(Boolean).length
            setWordCount(wordCount)
        } catch (error) {
            console.error('Error fetching course data:', error)
            setSnackbarMessage('Failed to fetch course data.')
            setSnackbarSeverity('error')
            setOpenSnackbar(true)
        }
    }

    useEffect(() => {
        async function fetchCourseDetails() {
            try {
                const response = await fetch(`/api/courses/${courseId}`)
                const data = await response.json()

                if (response.status !== 200) {
                    console.error('Error:', data.statusText)
                    setSnackbarMessage(
                        data.statusText || 'Failed to fetch course details.'
                    )
                    setSnackbarSeverity('error')
                    setOpenSnackbar(true)
                    return
                }

                populateForm(data)
            } catch (error) {
                console.error('Error:', error)
                setSnackbarMessage('Failed to fetch course details.')
                setSnackbarSeverity('error')
                setOpenSnackbar(true)
            }
        }

        fetchCourseDetails()
    }, [courseId])

    const handleManualInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        let inputValue = event.target.value
        if (inputValue === '') {
            inputValue = '0'
        }
        let numValue = parseInt(inputValue)
        inputValue = numValue.toString()
        if (numValue > 800) {
            inputValue = '800'
            numValue = 800
        }
        setManualInputValue(inputValue)
        setSliderValue(numValue)
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
        let inputValue = event.target.value
        if (inputValue === '') {
            inputValue = '0'
        }
        let numValue = parseInt(inputValue)
        inputValue = numValue.toString()
        if (numValue > 800) {
            inputValue = '800'
            numValue = 800
        }
        setEnrolledManualInputValue(inputValue)
        setEnrolledSliderValue(numValue)
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
        let inputValue = event.target.value
        if (inputValue === '') {
            inputValue = '0'
        }
        let numValue = parseInt(inputValue)
        inputValue = numValue.toString()
        if (numValue > 200) {
            inputValue = '200'
            numValue = 200
        }
        setMarkerHoursManualInputValue(inputValue)
        setMarkerHoursSliderValue(numValue)
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
        let inputValue = event.target.value
        if (inputValue === '') {
            inputValue = '0'
        }
        let numValue = parseInt(inputValue)
        inputValue = numValue.toString()
        if (numValue > 200) {
            inputValue = '200'
            numValue = 200
        }
        setMarkerManualInputValue(inputValue)
        setMarkerSliderValue(numValue)
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

        console.log('Submitting form with updated data:', formData)
        try {
            const response = await fetch(`/api/courses/${courseId}`, {
                method: 'PATCH', // Use PATCH since your endpoint is using PATCH
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (!response.ok) {
                // Handle server-side error
                console.error('Error:', data.statusText)
                setSnackbarMessage(
                    data.statusText || 'Failed to update course.'
                )
                setSnackbarSeverity('error')
                setOpenSnackbar(true)
                return
            }

            // Handle success
            console.log('Course updated:', data)
            setSnackbarMessage('Course successfully updated!')
            setSnackbarSeverity('success')
            setOpenSnackbar(true)
            setIsSaved(true)
            setIsEditing(false)
        } catch (error) {
            // Handle network or other unknown errors
            console.error('Error:', error)
            setSnackbarMessage('Failed to update course.')
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
                    Edit Course Details
                </Typography>
                <Grid container spacing={3} justifyContent="center">
                    <Grid item>
                        <TextField
                            label="Course Code"
                            variant="outlined"
                            style={{ width: '350px' }}
                            value={courseCode}
                            onChange={(e) => setCourseCode(e.target.value)}
                            disabled={!isEditing}
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
                            disabled={!isEditing}
                        />
                    </Grid>
                    <Grid item>
                        <FormControl
                            fullWidth
                            style={{ width: '350px' }}
                            disabled={!isEditing}
                        >
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
                        <FormControl
                            fullWidth
                            style={{ width: '350px' }}
                            disabled={!isEditing}
                        >
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
                                    onChange={
                                        isEditing
                                            ? handleSliderChange
                                            : undefined
                                    }
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
                                                disabled={!isEditing}
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
                                    onChange={
                                        isEditing
                                            ? handleEnrolledSliderChange
                                            : undefined
                                    }
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
                                                disabled={!isEditing}
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
                                    onChange={
                                        isEditing
                                            ? handleMarkerHoursSliderChange
                                            : undefined
                                    }
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
                                                disabled={!isEditing}
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
                                    onChange={
                                        isEditing
                                            ? handleMarkerSliderChange
                                            : undefined
                                    }
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
                                                disabled={!isEditing}
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
                                disabled={!isEditing}
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
                        {!isEditing ? (
                            // Not in editing mode
                            <>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        EDIT
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
                            </>
                        ) : (
                            // In editing mode
                            <>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleSubmit}
                                    >
                                        SAVE
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={
                                            isSaved
                                                ? handleCancel
                                                : revertChanges
                                        }
                                    >
                                        {isSaved ? 'BACK' : 'CANCEL'}
                                    </Button>
                                </Grid>
                            </>
                        )}
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
