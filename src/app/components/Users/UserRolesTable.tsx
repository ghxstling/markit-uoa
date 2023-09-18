import {
    TableBody,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TablePagination,
    Select,
    MenuItem,
    SelectChangeEvent,
    TableFooter,
} from '@mui/material'
import { Role } from '@/models/role'
import React, { useEffect, useState } from 'react'

export default function UserRolesTable() {
    interface User {
        id: number
        email: string
        name: string
        role: string
    }

    const [users, setUsers] = useState<User[]>([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [firstRender, setFirstRender] = useState(true)
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
        async function fetchData() {
            try {
                const response = await fetch('/api/users', { method: 'GET' })
                const jsonData = await response.json()
                console.log('Fetched users data:', jsonData)
                setUsers(jsonData)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        setFirstRender(false)
        fetchData()
    }, [])

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const handleRoleChange = async (event: SelectChangeEvent, userId: number) => {
        const newRole = event.target.value as Role

        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role: newRole }),
            })

            const result = await response.json()

            if (response.status !== 200) {
                console.error('Error updating role:', result.statusText || 'Unknown error')
            } else {
                setUsers((prevUsers) =>
                    prevUsers.map((user) => (user.id === userId ? { ...user, role: newRole } : user))
                )
            }
        } catch (error) {
            console.error('Error updating role:', error)
        }
    }

    if (firstRender) {
        return null
    }
    if (!isClient) {
        return null // Render nothing if not on client
    }

    return (
        <TableContainer component={Paper} style={{ marginTop: 20 }}>
            <Table style={{ paddingTop: 40 }}>
                <TableHead>
                    <TableRow>
                        <TableCell style={{ textAlign: 'center' }}>Name</TableCell>
                        <TableCell style={{ textAlign: 'center' }}>Email</TableCell>
                        <TableCell style={{ textAlign: 'center' }}>Role</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(rowsPerPage > 0 ? users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : users).map(
                        (user) => (
                            <TableRow key={user.id}>
                                <TableCell style={{ textAlign: 'center' }}>{user.name}</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>{user.email}</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                    <Select
                                        value={user.role}
                                        onChange={(event) => handleRoleChange(event, user.id)}
                                        displayEmpty
                                    >
                                        <MenuItem value={Role.Student}>Student</MenuItem>
                                        <MenuItem value={Role.Supervisor}>Supervisor</MenuItem>
                                        <MenuItem value={Role.Coordinator}>Coordinator</MenuItem>
                                    </Select>
                                </TableCell>
                            </TableRow>
                        )
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={3}>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                count={users.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                showFirstButton={true}
                                showLastButton={true}
                            />
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    )
}
