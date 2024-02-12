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
    Dialog,
    Container,
} from '@mui/material'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Sidebar from '@/app/components/Sidebar'
import CustomTheme from '@/app/CustomTheme'
import { ThemeProvider } from '@mui/material/styles'
import ChangePreferenceOrder from '@/app/components/ApplicationForms/ChangePreferenceOrder'

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
    const [preferenceDialogOpen, setPreferenceDialogOpen] = useState(false)

    //handle pagination
    const handPageChange = (event: unknown, newpage: any) => {
        setPage(newpage)
    }

    const handleRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const openPreferenceDialog = () => {
        setPreferenceDialogOpen(true)
    }

    const closePreferenceDialog = () => {
        setPreferenceDialogOpen(false)
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

    // button styling
    const buttonStyle = {
        backgroundColor: 'white',
        color: '#00467F',
        border: '1px solid #636363',
        ml: 3,
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
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'safe center',
                    ml: '12.5vw',
                }}
            >
                <Box
                    sx={{
                        ml: { sm: '20vw', md: '12.5vw', lg: '7.5vw', xl: '5vw' },
                        mt: '8vh',
                        mb: '8vh',
                    }}
                >
                    <Typography variant="h4" fontWeight="bold">
                        Welcome, {firstName}
                    </Typography>
                    <Link href="./dashboard/Application" passHref>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#00467F',
                                m: '1vw 0 1vw 0',
                            }}
                        >
                            Apply Now
                        </Button>
                    </Link>
                </Box>
                <Container
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignContent: 'center',
                        width: '50vw',
                        minWidth: '35vw',
                    }}
                >
                    {/* create table */}
                    <Card
                        variant="outlined"
                        sx={{
                            p: '30px 30px 0px 30px',
                            borderColor: 'lightgray',
                        }}
                    >
                        <Box display="flex">
                            <Typography variant="h5" fontWeight="bold">
                                Current Applications
                            </Typography>
                            {applications.length === 0 ? (
                                <Button disabled variant={'outlined'} size="small" sx={buttonStyle}>
                                    Edit Order of Preference
                                </Button>
                            ) : (
                                <Button
                                    variant={'outlined'}
                                    size="small"
                                    onClick={openPreferenceDialog}
                                    sx={buttonStyle}
                                >
                                    Edit Order of Preference
                                </Button>
                            )}
                        </Box>
                        <TableContainer>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column, index) => (
                                            <TableCell key={index} style={{ textAlign: 'center', fontSize: '1rem' }}>
                                                {column.name}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody
                                    sx={{
                                        position: 'relative',
                                    }}
                                >
                                    {/* if there are no applications, display a message */}
                                    {applications.length === 0 && (
                                        <Box
                                            component="center"
                                            sx={{
                                                position: 'absolute',
                                                top: '25%',
                                                left: '35%',
                                            }}
                                        >
                                            <Typography variant="overline" fontSize={'1rem'} color={'darkgray'}>
                                                No Current Applications
                                            </Typography>
                                        </Box>
                                    )}
                                    {/* map each row to a table row and slice the number of rows based on rows per page */}
                                    {(rowPerPage > 0
                                        ? applications.slice(page * rowPerPage, page * rowPerPage + rowPerPage)
                                        : applications
                                    ).map((application, index) => (
                                        <TableRow key={index}>
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
                                                            : application.applicationStatus === 'approved'
                                                            ? 'primary'
                                                            : 'error'
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
                            count={applications.length}
                            rowsPerPageOptions={[5, 10, 25]}
                            page={page}
                            onPageChange={handPageChange}
                            onRowsPerPageChange={handleRowsPerPage}
                        />
                        <ChangePreferenceOrder open={preferenceDialogOpen} setOpen={setPreferenceDialogOpen} />
                    </Card>
                </Container>
            </Box>
        </ThemeProvider>
    )
}

export default StudentHomepage
