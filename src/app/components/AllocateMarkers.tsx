'use client'

import {
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
    Input,
    Button,
} from '@mui/material'
import React, { useState } from 'react'

const AllocateMarkers = () => {
    interface ApplyingStudents {}

    const [data, setData] = useState([])
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

    const handleAllocatedHoursChange = () => {}

    return (
        <>
            <Card sx={{ p: 4 }}>
                <>
                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                        [Course Name] - Allocate Hours to Qualified Markers
                    </Typography>
                    <TableContainer sx={{ width: '75%', backgroundColor: 'lightgrey', border: '2px solid black' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Markers Needed</TableCell>
                                    <TableCell>Markers Assigned</TableCell>
                                    <TableCell>Hours Needed</TableCell>
                                    <TableCell>Hours Assigned</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableCell>2</TableCell>
                                <TableCell>2</TableCell>
                                <TableCell>30</TableCell>
                                <TableCell>30</TableCell>
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TableContainer sx={{ mt: 6 }}>
                        <Table>
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
                                            {/*TODO Sort feature<ArrowDownwardIcon style={{marginLeft:5, verticalAlign:"middle"}}/>*/}
                                        </div>
                                    </TableCell>
                                    {/*TODO add this collumn<TableCell style={{textAlign:'center'}}><div style={{display:'flex', alignItems: 'center', flexWrap: 'wrap',}}>Number of Applicants <Tooltip title="Applicants"><InfoOutlinedIcon style={{marginLeft:5, verticalAlign:"middle"}}/></Tooltip> <ArrowDownwardIcon style={{marginLeft:5, verticalAlign:"middle"}}/></div></TableCell>*/}
                                    <TableCell style={{ textAlign: 'center' }}>
                                        <div style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                                            Allocated Hours for This Course
                                            {/*TODO add this collumn<TableCell style={{textAlign:'center'}}><div style={{display:'flex', alignItems: 'center', flexWrap: 'wrap',}}>Number of Applicants <Tooltip title="Applicants"><InfoOutlinedIcon style={{marginLeft:5, verticalAlign:"middle"}}/></Tooltip> <ArrowDownwardIcon style={{marginLeft:5, verticalAlign:"middle"}}/></div></TableCell>*/}
                                        </div>
                                    </TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>
                                        <div style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                                            Total Allocated Hours{' '}
                                            {/*TODO add this collumn<TableCell style={{textAlign:'center'}}><div style={{display:'flex', alignItems: 'center', flexWrap: 'wrap',}}>Number of Applicants <Tooltip title="Applicants"><InfoOutlinedIcon style={{marginLeft:5, verticalAlign:"middle"}}/></Tooltip> <ArrowDownwardIcon style={{marginLeft:5, verticalAlign:"middle"}}/></div></TableCell>*/}
                                        </div>
                                    </TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>
                                        <div style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                                            Maximum Hours Per Week{' '}
                                            {/*TODO add this collumn<TableCell style={{textAlign:'center'}}><div style={{display:'flex', alignItems: 'center', flexWrap: 'wrap',}}>Number of Applicants <Tooltip title="Applicants"><InfoOutlinedIcon style={{marginLeft:5, verticalAlign:"middle"}}/></Tooltip> <ArrowDownwardIcon style={{marginLeft:5, verticalAlign:"middle"}}/></div></TableCell>*/}
                                        </div>
                                    </TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>
                                        <div style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                                            Remove Qualification{' '}
                                            {/*TODO add this collumn<TableCell style={{textAlign:'center'}}><div style={{display:'flex', alignItems: 'center', flexWrap: 'wrap',}}>Number of Applicants <Tooltip title="Applicants"><InfoOutlinedIcon style={{marginLeft:5, verticalAlign:"middle"}}/></Tooltip> <ArrowDownwardIcon style={{marginLeft:5, verticalAlign:"middle"}}/></div></TableCell>*/}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {/*  {(rowsPerPage > 0
                                            ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            : data
                                        ).map((course, index) => (
                                            <TableRow key={index} style={{}}>
                                                <TableCell style={{textAlign:'center'}}>{applicant name}</TableCell>
                                                <TableCell style={{textAlign:'center'}}>{grade}</TableCell>
                                                <TableCell style={{textAlign:'center'}}>{marked before}</TableCell>
                                                <TableCell style={{textAlign:'center'}}>
                                                    <Input
                                                        name="allocateHours"
                                                        id="allocateHours"
                                                        value={need to fetch the current allocated hours}
                                                        size="small"
                                                        onChange={handleAllocatedHoursChange}
                                                        inputProps={{
                                                            step: 1,
                                                            min: 0,
                                                            type: 'number',
                                                        }}
                                                        sx={{ ml: '20px' }}
                                                    />
                                                </TableCell>
                                                <TableCell style={{textAlign:'center'}}>{Total Allocated Hours}</TableCell>
                                                <TableCell style={{textAlign:'center'}}>{Maximum Hours Per Week}</TableCell>
                                                <TableCell style={{textAlign:'center'}}><Button>{Remove Qualification}</Button></TableCell>
                                            </TableRow>
                                        ))} */}
                                <TableRow>
                                    <TableCell style={{ textAlign: 'center' }}>Marwa Yang</TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>A</TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>Yes</TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>
                                        <Input
                                            name="allocateHours"
                                            id="allocateHours"
                                            value={10}
                                            size="small"
                                            onChange={handleAllocatedHoursChange}
                                            inputProps={{
                                                step: 1,
                                                min: 0,
                                                type: 'number',
                                            }}
                                            sx={{ ml: '20px', width: '50px' }}
                                        />
                                    </TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>25</TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>5</TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>
                                        <Button variant="contained" sx={{ backgroundColor: 'red' }}>
                                            Remove
                                        </Button>
                                    </TableCell>
                                </TableRow>
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
                </>
            </Card>
        </>
    )
}

export default AllocateMarkers
