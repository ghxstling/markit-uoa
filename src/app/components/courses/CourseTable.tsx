'use client'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { TableBody } from '@mui/material'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

export default function CourseTable() {
    interface Course {
        courseCode: string
        semester: string
        markersNeeded: number
        applicants: number
        needMarkers: boolean
        id: number
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

    return (
        <TableContainer component={Paper} style={{ marginTop: 20 }}>
            <Table style={{ paddingTop: 40 }}>
                <TableHead>
                    <TableRow>
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
                            <div style={{ alignItems: 'center', flexWrap: 'wrap' }}>Edit Course Details</div>
                        </TableCell>
                        <TableCell style={{ textAlign: 'center' }}>
                            <div style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                                Markers Needed{' '}
                                <Tooltip title="Markers">
                                    <InfoOutlinedIcon style={{ marginLeft: 5, verticalAlign: 'middle' }} />
                                </Tooltip>{' '}
                                {/*TODO Sort feature<ArrowDownwardIcon style={{marginLeft:5, verticalAlign:"middle"}}/>*/}
                            </div>
                        </TableCell>
                        {/*TODO add this collumn<TableCell style={{textAlign:'center'}}><div style={{display:'flex', alignItems: 'center', flexWrap: 'wrap',}}>Number of Applicants <Tooltip title="Applicants"><InfoOutlinedIcon style={{marginLeft:5, verticalAlign:"middle"}}/></Tooltip> <ArrowDownwardIcon style={{marginLeft:5, verticalAlign:"middle"}}/></div></TableCell>*/}
                        <TableCell style={{ textAlign: 'center' }}>
                            <div style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                                Status{' '}
                                <Tooltip title="status">
                                    <InfoOutlinedIcon style={{ marginLeft: 5, verticalAlign: 'middle' }} />
                                </Tooltip>
                            </div>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(rowsPerPage > 0 ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : data).map(
                        (course, index) => (
                            <TableRow key={index} style={{}}>
                                <TableCell style={{ textAlign: 'center' }}>{course.courseCode}</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>{course.semester}</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                    <Link
                                        href="src/app/dashboard/courses/[courseId]/page.tsx"
                                        as={`/dashboard/courses/${course.id}`}
                                    >
                                        <Button>Edit</Button>
                                    </Link>
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>{course.markersNeeded}</TableCell>
                                {/*TODO add this data<TableCell style={{textAlign:'center'}}>{course.applicants}</TableCell>*/}
                                <TableCell style={{ textAlign: 'center' }}>
                                    {' '}
                                    {course.needMarkers ? (
                                        <Button variant="contained" color="error" style={{ width: '75%' }}>
                                            Incomplete
                                        </Button>
                                    ) : (
                                        <Button variant="contained" color="success" style={{ width: '75%' }}>
                                            Complete
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        )
                    )}
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
    )
}
