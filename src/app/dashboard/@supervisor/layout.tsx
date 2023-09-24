import { Box, Stack } from '@mui/material'
import Sidebar from '@/app/components/Sidebar'

export default function SupervisorDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <Stack direction={'row'}>
                    <Box sx={{ width: '15rem' }}>
                        <Sidebar />
                    </Box>
                    <Box sx={{ mt: '100px', ml: '120px' }}>{children}</Box>
                </Stack>
            </body>
        </html>
    )
}
