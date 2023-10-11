'use client'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Box, TableBody, TableSortLabel } from '@mui/material'
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
                        ml: { xs: '5px', lg: '100px', xl: '200px' },
                    }}
                >
                    <DynamicBreadcrumb />
                </Box>
                <Box
                    sx={{
                        mt: '50px',
                        ml: { xs: '5px', lg: '150px', xl: '250px' },
                        mr: { xs: '5px', lg: '150px', xl: '250px' },
                        mb: '100px',
                    }}
                >
                    <TableContainer component={Paper} style={{ marginTop: 20 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ p: 2 }}>
                            <h2>Course View</h2>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                id="search"
                                label="Search by Course or Semester"
                                name="search"
                                size="medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ width: '260px' }}
                            />
                        </Box>
                        <Table style={{ paddingTop: 40 }}>
                            <TableHead>
                                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                                    <TableCell />
                                    <TableCell style={{ textAlign: 'center' }} onClick={() => handleSort('courseCode')}>
                                        <TableSortLabel
                                            style={{ cursor: 'pointer' }}
                                            active={sortField === 'courseCode'}
                                            direction={sortField === 'courseCode' ? sortDirection : 'asc'}
                                        >
                                            Course
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell style={{ textAlign: 'center' }} onClick={() => handleSort('semester')}>
                                        <TableSortLabel
                                            style={{ cursor: 'pointer' }}
                                            active={sortField === 'semester'}
                                            direction={sortField === 'semester' ? sortDirection : 'asc'}
                                        >
                                            Semester
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
                                            Markers Needed
                                            <Tooltip title="Markers needed for the course">
                                                <InfoOutlinedIcon style={{ marginLeft: 5, verticalAlign: 'middle' }} />
                                            </Tooltip>
                                        </TableSortLabel>
                                        <div style={{ alignItems: 'center', flexWrap: 'wrap' }}></div>
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
                    </TableContainer>
                </Box>
            </Box>
        </ThemeProvider>
    )
}
