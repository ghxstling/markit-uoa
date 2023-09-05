import { Box, Stack } from '@mui/material'
import Sidebar from '../components/Sidebar'

export default function coordinatorDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                <Stack direction={'row'}>
                    <Box sx={{ width: '15rem' }}>
                        <Sidebar />
                    </Box>
                    <Box sx={{ mt: '50px', ml: '96px' }}>{children}</Box>
                </Stack>
            </body>
        </html>
    )
}
