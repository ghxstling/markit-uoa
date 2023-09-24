import { Box, Stack } from '@mui/material'
import Sidebar from '@/app/components/Sidebar'

export default function SupervisorDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Stack direction={'row'}>
                <Box sx={{ width: '15rem' }}>
                    <Sidebar />
                </Box>
                {children}
            </Stack>
        </>
    )
}
