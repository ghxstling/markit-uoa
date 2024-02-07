import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import {
    TableBody,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    Container,
    Typography,
    Box,
    Button,
    Snackbar,
    Alert,
    Dialog,
    Grid,
} from '@mui/material'

export default function ChangePreferenceOrder({
    open,
    setOpen,
}: {
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
}) {
    interface Application {
        id: number
        preferenceId: number
        courseId: number
    }

    interface Courses {
        id: number
        courseCode: string
        semester: string
    }

    const [applications, setApplications] = useState<Application[]>([])
    const [courseInfo, setCourseInfo] = useState<Courses[]>([])
    const [openSnackBarSuccess, setOpenSnackBarSuccess] = useState(false)
    const [openSnackBarFailure, setOpenSnackBarFailure] = useState(false)
    const [snackbarSuccessMessage, setSnackbarSuccessMessage] = useState('New preferences submitted successfully!')
    const [snackbarFailureMessage, setSnackbarFailureMessage] = useState(
        'Failure submitting new preferences, please try again later.'
    )

    const handleCloseFailure = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }

        setOpenSnackBarFailure(false)
    }

    const handleCloseSuccess = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }
        setOpenSnackBarSuccess(false)
    }

    useEffect(() => {
        fetchApplications()
    }, [])

    const fetchApplications = async () => {
        try {
            const response = await fetch('/api/students/me/applications')
            let jsonData = await response.json()
            jsonData = jsonData.sort((a: Application, b: Application) => a.preferenceId - b.preferenceId)
            if (response.ok) {
                setApplications(jsonData)
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    useEffect(() => {
        fetchCourseInfo()
    }, [])

    const fetchCourseInfo = async () => {
        try {
            const response = await fetch('/api/courses', { method: 'GET' })
            let jsonData = await response.json()
            if (response.ok) {
                setCourseInfo(jsonData)
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    const handleOnDragEnd = (result: any) => {
        if (!result.destination) return

        const items = Array.from(applications)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)

        setApplications(items.map((item, index) => ({ ...item, preferenceId: index + 1 })))
    }

    const submitPreferences = async () => {
        const currentPreferences = [...applications]
        handlePreferenceUpdate(currentPreferences)
        fetchApplications()
    }

    const handlePreferenceUpdate = async (applications: Application[]) => {
        try {
            const response = await fetch(`/api/students/me/applications`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(applications),
            })
            if (response.ok) {
                setOpenSnackBarSuccess(true)
            } else {
                setOpenSnackBarFailure(true)
            }
        } catch (error) {
            console.error('Error updating data:', error)
        }
    }

    const handleDialogClose = () => {
        setOpen(false)
    }

    return (
        <Dialog open={open} onClose={handleDialogClose} maxWidth="sm" fullWidth>
            <Container style={{ marginTop: 20 }}>
                <Paper elevation={3} style={{ padding: '20px' }}>
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <Typography variant="h4" fontWeight={600} style={{ marginBottom: '20px', fontSize: '1.5rem' }}>
                            Manage Application Preference Order
                        </Typography>
                    </Box>
                    <TableContainer component={Paper} sx={{ outline: 'lightgrey solid 0.1px', pb: '5px' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>
                                        Preference
                                    </TableCell>
                                    <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Course</TableCell>
                                    <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Semester</TableCell>
                                </TableRow>
                            </TableHead>
                            <DragDropContext onDragEnd={handleOnDragEnd}>
                                <Droppable droppableId="preferences">
                                    {(provided) => (
                                        <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                                            {applications.map((application, index) => (
                                                <Draggable
                                                    key={application.id}
                                                    draggableId={String(application.id)}
                                                    index={index}
                                                >
                                                    {(provided) => (
                                                        <TableRow
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            <TableCell style={{ textAlign: 'center' }}>
                                                                {application.preferenceId}
                                                            </TableCell>
                                                            <TableCell style={{ textAlign: 'center' }}>
                                                                {
                                                                    courseInfo.find(
                                                                        (course) => course.id === application.courseId
                                                                    )?.courseCode
                                                                }
                                                            </TableCell>
                                                            <TableCell style={{ textAlign: 'center' }}>
                                                                {
                                                                    courseInfo.find(
                                                                        (course) => course.id === application.courseId
                                                                    )?.semester
                                                                }
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </TableBody>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </Table>
                    </TableContainer>
                </Paper>
                <Grid container spacing={3} sx={{ pt: 3, pb: 3, justifyContent: 'end' }}>
                    <Grid item>
                        <Button variant="text" onClick={handleDialogClose}>
                            Close
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" onClick={submitPreferences}>
                            Submit
                        </Button>
                    </Grid>
                </Grid>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    open={openSnackBarFailure}
                    autoHideDuration={6000}
                    onClose={handleCloseFailure}
                >
                    <Alert onClose={handleCloseFailure} severity="error" sx={{ width: '100%' }}>
                        {snackbarFailureMessage}
                    </Alert>
                </Snackbar>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    open={openSnackBarSuccess}
                    autoHideDuration={6000}
                    onClose={handleCloseSuccess}
                >
                    <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
                        {snackbarSuccessMessage}
                    </Alert>
                </Snackbar>
            </Container>
        </Dialog>
    )
}
