import { Box, Stack } from '@mui/material'
import Sidebar from '@/app/components/Sidebar'
import DynamicBreadcrumb from '@/app/components/DynamicBreadcrumb'

export default function studentViewAllCoursesLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <Stack direction={'row'}>
                    <Box sx={{ width: '15rem' }}>
                        <Sidebar />
                    </Box>
                    <Stack>
                        <Box sx={{ mt: '100px', ml: '350px' }}>
                            <DynamicBreadcrumb />
                        </Box>
                        <Box sx={{ mt: '25px', ml: '350px' }}>{children}</Box>
                    </Stack>
                </Stack>
            </body>
        </html>
    )
}
