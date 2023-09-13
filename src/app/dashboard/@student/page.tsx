'use client'

import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
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
} from '@mui/material'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

const studentHomepage = () => {
    //initialise use states
    const [rows, rowChange] = useState([])
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
        fetch('https://jsonplaceholder.typicode.com/users')
            .then((response) => response.json())
            .then((json) => {
                console.log(json)
                rowChange(json)
            })
            .catch((e) => {
                console.log(e.message)
            })
    }, [])

    //initialise columns
    const columns = [
        { id: 'name', name: 'Course' },
        { id: 'email', name: 'Semester' },
        { id: 'username', name: 'Status' },
        { id: 'website', name: 'Hours Assigned' },
        { id: 'phone', name: 'Final/Estimate' },
    ]

    //get first name of user
    const { data: session } = useSession()

    let firstName: string = ''

    if (session && session.user && session.user.name && session.user.email) {
        firstName = session.user.name.slice(
            0,
            session.user.name.lastIndexOf(' ') + 1
        )
    }

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Box sx={{ mt: '50px', ml: '96px' }}>
                    <Typography
                        sx={{ mt: '28px' }}
                        variant="h4"
                        fontWeight="bold"
                    >
                        Welcome, {firstName}
                    </Typography>
                    <Link href="./" passHref>
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
                                            <TableCell key={column.id}>
                                                {column.name}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {/* map each row to a table row and slice the number of rows based on rows per page */}
                                    {rows &&
                                        rows
                                            .slice(
                                                page * rowPerPage,
                                                page * rowPerPage + rowPerPage
                                            )
                                            .map((row, index) => {
                                                return (
                                                    <TableRow key={index}>
                                                        {/* map each column value of a row to its own cell */}
                                                        {columns &&
                                                            columns.map(
                                                                (column) => {
                                                                    let value =
                                                                        row[
                                                                            column
                                                                                .id
                                                                        ]
                                                                    return (
                                                                        <TableCell
                                                                            key={
                                                                                value
                                                                            }
                                                                        >
                                                                            {
                                                                                value
                                                                            }
                                                                        </TableCell>
                                                                    )
                                                                }
                                                            )}
                                                    </TableRow>
                                                )
                                            })}
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
        </>
    )
}

export default studentHomepage
