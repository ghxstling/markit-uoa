import { Box, Stack } from '@mui/material'
import Sidebar from '@/app/components/Sidebar'
import DynamicBreadcrumb from '@/app/components/DynamicBreadcrumb'

export default function SupervisorCreateCourseLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <Stack>
                    <Box
                        sx={{
                            mt: '60px',
                            ml: { sm: '300px', md: '300px', lg: '300px', xl: '350px' },
                        }}
                    >
                        <DynamicBreadcrumb />
                    </Box>
                    <Box sx={{ mt: '25px', ml: { sm: '300px', md: '200px', lg: '200px', xl: '250px' } }}>
                        {children}
                    </Box>
                </Stack>
            </body>
        </html>
    )
}
