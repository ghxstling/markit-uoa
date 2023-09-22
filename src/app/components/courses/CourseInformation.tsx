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
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Card } from '@mui/material'
import EditCourseDetails from './EditCourseDetails'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { CourseApplicationType } from '@/types/CourseApplicationType'
import Link from 'next/link'

type CourseInformationProps = {
    courseId: string // Assuming courseId is a string
}

const CourseInformation = ({ courseId }: CourseInformationProps) => {
    interface StudentData {
        //some array thing of applications + student name
    }

    const [studentData, setStudentData] = useState<StudentData[]>([])
    const [open, setOpen] = React.useState(false)
    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(5)
    const [courseName, setCourseName] = useState('')
    const [checkedStudents, setCheckedStudents] = useState<number[]>([])

    const emptyRows = page >= 0 ? Math.max(0, (1 + page) * rowsPerPage - studentData.length) : 0

    //fetch the applicants

    /*
    useEffect(() => {
        fetchStudentData()
    }, [])

    const fetchStudentData = async () => {
        try {
            const response = await fetch('url to get applciants', { method: 'GET' })
            const jsonData = await response.json()
            setStudentData(jsonData)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }
    */

    //fetch the course name
    useEffect(() => {
        fetchCourseName()
    }, [])

    const fetchCourseName = async () => {
        try {
            const response = await fetch('/api/courses', { method: 'GET' })
            const jsonData = await response.json()
            setCourseName(jsonData.filter((course: any) => course.id == courseId)[0].courseCode)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    //fetch checked students
    /*
    useEffect(() => {
        fetchCheckedStudents()
    }, [])

    const fetchCheckedStudents = async () => {
        try {
            const response = await fetch('url to fetch checked students', { method: 'GET' })
            const jsonData = await response.json()
            setChecked(jsonData)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }
    */

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

    const handleCheckedStudents = (studentId: number) => {
        if (checkedStudents.includes(studentId)) {
            setCheckedStudents(checkedStudents.filter((id) => id !== studentId))
        } else {
            setCheckedStudents([...checkedStudents, studentId])
        }
    }

    const handleMarkerSubmit = () => {
        if (checkedStudents.length === 0) {
            //no students selected error
            return
        }

        const payload = {
            students: checkedStudents,
        }

        fetch('url for submitting checked students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then((response) => {
                if (response.ok) {
                    console.log('Students submitted successfully')
                } else {
                    console.log('Failed to submit students')
                }
            })
            .catch((error) => {
                console.log('Error submitting students:', error)
            })
    }
    return (
        <>
            <Card sx={{ p: '20px' }}>
                <Box display="flex">
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
                </Box>

                <Table sx={{ mt: 4 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ textAlign: 'center', width: '130px' }}>
                                <div style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                                    Select Markers
                                    <Tooltip title="Click on checkboxes to assign markers">
                                        <InfoOutlinedIcon style={{ marginLeft: 5, verticalAlign: 'middle' }} />
                                    </Tooltip>
                                </div>
                            </TableCell>
                            <TableCell style={{ textAlign: 'center', width: '130px' }}>
                                <div style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                                    Applicant
                                    <Tooltip title="Click on student name to view student information">
                                        <InfoOutlinedIcon style={{ marginLeft: 5, verticalAlign: 'middle' }} />
                                    </Tooltip>
                                    {/*TODO Sort feature<ArrowDownwardIcon style={{marginLeft:5, verticalAlign:"middle"}}/>*/}
                                </div>
                            </TableCell>
                            <TableCell style={{ textAlign: 'center', width: '130px' }}>
                                <div style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                                    Grade
                                    {/*TODO Sort feature<ArrowDownwardIcon style={{marginLeft:5, verticalAlign:"middle"}}/>*/}
                                </div>
                            </TableCell>
                            <TableCell style={{ textAlign: 'center', width: '130px' }}>
                                <div style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                                    Marked Before
                                    <Tooltip title="Has the student marked the course before">
                                        <InfoOutlinedIcon style={{ marginLeft: 5, verticalAlign: 'middle' }} />
                                    </Tooltip>
                                    {/*TODO Sort feature<ArrowDownwardIcon style={{marginLeft:5, verticalAlign:"middle"}}/>*/}
                                </div>
                            </TableCell>
                            <TableCell style={{ textAlign: 'center', width: '130px' }}>
                                <div style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                                    Overseas
                                    <Tooltip title="Is the student overseas">
                                        <InfoOutlinedIcon style={{ marginLeft: 5, verticalAlign: 'middle' }} />
                                    </Tooltip>
                                    {/*TODO Sort feature<ArrowDownwardIcon style={{marginLeft:5, verticalAlign:"middle"}}/>*/}
                                </div>
                            </TableCell>
                            <TableCell style={{ textAlign: 'center', width: '130px' }}>
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
                        {/*(rowsPerPage > 0
                            ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : data
                        ).map((student, index) => (
                            <TableRow key={student.id}>
                                <TableCell padding="checkbox" style={{ textAlign: 'center' }}>
                                    <Checkbox 
                                        checked={checkedStudents.includes(student.id) || false}
                                        onChange={() => handleCheckedStudents(student.id)}
                                    />
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                    <Link href="src/app/dashboard/students/[studentId]/page.tsx" as={`/dashboard/students/${student.id}`} passHref>
                                        <Button>{function that returns name based on user id}</Button>
                                    </Link>
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>{get grade}</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>{get has marked course}</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>{student.overseas}</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                    <Button variant="contained" sx={{ backgroundColor: 'green' }}>
                                    {qualified/unqualified}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))*/}

                        <TableRow>
                            <TableCell padding="checkbox" style={{ textAlign: 'center' }}>
                                <Checkbox />
                            </TableCell>
                            <TableCell style={{ textAlign: 'center' }}>
                                <Button>Marwa Yang</Button>
                            </TableCell>
                            <TableCell style={{ textAlign: 'center' }}>A</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>Yes</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>No</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>
                                <Button variant="contained" sx={{ backgroundColor: 'green' }}>
                                    Qualified
                                </Button>
                            </TableCell>
                        </TableRow>

                        {emptyRows > 0 && (
                            <TableRow style={{ height: 69.5 * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <TableFooter>
                    <TableRow>
                        <TableCell sx={{ width: '324px' }} colSpan={2}>
                            <Button
                                variant="contained"
                                sx={{ backgroundColor: '#01579B' }}
                                onClick={handleMarkerSubmit}
                            >
                                Submit Marker Assignment
                            </Button>
                        </TableCell>
                        <TableCell sx={{ width: '324px' }} colSpan={2}>
                            <Button variant="contained" sx={{ backgroundColor: '#01579B' }}>
                                Assign Marker Hours
                            </Button>
                        </TableCell>
                        <TableCell sx={{ width: '600px' }} colSpan={4}>
                            <TablePagination
                                component="div"
                                sx={{ width: '100%' }}
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={3}
                                count={studentData.length}
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
            </Card>
            <Dialog open={open} onClose={closeDialog} maxWidth="md" fullWidth>
                <EditCourseDetails courseId={courseId} />
            </Dialog>
        </>
    )
}

export default CourseInformation
