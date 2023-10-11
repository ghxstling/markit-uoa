import {
    Box,
    Typography,
    Button,
    Dialog,
    Table,
    TableHead,
    TableRow,
    TableCell,
    Tooltip,
    TableBody,
    TablePagination,
    TableFooter,
    Checkbox,
    Chip,
    TableContainer,
    Drawer,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Card } from '@mui/material'
import EditCourseDetails from './EditCourseDetails'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { CourseApplicationType } from '@/types/CourseApplicationType'
import ViewStudentInformation from '../StudentInformation'

type CourseInformationProps = {
    courseId: string // Assuming courseId is a string
}

const CourseInformation = ({ courseId }: CourseInformationProps) => {
    interface User {
        id: number
        name: string
    }

    interface Student {
        id: number
        overseas: boolean
        upi: string
        maxWorkHours: number
        userId: number
    }

    interface ApplicantsData {
        id: number
        hasMarkedCourse: boolean
        previouslyAchievedGrade: string
        studentId: number
        courseId: number
        isQualified: boolean
        applicationStatus: string
        student: Student
        allocatedHours: number
    }

    interface Course {
        markersNeeded: number
        markerHours: number
    }

    interface CourseData {
        markers: ApplicantsData[]
        hours: number
    }

    const [studentData, setStudentData] = useState<Student[]>([])
    const [applications, setApplications] = useState<ApplicantsData[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [open, setOpen] = React.useState(false)
    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(5)
    const [courseName, setCourseName] = useState('')
    const [markersNeeded, setMarkersNeeded] = useState(0)
    const [markerHoursNeeded, setMarkerHoursNeeded] = useState(0)
    const [checkedStudents, setCheckedStudents] = useState<number[]>([])
    const [selected, setSelected] = useState(new Array(applications.length).fill(false))
    const [approvedStudents, setApprovedStudents] = useState<ApplicantsData[]>([])
    const [courseData, setCourseData] = useState<CourseData>()
    const [course, setCourse] = useState<Course>()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    const emptyRows = page >= 0 ? Math.max(0, (1 + page) * rowsPerPage - studentData.length) : 0

    //fetch the course name
    useEffect(() => {
        fetchCourseInfo()
    }, [])

    const fetchCourseInfo = async () => {
        try {
            const response = await fetch('/api/courses', { method: 'GET' })
            const jsonData = await response.json()
            setCourseName(jsonData.filter((course: any) => course.id == courseId)[0].courseCode)
            setMarkersNeeded(jsonData.filter((course: any) => course.id == courseId)[0].markersNeeded)
            setMarkerHoursNeeded(jsonData.filter((course: any) => course.id == courseId)[0].markerHours)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    //fetch applicants
    useEffect(() => {
        fetchApplicants()
    }, [])

    const fetchApplicants = async () => {
        try {
            const response = await fetch(`/api/courses/${courseId}/applications`, {
                method: 'GET',
            })
            const jsonData = await response.json()
            if (jsonData.length !== 0) {
                setApplications(jsonData)
            }
            setSelected((prevSelected) => {
                let newSelected = new Array(jsonData.length).fill(false)
                setQualified(jsonData, newSelected)
                return newSelected
            })
            jsonData.sort((a: { applicationStatus: string }, b: { applicationStatus: string }) => {
                if (a.applicationStatus === 'approved' && b.applicationStatus !== 'approved') {
                    return -1 // "approved" comes first
                } else if (a.applicationStatus !== 'approved' && b.applicationStatus === 'approved') {
                    return 1 // "approved" comes first
                } else if (a.applicationStatus === 'pending' && b.applicationStatus !== 'pending') {
                    return -1 // "pending" comes next
                } else if (a.applicationStatus !== 'pending' && b.applicationStatus === 'pending') {
                    return 1 // "pending" comes next
                } else {
                    // For other statuses, "denied" comes last
                    return a.applicationStatus.localeCompare(b.applicationStatus)
                }
            })
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    const setQualified = (applications: any[], newSelected: any[]) => {
        for (let i = 0; i < newSelected.length; i++) {
            newSelected[i] = applications[i].isQualified
        }
        setSelected(newSelected)
    }

    const handleQualifiedChange = async (index: number) => {
        //get application that is being changed
        const changedApplication = applications[index]
        const studentUpi = studentData.find((student) => student.id === changedApplication.studentId)?.upi
        //patch changed application
        try {
            const response = await fetch(`/api/students/${studentUpi}/applications/${changedApplication.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(changedApplication),
            })
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    //fetch all students
    useEffect(() => {
        fetchStudents()
    }, [])

    const fetchStudents = async () => {
        try {
            const response = await fetch('/api/students', {
                method: 'GET',
            })
            const jsonData = await response.json()
            setStudentData(jsonData)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    //fetch all users
    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users', {
                method: 'GET',
            })
            const jsonData = await response.json()
            setUsers(jsonData)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    const openEdit = () => {
        setOpen(true)
    }

    const closeDialog = () => {
        setOpen(false)
    }

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const handleDrawerOpen = () => {
        setIsDrawerOpen(true)
    }

    const handleDrawerClose = () => {
        setIsDrawerOpen(false)
    }
    const getApplicationIndex = (application: any) => {
        return applications.indexOf(application)
    }

    const handleCheckedStudents = (studentId: number) => {
        // Check if the studentId is already in the checkedStudents array
        if (checkedStudents.includes(studentId)) {
            // Remove the studentId from the checkedStudents array
            setCheckedStudents(checkedStudents.filter((id) => id !== studentId))

            // Remove the corresponding Application from the approvedStudents array
            setApprovedStudents((prevApprovedStudents) =>
                prevApprovedStudents.filter((application) => application.studentId !== studentId)
            )
        } else {
            // Add the studentId to the checkedStudents array`
            setCheckedStudents([...checkedStudents, studentId])

            // Find the Application for the selected studentId
            const selectedApplication = applications.find((application) => application.studentId === studentId)
            console.log(selectedApplication)

            // Add the selected Application to the approvedStudents array
            if (selectedApplication) {
                setApprovedStudents((prevApprovedStudents) => [...prevApprovedStudents, selectedApplication])
            }
        }
    }

    const handleMarkerSubmit = async () => {
        if (checkedStudents.length === 0) {
            // No students selected error
            return
        }

        const payload = {
            students: approvedStudents,
        }
        try {
            const response = await fetch('/api/courses/' + courseId + '/markers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(approvedStudents),
            })

            // Parse the response JSON
            const data = await response.json()

            if (response.ok) {
                console.log('Students submitted successfully')
                setCheckedStudents([])
                setApprovedStudents([])
                fetchApplicants()
                courseInformation()
                retrieveCourseData()
            } else {
                console.log('Failed to submit students:', data.message) // Log the error message from the server
            }
        } catch (error) {
            // Handle network or other unknown errors
            console.log('Error submitting students:', error)
        }
    }

    useEffect(() => {
        courseInformation()
    }, [])

    const courseInformation = async () => {
        try {
            const response = await fetch('/api/courses/' + courseId + '/markers', { method: 'GET' })
            const jsonData = await response.json()
            setCourseData(jsonData)
            console.log(courseData?.hours)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    useEffect(() => {
        retrieveCourseData()
    }, [])

    const retrieveCourseData = async () => {
        try {
            const response = await fetch('/api/courses/' + courseId, { method: 'GET' })
            const jsonData = await response.json()
            setCourse(jsonData)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    return (
        <>
            <Card sx={{ p: '20px' }}>
                <Box display="flex" alignItems="center">
                    <Typography variant="h5" fontWeight="bold">
                        {courseName}
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{ ml: '20px', backgroundColor: '#01579B' }}
                        size="small"
                        onClick={openEdit}
                    >
                        Edit Course
                    </Button>

                    <TableContainer sx={{ width: '60%', border: '2px solid black', ml: 11, borderRadius: 2.5 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Markers Needed: {course?.markersNeeded}</TableCell>
                                    <TableCell>
                                        Markers Assigned: {courseData?.markers ? courseData?.markers.length : 0}
                                    </TableCell>
                                    <TableCell>Hours Needed: {course?.markerHours || 0}</TableCell>
                                    <TableCell>Hours Assigned: {courseData?.hours || 0}</TableCell>
                                </TableRow>
                            </TableHead>
                        </Table>
                    </TableContainer>
                </Box>
                <TableContainer>
                    <Table sx={{ mt: 4 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ textAlign: 'center', width: '150px' }}>
                                    <div style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                                        Select
                                        <Tooltip title="Click on checkboxes to assign markers">
                                            <InfoOutlinedIcon style={{ marginLeft: 5, verticalAlign: 'middle' }} />
                                        </Tooltip>
                                    </div>
                                </TableCell>
                                <TableCell style={{ textAlign: 'center', width: '200px' }}>
                                    <div style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                                        Applicant
                                        <Tooltip title="Click on student name to view student information">
                                            <InfoOutlinedIcon style={{ marginLeft: 5, verticalAlign: 'middle' }} />
                                        </Tooltip>
                                        {/*TODO Sort feature<ArrowDownwardIcon style={{marginLeft:5, verticalAlign:"middle"}}/>*/}
                                    </div>
                                </TableCell>
                                <TableCell style={{ textAlign: 'center', width: '50px' }}>
                                    <div style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                                        Grade
                                        {/*TODO Sort feature<ArrowDownwardIcon style={{marginLeft:5, verticalAlign:"middle"}}/>*/}
                                    </div>
                                </TableCell>
                                <TableCell style={{ textAlign: 'center', width: '250px' }}>
                                    <div style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                                        Marked Before
                                        <Tooltip title="Has the student marked the course before">
                                            <InfoOutlinedIcon style={{ marginLeft: 5, verticalAlign: 'middle' }} />
                                        </Tooltip>
                                        {/*TODO Sort feature<ArrowDownwardIcon style={{marginLeft:5, verticalAlign:"middle"}}/>*/}
                                    </div>
                                </TableCell>
                                <TableCell style={{ textAlign: 'center', width: '150px' }}>
                                    <div style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                                        Overseas
                                        <Tooltip title="Is the student overseas">
                                            <InfoOutlinedIcon style={{ marginLeft: 5, verticalAlign: 'middle' }} />
                                        </Tooltip>
                                        {/*TODO Sort feature<ArrowDownwardIcon style={{marginLeft:5, verticalAlign:"middle"}}/>*/}
                                    </div>
                                </TableCell>
                                <TableCell style={{ textAlign: 'center', width: '200px' }}>
                                    <div style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                                        Total Allocated Hours
                                        <Tooltip title="Total hours allocated to student across all courses">
                                            <InfoOutlinedIcon style={{ marginLeft: 5, verticalAlign: 'middle' }} />
                                        </Tooltip>
                                        {/*TODO Sort feature<ArrowDownwardIcon style={{marginLeft:5, verticalAlign:"middle"}}/>*/}
                                    </div>
                                </TableCell>
                                <TableCell style={{ textAlign: 'center', width: '200px' }}>
                                    <div style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                                        Maximum Hours Per Week
                                        <Tooltip title="Maximum hours student willing to work per week">
                                            <InfoOutlinedIcon style={{ marginLeft: 5, verticalAlign: 'middle' }} />
                                        </Tooltip>
                                        {/*TODO Sort feature<ArrowDownwardIcon style={{marginLeft:5, verticalAlign:"middle"}}/>*/}
                                    </div>
                                </TableCell>
                                <TableCell style={{ textAlign: 'center', width: '150px' }}>
                                    <div style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                                        Qualification
                                        <Tooltip title="Is the student qualified to mark the course">
                                            <InfoOutlinedIcon style={{ marginLeft: 5, verticalAlign: 'middle' }} />
                                        </Tooltip>
                                        {/*TODO Sort feature<ArrowDownwardIcon style={{marginLeft:5, verticalAlign:"middle"}}/>*/}
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(rowsPerPage > 0
                                ? applications.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : applications
                            ).map((application) => (
                                <TableRow
                                    key={application.id}
                                    style={{
                                        backgroundColor:
                                            application.applicationStatus === 'denied'
                                                ? 'rgba(255, 0, 0, 0.25)'
                                                : application.applicationStatus === 'approved'
                                                ? 'rgba(0, 128, 0, 0.25)'
                                                : 'transparent',
                                    }}
                                >
                                    <TableCell padding="checkbox" style={{ textAlign: 'center' }}>
                                        <Checkbox
                                            checked={checkedStudents.includes(application.studentId) || false}
                                            onChange={() => handleCheckedStudents(application.studentId)}
                                            disabled={application.applicationStatus === 'approved'}
                                        />
                                    </TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>
                                        <Button onClick={handleDrawerOpen}>
                                            {
                                                users.find(
                                                    (user) =>
                                                        user.id ===
                                                        studentData.find(
                                                            (student) => student.id === application.studentId
                                                        )?.userId
                                                )?.name
                                            }{' '}
                                            ({studentData.find((student) => student.id === application.studentId)?.upi})
                                        </Button>
                                        <Drawer
                                            anchor="right"
                                            open={isDrawerOpen}
                                            onClose={handleDrawerClose}
                                            ModalProps={{
                                                slotProps: {
                                                    backdrop: {
                                                        style: {
                                                            backgroundColor: 'rgba(0, 0, 0, 0.25)',
                                                        },
                                                    },
                                                },
                                            }}
                                        >
                                            <ViewStudentInformation
                                                studentUpi={
                                                    studentData.find((student) => student.id === application.studentId)
                                                        ?.upi
                                                }
                                            />
                                        </Drawer>
                                    </TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>
                                        {application.previouslyAchievedGrade}
                                    </TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>
                                        {String(application.hasMarkedCourse)}
                                    </TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>
                                        {String(
                                            studentData.find((student) => student.id === application.studentId)
                                                ?.overseas
                                        )}
                                    </TableCell>
                                    <TableCell style={{ textAlign: 'center' }}> {application.allocatedHours}</TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>
                                        {
                                            studentData.find((student) => student.id === application.studentId)
                                                ?.maxWorkHours
                                        }
                                    </TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>
                                        <Chip
                                            onClick={() => {
                                                const index = getApplicationIndex(application)
                                                let newSelected = [...selected]
                                                newSelected[index] = !newSelected[index]
                                                applications[index].isQualified = newSelected[index]
                                                handleQualifiedChange(index)
                                                setSelected(newSelected)
                                                return newSelected
                                            }}
                                            color={selected[getApplicationIndex(application)] ? 'primary' : 'secondary'}
                                            label={
                                                selected[getApplicationIndex(application)] ? 'Qualified' : 'Unqualified'
                                            }
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 69.5 * emptyRows }}>
                                    <TableCell colSpan={8} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <TableFooter>
                        <TableRow>
                            <TableCell sx={{ width: '600px' }} colSpan={4}>
                                <Button
                                    variant="contained"
                                    sx={{ backgroundColor: '#01579B' }}
                                    onClick={handleMarkerSubmit}
                                >
                                    Submit Marker Assignment
                                </Button>
                            </TableCell>
                            <TableCell sx={{ width: '600px' }} colSpan={4}>
                                <TablePagination
                                    component="div"
                                    sx={{ width: '100%' }}
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                    colSpan={3}
                                    count={applications.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    showFirstButton={true}
                                    showLastButton={true}
                                />
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </TableContainer>
            </Card>
            <Dialog open={open} onClose={closeDialog} maxWidth="md" fullWidth>
                <EditCourseDetails courseId={courseId} />
            </Dialog>
        </>
    )
}

export default CourseInformation
