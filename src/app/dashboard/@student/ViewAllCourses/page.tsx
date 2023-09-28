'use client'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Box, TableBody } from '@mui/material'
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
        data.map((course, index) => console.log(course.needMarkers))
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
            <Box sx={{ display: 'flex' }}>
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
                        <h2>Course View</h2>
                        <TableContainer component={Paper} style={{ marginTop: 20 }} sx={{ width: '100%' }}>
                            <Table style={{ paddingTop: 40 }}>
                                <TableHead>
                                    <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                                        <TableCell />
                                        <TableCell style={{ textAlign: 'center' }}>
                                            <div style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                                                Course
                                                {/*TODO Sort feature<ArrowDownwardIcon style={{marginLeft:5, verticalAlign:"middle"}}/>*/}
                                            </div>
                                        </TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>
                                            <div style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                                                Semester{' '}
                                                {/*TODO Sort feature<ArrowDownwardIcon style={{marginLeft:5, verticalAlign:"middle"}}/>*/}
                                            </div>
                                        </TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>
                                            <div style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                                                Markers Needed{' '}
                                                <Tooltip title="Markers">
                                                    <InfoOutlinedIcon
                                                        style={{ marginLeft: 5, verticalAlign: 'middle' }}
                                                    />
                                                </Tooltip>{' '}
                                                {/*TODO Sort feature<ArrowDownwardIcon style={{marginLeft:5, verticalAlign:"middle"}}/>*/}
                                            </div>
                                        </TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>
                                            <div style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                                                PlaceHolder{' '}
                                                <Tooltip title="status">
                                                    <InfoOutlinedIcon
                                                        style={{ marginLeft: 5, verticalAlign: 'middle' }}
                                                    />
                                                </Tooltip>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(rowsPerPage > 0
                                        ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        : data
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
                                                <TableCell style={{ textAlign: 'center' }}>
                                                    {course.courseCode}
                                                </TableCell>
                                                <TableCell style={{ textAlign: 'center' }}>{course.semester}</TableCell>
                                                <TableCell style={{ textAlign: 'center' }}>
                                                    {course.markersNeeded}
                                                </TableCell>
                                                <TableCell style={{ textAlign: 'center' }}>PLACEHOLDER</TableCell>
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
                                count={data.length}
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
            </Box>
        </ThemeProvider>
    )
}
