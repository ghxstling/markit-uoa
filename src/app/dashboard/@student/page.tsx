'use client'

import React, { useState, useEffect } from 'react'
import {
    Box,
    Button,
    Card,
    Table,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableBody,
    Typography,
    TablePagination,
    Chip,
} from '@mui/material'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Sidebar from '@/app/components/Sidebar'
import CustomTheme from '@/app/CustomTheme'
import { ThemeProvider } from '@mui/material/styles'

const StudentHomepage = () => {
    interface Courses {
        id: number
        courseCode: string
        semester: string
    }

    interface ApplicantsData {
        id: number
        applicationStatus: string
        courseId: number
        allocatedHours: number
    }

    //initialise use states
    const [rows, rowChange] = useState([])
    const [applications, setApplications] = useState<ApplicantsData[]>([])
    const [courses, setCourses] = useState<Courses[]>([])
    const [page, setPage] = useState(0)
    const [rowPerPage, setRowPerPage] = useState(5)

    //handle pagination
    const handPageChange = (event: unknown, newpage: any) => {
        setPage(newpage)
    }

    const handleRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    //fetch data
    useEffect(() => {
        fetchApplications()
    }, [])

    const fetchApplications = async () => {
        try {
            const response = await fetch('/api/students/me/applications')
            const jsonData = await response.json()
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
                setCourses(jsonData)
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    //initialise columns
    const columns = [
        { id: 'name', name: 'Course' },
        { id: 'email', name: 'Semester' },
        { id: 'website', name: 'Hours Assigned' },
        { id: 'applicationStatus', name: 'Status' },
    ]

    //get first name of user
    const { data: session } = useSession()

    let firstName: string = ''

    if (session && session.user && session.user.name && session.user.email) {
        firstName = session.user.name.slice(0, session.user.name.lastIndexOf(' ') + 1)
    }

    const emptyRows = page >= 0 ? Math.max(0, (1 + page) * rowPerPage - applications.length) : 0

    return (
        <ThemeProvider theme={CustomTheme}>
            <Sidebar />
            <Box
                sx={{
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'safe center',
                    ml: '240px',
                }}
            >
                <Box
                    sx={{
                        mt: '20px',
                        ml: { sm: '60px', lg: '120px' },
                        mr: { sm: '60px', lg: '120px' },
                        mb: '20px',
                    }}
                >
                    <Typography sx={{ mt: '28px' }} variant="h4" fontWeight="bold">
                        Welcome, {firstName}
                    </Typography>
                    <Link href="./dashboard/Application" passHref>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#00467F',
                                mt: '53px',
                                mb: '58px',
                            }}
                        >
                            Apply Now
                        </Button>
                    </Link>
                    {/* create table */}
                    <Card sx={{ p: '20px' }}>
                        <Typography variant="h5" fontWeight="bold">
                            Current Applications
                        </Typography>
                        <TableContainer>
                            <Table sx={{ minWidth: '887px' }} stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell style={{ textAlign: 'center' }}>{column.name}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {/* map each row to a table row and slice the number of rows based on rows per page */}
                                    {(rowPerPage > 0
                                        ? applications.slice(page * rowPerPage, page * rowPerPage + rowPerPage)
                                        : applications
                                    ).map((application, index) => (
                                        <TableRow>
                                            <TableCell style={{ textAlign: 'center' }}>
                                                {
                                                    courses.find((course) => course.id === application.courseId)
                                                        ?.courseCode
                                                }
                                            </TableCell>
                                            <TableCell style={{ textAlign: 'center' }}>
                                                {courses.find((course) => course.id === application.courseId)?.semester}
                                            </TableCell>
                                            <TableCell style={{ textAlign: 'center' }}>
                                                {application.applicationStatus === 'pending'
                                                    ? 'N/A'
                                                    : application.allocatedHours}
                                            </TableCell>
                                            <TableCell style={{ textAlign: 'center' }}>
                                                <Chip
                                                    color={
                                                        application.applicationStatus === 'pending'
                                                            ? 'secondary'
                                                            : 'primary'
                                                    }
                                                    label={application.applicationStatus}
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
                        </TableContainer>
                        {/* create table pages */}
                        <TablePagination
                            component="div"
                            rowsPerPage={rowPerPage}
                            count={rows.length}
                            rowsPerPageOptions={[5, 10, 25]}
                            page={page}
                            onPageChange={handPageChange}
                            onRowsPerPageChange={handleRowsPerPage}
                        ></TablePagination>
                    </Card>
                </Box>
            </Box>
        </ThemeProvider>
    )
}

export default StudentHomepage
