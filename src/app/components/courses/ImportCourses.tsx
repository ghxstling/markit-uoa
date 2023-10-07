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
} from '@mui/material'

type Course = {
    semester: string
    // add other properties as needed
}

export default function ImportCourses() {
    const [courses, setCourses] = useState<Course[]>([])
    const [sourceSemester, setSourceSemester] = useState<string>('')
    const [targetSemester, setTargetSemester] = useState<string>('')
    const [openDialog, setOpenDialog] = useState(false)

    useEffect(() => {
        fetch('/api/courses')
            .then((res) => res.json())
            .then((data) => setCourses(data))
            .catch((error) => console.error('Error fetching courses:', error))
    }, [])

    const getAllSemesters = (): string[] => {
        return courses.map((course) => course.semester).filter((value, index, self) => self.indexOf(value) === index)
    }

    const handleImport = () => {
        const coursesToDuplicate = courses.filter((course) => course.semester === sourceSemester)

        const duplicatedCourses = coursesToDuplicate.map((course) => ({
            ...course,
            semester: targetSemester,
        }))

        fetch('/api/courses/bulk-insert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(duplicatedCourses),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Server responded with an error')
                }
                return response.json()
            })
            .then((data) => {
                alert('Courses imported successfully!')
            })
            .catch((error) => console.error('Error duplicating courses:', error))

        setOpenDialog(false)
    }

    return (
        <Container>
            <Typography variant="h4">Import Courses</Typography>

            <Box mt={3}>
                <Select
                    value={sourceSemester}
                    onChange={(e) => setSourceSemester(e.target.value as string)}
                    displayEmpty
                    placeholder="Select Source Semester"
                >
                    {getAllSemesters().map((semester) => (
                        <MenuItem key={semester} value={semester}>
                            {semester}
                        </MenuItem>
                    ))}
                </Select>
            </Box>

            <Box mt={3}>
                <Select
                    value={targetSemester}
                    onChange={(e) => setTargetSemester(e.target.value as string)}
                    displayEmpty
                    placeholder="Select Target Semester"
                >
                    {getAllSemesters().map((semester) => (
                        <MenuItem key={semester} value={semester}>
                            {semester}
                        </MenuItem>
                    ))}
                </Select>
            </Box>

            <Box mt={3}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenDialog(true)}
                    disabled={!sourceSemester || !targetSemester || sourceSemester === targetSemester}
                >
                    Import
                </Button>
            </Box>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Confirm Import</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to import all courses from {sourceSemester} to {targetSemester}? You can
                        delete any unneeded courses later.
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
        </Container>
    )
}
