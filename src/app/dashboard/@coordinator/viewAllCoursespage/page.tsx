'use client'
import Typography from '@mui/material/Typography'
import { useSession } from 'next-auth/react'
import DynamicBreadcrumb from '@/app/components/DynamicBreadcrumb'
import Sidebar from '@/app/components/Sidebar'
import CourseTable from '@/app/components/courses/CourseTable'
import { Box, Stack } from '@mui/material'
import CustomTheme from '@/app/CustomTheme'
import { ThemeProvider } from '@mui/material/styles'

export default function AllCourseView() {
    return (
        <ThemeProvider theme={CustomTheme}>
            <Stack>
                <Box
                    sx={{
                        mt: '100px',
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
                    <h2>Course View</h2>
                    <CourseTable />
                </Box>
            </Stack>
        </ThemeProvider>
    )
}
