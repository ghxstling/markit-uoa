'use client'
import EditCourseDetails from '@/app/components/courses/EditCourseDetails'
import Sidebar from '../../../../components/Sidebar'
import DynamicBreadcrumb from '@/app/components/DynamicBreadcrumb'
import { usePathname } from 'next/navigation'
import { ThemeProvider } from '@mui/material/styles'
import CustomTheme from '@/app/CustomTheme'
import { Box, Stack } from '@mui/material'

export default function CreateCoursePage() {
    const pathname = usePathname()
    const courseId = pathname.split('/').pop() || ''

    return (
        <ThemeProvider theme={CustomTheme}>
            <Stack>
                <Box
                    sx={{
                        mt: '60px',
                        ml: { sm: '50px', md: '100px', lg: '250px', xl: '350px', xxl: '450px', xxxl: '550px' },
                    }}
                >
                    <DynamicBreadcrumb />
                </Box>
                <Box
                    sx={{
                        mt: '25px',
                        ml: { sm: '100px', md: '150px', lg: '300px', xl: '400px', xxl: '500px', xxxl: '600px' },
                    }}
                >
                    <EditCourseDetails courseId={courseId} />
                </Box>
            </Stack>
        </ThemeProvider>
    )
}
