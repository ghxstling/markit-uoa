import React, { useEffect, useState } from 'react'
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
} from '@mui/material'

export default function ChangePreferenceOrder() {
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
            const jsonData = await response.json()
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
        currentPreferences.forEach((application: Application) => handlePreferenceUpdate(application))
        fetchCourseInfo()
    }

    const handlePreferenceUpdate = async (application: Application) => {
        try {
            const response = await fetch(`/api/students/me/applications/${application.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(application),
            })
        } catch (error) {
            console.error('Error updating data:', error)
        }
    }

    return (
        <Container style={{ marginTop: 20 }}>
            <Paper elevation={3} style={{ padding: '20px' }}>
                <Box display="flex" justifyContent="center" alignItems="center">
                    <Typography variant="h4" fontWeight={600} style={{ marginBottom: '20px', fontSize: '1.8rem' }}>
                        Manage Application Order of Preference
                    </Typography>
                </Box>
                <TableContainer component={Paper} style={{ marginTop: 20 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Preference</TableCell>
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
            <Box display="flex" justifyContent="flex-start">
                <Button variant="outlined" color="primary" sx={{ mt: 3 }} onClick={submitPreferences}>
                    Submit New Preferences
                </Button>
            </Box>
        </Container>
    )
}
