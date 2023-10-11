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
    interface CoursePreference {
        id: number
        preferenceId: number
        courseId: number
    }

    interface Courses {
        id: number
        courseCode: string
        semester: string
    }

    const [preferences, setPreferences] = useState<CoursePreference[]>([])
    const [courseInfo, setCourseInfo] = useState<Courses[]>([])

    useEffect(() => {
        fetchApplications()
    }, [])

    const fetchApplications = async () => {
        try {
            const response = await fetch('/api/students/me/applications')
            const jsonData = await response.json()
            if (response.ok) {
                setPreferences(jsonData)
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

        const items = Array.from(preferences)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)

        setPreferences(items.map((item, index) => ({ ...item, preferenceId: index + 1 })))
    }

    const submitPreferences = () => {
        const currentPreferences = [...preferences]
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
                                        {preferences.map((preference, index) => (
                                            <Draggable
                                                key={preference.id}
                                                draggableId={String(preference.id)}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <TableRow
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <TableCell style={{ textAlign: 'center' }}>
                                                            {preference.preferenceId}
                                                        </TableCell>
                                                        <TableCell style={{ textAlign: 'center' }}>
                                                            {
                                                                courseInfo.find(
                                                                    (course) => course.id === preference.courseId
                                                                )?.courseCode
                                                            }
                                                        </TableCell>
                                                        <TableCell style={{ textAlign: 'center' }}>
                                                            {
                                                                courseInfo.find(
                                                                    (course) => course.id === preference.courseId
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
