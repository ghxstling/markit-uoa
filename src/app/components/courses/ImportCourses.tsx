import React, { useEffect, useState } from 'react'
import {
    Box,
    Button,
    Container,
    Typography,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    Snackbar,
    Alert,
    CircularProgress,
    InputLabel,
    FormControl,
    Paper,
} from '@mui/material'

type Course = {
    id: string
    semester: string
}

export default function ImportCourses() {
    const [courses, setCourses] = useState<Course[]>([])
    const [sourceSemester, setSourceSemester] = useState<string>('')
    const [targetSemester, setTargetSemester] = useState<string>('')
    const [openDialog, setOpenDialog] = useState(false)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        fetch('/api/courses')
            .then((res) => res.json())
            .then((data) => {
                setCourses(data)
                setIsLoading(false)
            })
            .catch((error) => {
                console.error('Error fetching courses:', error)
                setIsLoading(false)
                setSnackbarMessage('Failed to fetch courses.')
                setSnackbarSeverity('error')
                setSnackbarOpen(true)
            })
    }, [])

    const getAllSemesters = (): string[] => {
        return courses
            .map((course) => course.semester)
            .filter((value, index, self) => self.indexOf(value) === index)
            .sort()
    }

    const getTargetSemesters = (): string[] => {
        if (!sourceSemester) {
            return []
        }
        const { year, period } = parseSemester(sourceSemester)
        return [`${year + 1}${period}`, `${year + 2}${period}`]
    }

    const parseSemester = (semester: string): { year: number; period: string } => {
        const year = parseInt(semester.substring(0, 4), 10)
        const period = semester.substring(4)
        return { year, period }
    }

    const handleImport = () => {
        setIsLoading(true)
        // 1. Filter courses from the source semester
        const coursesToDuplicate = courses.filter((course) => course.semester === sourceSemester)

        // 2. Modify the semester property of each of those courses
        const duplicatedCourses = coursesToDuplicate.map((course) => {
            const { id, ...restOfCourse } = course // exclude id
            return {
                ...restOfCourse,
                semester: targetSemester,
            }
        })

        // 3. Send the duplicated courses to the server
        fetch('/api/courses/import', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(duplicatedCourses),
        })
            .then((response) => {
                if (response.status === 201) {
                    setSnackbarMessage('Courses successfully imported!')
                    setSnackbarSeverity('success')
                    setSnackbarOpen(true)
                    setIsLoading(false)
                } else {
                    return response.json().then((data) => {
                        throw new Error(data.error || 'Failed to import courses')
                    })
                }
            })

            .catch((error) => {
                console.error('Error importing courses:', error)
                setSnackbarMessage(error.message)
                setSnackbarSeverity('error')
                setSnackbarOpen(true)
                setIsLoading(false)
            })

        setOpenDialog(false)
    }

    return (
        <Container style={{ marginTop: 20, width: '100%' }}>
            <Paper elevation={3} style={{ padding: '20px' }}>
                <Typography variant="h4">Import Courses</Typography>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="source-semester-label">Source Semester</InputLabel>
                    <Select
                        labelId="source-semester-label"
                        value={sourceSemester}
                        label="Source Semester"
                        onChange={(e) => setSourceSemester(e.target.value as string)}
                        inputProps={{ id: 'source-semester' }}
                    >
                        {getAllSemesters().map((semester) => (
                            <MenuItem key={semester} value={semester}>
                                {semester}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="target-semester-label">Target Semester</InputLabel>
                    <Select
                        labelId="target-semester-label"
                        value={targetSemester}
                        label="Target Semester"
                        onChange={(e) => setTargetSemester(e.target.value as string)}
                        inputProps={{ id: 'target-semester' }}
                    >
                        {getTargetSemesters().map((semester) => (
                            <MenuItem key={semester} value={semester}>
                                {semester}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Box mt={3}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setOpenDialog(true)}
                        disabled={!sourceSemester || !targetSemester || sourceSemester === targetSemester}
                        fullWidth
                    >
                        Import
                    </Button>
                </Box>

                {isLoading && (
                    <Box display="flex" justifyContent="center" mt={3}>
                        <CircularProgress />
                    </Box>
                )}

                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>Confirm Import</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to import all courses from {sourceSemester} to {targetSemester}? You
                            can delete any unneeded courses later.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleImport} color="primary">
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={() => setSnackbarOpen(false)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                >
                    <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} variant="filled">
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Paper>
        </Container>
    )
}
