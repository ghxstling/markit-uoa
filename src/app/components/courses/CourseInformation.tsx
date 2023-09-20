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
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Card } from '@mui/material'
import Link from 'next/link'
import EditCourseDetails from './EditCourseDetails'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { CourseApplicationType } from '@/types/CourseApplicationType'

type CourseInformationProps = {
    courseId: string // Assuming courseId is a string
}

const CourseInformation = ({ courseId }: CourseInformationProps) => {
    interface Student {
        userId: number
        overseas: string
        application: CourseApplicationType[]
        qualification: string
    }

    const [data, setData] = useState<Student[]>([])
    const [open, setOpen] = React.useState(false)
    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(5)
    const [isCoordinator, setIsCoordinator] = useState(false)

    const emptyRows = page >= 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const response = await fetch('/api/student', { method: 'GET' })
            const jsonData = await response.json()
            setData(jsonData)
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
            <Card>
                <Box display="flex">
                    <Typography variant="h5">Course Name</Typography>
                    <Button variant="contained" sx={{ ml: '20px' }} size="small" onClick={openEdit}>
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
                        {(rowsPerPage > 0
                            ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : data
                        ).map((student, index) => (
                            <TableRow key={index}>
                                <TableCell style={{ textAlign: 'center' }}>
                                    {/*function that returns name based on user id*/}
                                    Student Name
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                    {/*(student.applications.filter((application: any) => application.courseId === courseId)).previouslyAchievedGrade*/}
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                    {/*(student.applications.filter((application: any) => application.courseId === courseId)).hasMarkedCourse ? 'Yes' : 'No'*/}
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>{/*student.overseas*/}</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                    {/*(student.applications.filter((application: any) => application.courseId === courseId)).isQualified ? 'Qualified' : 'Unqualified'*/}
                                </TableCell>
                            </TableRow>
                        ))}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 69.5 * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
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
            </Card>
            <Dialog open={open} onClose={closeDialog} maxWidth="md" fullWidth>
                <EditCourseDetails courseId={courseId} />
            </Dialog>
        </>
    )
}

export default CourseInformation
