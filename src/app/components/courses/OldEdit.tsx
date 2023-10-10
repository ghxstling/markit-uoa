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
    TextField,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type EditCourseDetailsProps = {
    courseId: string // Assuming courseId is a string
}

export default function EditCourseDetails({ courseId }: EditCourseDetailsProps) {
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

    const [isEditing, setIsEditing] = useState(true)
    const [isSaved, setIsSaved] = useState(false)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

    const originalCourseDataRef = React.useRef<OriginalCourseData | null>(null)

    const revertChanges = () => {
        const originalData = originalCourseDataRef.current

        if (originalData) {
            setCourseCode(originalData.courseCode)
            setCourseDescription(originalData.courseDescription)
            setSelectedYear(originalData.selectedYear)
            setSelectedSemester(originalData.selectedSemester)
            setEstimatedStudents({
                slider: originalData.estimatedStudents,
                manual: originalData.estimatedStudents.toString(),
            })
            setEnrolledStudents({
                slider: originalData.enrolledStudents,
                manual: originalData.enrolledStudents.toString(),
            })
            setMarkerHours({ slider: originalData.markerHours, manual: originalData.markerHours.toString() })
            setMarkersNeeded({ slider: originalData.markersNeeded, manual: originalData.markersNeeded.toString() })
            setDescription(originalData.description)

            setIsEditing(false)
        }
    }

    type OriginalCourseData = {
        courseCode: string
        courseDescription: string
        selectedYear: number
        selectedSemester: string
        estimatedStudents: number
        enrolledStudents: number
        markerHours: number
        markersNeeded: number
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
                courseCode: course.courseCode.substring(8),
                courseDescription: course.courseDescription,
                selectedYear: parseInt(course.semester.substring(0, 4)),
                selectedSemester: course.semester.substring(4),
                estimatedStudents: course.numOfEstimatedStudents,
                enrolledStudents: course.numOfEnrolledStudents,
                markerHours: course.markerHours,
                markersNeeded: course.markersNeeded,
                description: course.markerResponsibilities,
            }

            setCourseCode(course.courseCode.substring(8))
            setCourseDescription(course.courseDescription)
            const year = parseInt(course.semester.substring(0, 4))
            const semester = course.semester.substring(4)
            setSelectedYear(year)
            setSelectedSemester(semester)
            setEstimatedStudents({
                slider: course.numOfEstimatedStudents,
                manual: course.numOfEstimatedStudents.toString(),
            })
            setEnrolledStudents({
                slider: course.numOfEnrolledStudents,
                manual: course.numOfEnrolledStudents.toString(),
            })
            setMarkerHours({ slider: course.markerHours, manual: course.markerHours.toString() })
            setMarkersNeeded({ slider: course.markersNeeded, manual: course.markersNeeded.toString() })
            setDescription(course.markerResponsibilities)
            const wordCount = course.markerResponsibilities.split(/\s+/).filter(Boolean).length
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
                    setSnackbarMessage(data.statusText || 'Failed to fetch course details.')
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
        //Test to check submission
        //console.log('Submitting form with updated data:', formData)
        try {
            const response = await fetch(`/api/courses/${courseId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (!response.ok) {
                // Handle server-side error
                console.error('Error:', data.statusText)
                setSnackbarMessage(data.statusText || 'Failed to update course.')
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
        router.push('/dashboard/')
    }

    const handleOpenDeleteDialog = () => {
        setOpenDeleteDialog(true)
    }

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false)
    }

    const handleDeleteCourse = () => {
        // For now, just logging the delete action
        console.log('Course deleted!')

        // Close the delete confirmation dialog
        handleCloseDeleteDialog()
    }

    return (
        <Container maxWidth="sm" style={{ marginTop: '2em' }}>
            <Paper elevation={3} style={{ padding: '2em' }}>
                <Typography variant="h4" gutterBottom align="center" style={{ fontWeight: 700 }}>
                    Edit Course Details
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
                                    disabled={!isEditing}
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
                            disabled={!isEditing}
                        />
                    </Grid>
                    <Grid item>
                        <FormControl fullWidth style={{ width: '350px' }} disabled={!isEditing}>
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
                        <FormControl fullWidth style={{ width: '350px' }} disabled={!isEditing}>
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
                                    disabled={!isEditing}
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
                                    disabled={!isEditing}
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
                                    disabled={!isEditing}
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
                                    disabled={!isEditing}
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
                                    disabled={!isEditing}
                                />
                                <FormHelperText>{`${wordCount}/100`}</FormHelperText>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid container item alignItems="center" spacing={1} style={{ marginTop: '1em' }}>
                        {!isEditing ? (
                            // Not in editing mode
                            <>
                                <Grid item>
                                    <Button variant="contained" color="primary" onClick={() => setIsEditing(true)}>
                                        EDIT
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button variant="outlined" color="primary" onClick={handleCancel}>
                                        BACK
                                    </Button>
                                </Grid>
                            </>
                        ) : (
                            // In editing mode
                            <>
                                <Grid item>
                                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                                        SAVE
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={isSaved ? handleCancel : revertChanges}
                                    >
                                        {isSaved ? 'BACK' : 'CANCEL'}
                                    </Button>
                                </Grid>
                            </>
                        )}
                        <Grid item>
                            <Button variant="contained" color="error" onClick={handleOpenDeleteDialog}>
                                DELETE COURSE
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

            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this course? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteCourse} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}
