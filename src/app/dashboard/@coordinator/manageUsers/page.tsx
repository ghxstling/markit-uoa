'use client'
import Sidebar from '../../../components/Sidebar'
import DynamicBreadcrumb from '../../../components/DynamicBreadcrumb'
import UserRolesTable from '../../../components/Users/UserRolesTable'
import { Box, Stack } from '@mui/material'
import CustomTheme from '@/app/CustomTheme'
import { ThemeProvider } from '@mui/material/styles'

export default function ManageUsersPage() {
    return (
        <ThemeProvider theme={CustomTheme}>
            <Stack>
                <Box
                    sx={{
                        mt: '50px',
                        ml: { sm: '50px', md: '100px', lg: '150px', xl: '200px', xxl: '250px', xxxl: '300px' },
                    }}
                >
                    <DynamicBreadcrumb />
                </Box>
                <Box
                    sx={{
                        mt: '25px',
                        ml: { sm: '50px', md: '100px', lg: '150px', xl: '200px', xxl: '250px', xxxl: '300px' },
                    }}
                >
                    <UserRolesTable />
                </Box>
            </Stack>
        </ThemeProvider>
    )
}
