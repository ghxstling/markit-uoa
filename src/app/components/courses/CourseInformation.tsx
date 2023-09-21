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

    const [data, setData] = useState<StudentData[]>([])
    const [open, setOpen] = React.useState(false)
    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(5)
    const [courseName, setCourseName] = useState('')

    const emptyRows = page >= 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0

    /* useEffect(() => {
        fetchStudentData()
    }, [])

    const fetchStudentData = async () => {
        try {
            const response = await fetch('/api/', { method: 'GET' })
            const jsonData = await response.json()
            setData(jsonData)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }*/

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

                <Table style={{ paddingTop: 40 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ textAlign: 'center' }}>
                                <div style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                                    Applicant
                                    {/*TODO Sort feature<ArrowDownwardIcon style={{marginLeft:5, verticalAlign:"middle"}}/>*/}
                                </div>
                            </TableCell>
                            <TableCell style={{ textAlign: 'center' }}>
                                <div style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                                    Grade
                                    {/*TODO Sort feature<ArrowDownwardIcon style={{marginLeft:5, verticalAlign:"middle"}}/>*/}
                                </div>
                            </TableCell>
                            <TableCell style={{ textAlign: 'center' }}>
                                <div style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                                    Marked Before
                                    <Tooltip title="Has the student marked the course before">
                                        <InfoOutlinedIcon style={{ marginLeft: 5, verticalAlign: 'middle' }} />
                                    </Tooltip>
                                    {/*TODO Sort feature<ArrowDownwardIcon style={{marginLeft:5, verticalAlign:"middle"}}/>*/}
                                </div>
                            </TableCell>
                            <TableCell style={{ textAlign: 'center' }}>
                                <div style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                                    Overseas
                                    <Tooltip title="Is the student overseas">
                                        <InfoOutlinedIcon style={{ marginLeft: 5, verticalAlign: 'middle' }} />
                                    </Tooltip>
                                    {/*TODO Sort feature<ArrowDownwardIcon style={{marginLeft:5, verticalAlign:"middle"}}/>*/}
                                </div>
                            </TableCell>
                            <TableCell style={{ textAlign: 'center' }}>
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
                            <TableRow key={index}>
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

                        {emptyRows > 0 && (
                            <TableRow style={{ height: 69.5 * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <TableFooter>
                    <TableRow>
                        <TableCell>
                            <Button variant="contained" sx={{ backgroundColor: '#01579B' }}>
                                Assign Markers
                            </Button>
                        </TableCell>
                        <TableCell>
                            <TablePagination
                                component="div"
                                sx={{ width: '100%' }}
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={3}
                                count={data.length}
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
