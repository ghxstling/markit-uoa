'use client'
import CourseDetails from '@/app/components/courses/CourseDetails'
import Sidebar from '../../../components/Sidebar'
import DynamicBreadcrumb from '@/app/components/DynamicBreadcrumb'
import { Box, Stack } from '@mui/material'
import CustomTheme from '@/app/CustomTheme'
import { ThemeProvider } from '@mui/material/styles'

export default function CreateCoursePage() {
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
                    <CourseDetails />
                </Box>
            </Stack>
        </ThemeProvider>
    )
}
