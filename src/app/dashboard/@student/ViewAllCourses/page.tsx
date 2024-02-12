'use client'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Box, Container, TableBody, TableSortLabel } from '@mui/material'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import DynamicBreadcrumb from '@/app/components/DynamicBreadcrumb'
import Sidebar from '@/app/components/Sidebar'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import CustomTheme from '@/app/CustomTheme'
import { ThemeProvider } from '@mui/material/styles'

export default function StudentViewAllCourses() {
    interface Course {
        courseCode: string
        semester: string
        markersNeeded: number
        applicants: number
        needMarkers: boolean
        id: number
        courseDescription: string
        markerResponsibilities: string
        markerHours: number
    }

    const [data, setData] = useState<Course[]>([])
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [sortField, setSortField] = useState<'courseCode' | 'semester' | 'markersNeeded' | null>(null)
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

    const handleSort = (field: 'courseCode' | 'semester' | 'markersNeeded') => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortDirection('asc')
        }
    }

    useEffect(() => {
        const sortedData = [...data]
        if (sortField) {
            sortedData.sort((a, b) => {
                if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1
                if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1
                return 0
            })
        }
        setData(sortedData)
    }, [sortField, sortDirection])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const response = await fetch('/api/courses', { method: 'GET' })
            const jsonData = await response.json()
            setData(jsonData)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(5)

    const emptyRows = page >= 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }
    const [openRows, setOpenRows] = useState(Array(data.length).fill(false))

    const toggleRow = (index: number) => {
        const newOpenRows = [...openRows]
        newOpenRows[index] = !newOpenRows[index]
        setOpenRows(newOpenRows)
    }

    return (
        <ThemeProvider theme={CustomTheme}>
            <Sidebar />
            <Box
                sx={{
                    // height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'safe center',
                    ml: '12.5vw',
                }}
            >
                <Box
                    sx={{
                        mt: '12.5vh',
                        ml: { sm: '20vw', md: '12.5vw', lg: '7.5vw', xl: '5vw' },
                    }}
                >
                    <DynamicBreadcrumb />
                </Box>
                <Container
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignContent: 'center',
                        width: '50vw',
                        minWidth: '35vw',

                        mt: '50px',
                        ml: { xs: '10px', lg: '200px', xl: '400px' },
                        mr: { xs: '10px', lg: '150px', xl: '200px' },
                        mb: '100px',
                    }}
                >
                    <TableContainer
                        component={Paper}
                        elevation={0}
                        variant="outlined"
                        style={{
                            marginTop: 20,
                        }}
                    >
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{
                                pt: 1,
                                pl: 4,
                                pr: 3,
                            }}
                        >
                            <Typography variant="h5" fontWeight="bold">
                                Course List
                            </Typography>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                id="search"
                                label="Search by Course/Semester"
                                name="search"
                                size="medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ width: '235px' }}
                            />
                        </Box>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                                    <TableCell />
                                    <TableCell style={{ textAlign: 'center' }} onClick={() => handleSort('courseCode')}>
                                        <TableSortLabel
                                            style={{ cursor: 'pointer' }}
                                            active={sortField === 'courseCode'}
                                            direction={sortField === 'courseCode' ? sortDirection : 'asc'}
                                        >
                                            <Typography fontWeight={600}>Course</Typography>
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell style={{ textAlign: 'center' }} onClick={() => handleSort('semester')}>
                                        <TableSortLabel
                                            style={{ cursor: 'pointer' }}
                                            active={sortField === 'semester'}
                                            direction={sortField === 'semester' ? sortDirection : 'asc'}
                                        >
                                            <Typography fontWeight={600}>Semester</Typography>
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell
                                        style={{ textAlign: 'center' }}
                                        onClick={() => handleSort('markersNeeded')}
                                    >
                                        <TableSortLabel
                                            style={{ cursor: 'pointer' }}
                                            active={sortField === 'markersNeeded'}
                                            direction={sortField === 'markersNeeded' ? sortDirection : 'asc'}
                                        >
                                            <Typography fontWeight={600}>Markers Needed</Typography>
                                            <Tooltip title="Markers needed for the course">
                                                <InfoOutlinedIcon style={{ marginLeft: 10, verticalAlign: 'middle' }} />
                                            </Tooltip>
                                        </TableSortLabel>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(rowsPerPage > 0
                                    ? data
                                          .filter(
                                              (course) =>
                                                  course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                  course.semester.toLowerCase().includes(searchTerm.toLowerCase())
                                          )
                                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : data.filter(
                                          (course) =>
                                              course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                              course.semester.toLowerCase().includes(searchTerm.toLowerCase())
                                      )
                                ).map((course, index) => (
                                    <>
                                        <TableRow key={index}>
                                            <TableCell>
                                                <IconButton
                                                    aria-label="expand row"
                                                    size="small"
                                                    onClick={() => toggleRow(index)}
                                                >
                                                    {openRows[index] ? (
                                                        <KeyboardArrowUpIcon />
                                                    ) : (
                                                        <KeyboardArrowDownIcon />
                                                    )}
                                                </IconButton>
                                            </TableCell>
                                            <TableCell style={{ textAlign: 'center' }}>{course.courseCode}</TableCell>
                                            <TableCell style={{ textAlign: 'center' }}>{course.semester}</TableCell>
                                            <TableCell style={{ textAlign: 'center' }}>
                                                {course.markersNeeded}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                <Collapse in={openRows[index]} timeout="auto" unmountOnExit>
                                                    <Box sx={{ margin: 1 }}>
                                                        <Typography
                                                            variant="h6"
                                                            gutterBottom
                                                            component="div"
                                                            sx={{ whiteSpace: 'pre-line' }}
                                                        >
                                                            Details:
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            Course Description: {course.courseDescription}
                                                        </Typography>{' '}
                                                        <br />
                                                        <Typography variant="body1">
                                                            Marker Responsibilities: {course.markerResponsibilities}
                                                        </Typography>{' '}
                                                        <br />
                                                        <Typography variant="body1">
                                                            Marker Hours: {course.markerHours}
                                                        </Typography>
                                                    </Box>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </>
                                ))}
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: 69.5 * emptyRows }}>
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        component="div"
                        sx={{ width: '100%' }}
                        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                        colSpan={3}
                        count={
                            data.filter(
                                (course) =>
                                    course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    course.semester.toLowerCase().includes(searchTerm.toLowerCase())
                            ).length
                        }
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        showFirstButton={true}
                        showLastButton={true}
                    />
                </Container>
            </Box>
        </ThemeProvider>
    )
}
