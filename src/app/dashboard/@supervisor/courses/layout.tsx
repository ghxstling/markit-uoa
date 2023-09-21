import { Box, Stack } from '@mui/material'
import Sidebar from '@/app/components/Sidebar'
import DynamicBreadcrumb from '@/app/components/DynamicBreadcrumb'

export default function supervisorCreateCourseLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <Stack direction={'row'}>
                    <Box sx={{ width: '15rem' }}>
                        <Sidebar />
                    </Box>
                    <Stack>
                        <Box sx={{ mt: '60px', ml: '400px' }}>
                            <DynamicBreadcrumb />
                        </Box>
                        <Box sx={{ mt: '25px', ml: '500px' }}>{children}</Box>
                    </Stack>
                </Stack>
            </body>
        </html>
    )
}
