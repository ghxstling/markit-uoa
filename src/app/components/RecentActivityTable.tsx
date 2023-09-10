import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import Button from '@mui/material/Button'

function createData(role: string, name: string, course: string, action: string, when: string) {
    return { role, name, course, action, when }
}

const rows = [
    createData('Supervisor', 'John Doe', 'Compsci 101', 'Changed Marker Hours', '28/10/2023'),
    createData('Supervisor', 'John Smith', 'Compsci 210', 'Changed Preferred Number of Markers', '24/10/2023'),
    createData('Supervisor', 'John Cena', 'Compsci 340', 'Changed Number of Assignments', '10/10/2023'),
    createData('Supervisor', 'John John', 'Compsci 340', 'Changed Preferred Number of Markers', '16/09/2023'),
    createData('Supervisor', 'Johnson Donovan', 'Compsci 345', 'Changed Marker Responsibility', '22/08/2021'),
]

export default function RecentActivityTable() {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: { md: '442px', lg: '887px' } }} aria-label="simple table">
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.name}
                            sx={{
                                '&:last-child td, &:last-child th': {
                                    border: 0,
                                },
                            }}
                        >
                            <TableCell component="th" scope="row">
                                <>
                                    <Typography variant="h6">
                                        {row.role}: {row.name}
                                    </Typography>

                                    <Typography variant="subtitle1" color={'#666666'}>
                                        {row.action} - {row.course}
                                    </Typography>
                                </>
                            </TableCell>
                            <TableCell align="right">{row.when}</TableCell>
                            <TableCell align="right">
                                <Link href="./" passHref>
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            color: '#00467F',
                                        }}
                                    >
                                        VIEW CHANGE
                                    </Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
