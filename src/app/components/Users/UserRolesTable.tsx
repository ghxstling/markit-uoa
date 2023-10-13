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
    Container,
    Typography,
    TextField,
    Box,
} from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import { Role } from '@/models/role'
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

export default function UserRolesTable() {
    interface User {
        id: number
        email: string
        name: string
        role: string
    }

    const { data: session } = useSession()
    const [users, setUsers] = useState<User[]>([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: 'ascending' | 'descending' } | null>(
        null
    )
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/users', { method: 'GET' })
                const jsonData = await response.json()
                const userData = jsonData.filter((user: User) => user.email !== session?.user?.email)
                setUsers(userData)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData()
    }, [])

    const isClient = typeof window !== 'undefined'

    if (!isClient) {
        return null
    }

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

    function handleSort(column: keyof User) {
        let direction: 'ascending' | 'descending' = 'ascending'
        if (sortConfig && sortConfig.key === column && sortConfig.direction === 'ascending') {
            direction = 'descending'
        }
        setSortConfig({ key: column, direction })
    }

    const sortedUsers = [...users].sort((a, b) => {
        if (sortConfig === null) return 0
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
    })

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value)
    }

    const filteredUsers = sortedUsers.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <Container style={{ marginTop: 20, width: '100%' }}>
            <Paper elevation={3} style={{ padding: '20px' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4" fontWeight={600} style={{ marginBottom: '20px', fontSize: '1.8rem' }}>
                        Manage User Roles
                    </Typography>
                    <TextField
                        variant="outlined"
                        label="Search"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        style={{ marginBottom: 20 }}
                    />
                </Box>
                <TableContainer component={Paper} style={{ marginTop: 20 }}>
                    <Table style={{ paddingTop: 40 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    style={{
                                        textAlign: 'center',
                                        minWidth: '100px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => handleSort('name')}
                                >
                                    Name
                                    {sortConfig?.key === 'name' &&
                                        (sortConfig.direction === 'ascending' ? (
                                            <ArrowDropUpIcon />
                                        ) : (
                                            <ArrowDropDownIcon />
                                        ))}
                                </TableCell>
                                <TableCell
                                    style={{
                                        textAlign: 'center',
                                        minWidth: '70px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => handleSort('email')}
                                >
                                    Email
                                    {sortConfig?.key === 'email' &&
                                        (sortConfig.direction === 'ascending' ? (
                                            <ArrowDropUpIcon />
                                        ) : (
                                            <ArrowDropDownIcon />
                                        ))}
                                </TableCell>
                                <TableCell style={{ textAlign: 'center', minWidth: '60px', fontWeight: 'bold' }}>
                                    Role
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell style={{ textAlign: 'center', minWidth: '100px' }}>
                                        {user.name}
                                    </TableCell>
                                    <TableCell style={{ textAlign: 'center', minWidth: '70px' }}>
                                        {user.email}
                                    </TableCell>
                                    <TableCell style={{ textAlign: 'center', minWidth: '60px' }}>
                                        <Select
                                            value={user.role}
                                            onChange={(event) => handleRoleChange(event, user.id)}
                                            displayEmpty
                                            style={{ width: '80%', fontSize: '0.8rem' }}
                                            size="small"
                                        >
                                            <MenuItem value={Role.Student}>Student</MenuItem>
                                            <MenuItem value={Role.Supervisor}>Supervisor</MenuItem>
                                            <MenuItem value={Role.Coordinator}>Coordinator</MenuItem>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={3}>
                                    <TablePagination
                                        component="div"
                                        rowsPerPageOptions={[10, 25, 50, 100]}
                                        count={filteredUsers.length}
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
            </Paper>
        </Container>
    )
}
