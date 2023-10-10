'use client'

import DynamicBreadcrumb from '@/app/components/DynamicBreadcrumb'
import Sidebar from '@/app/components/Sidebar'
import ImportCourses from '@/app/components/courses/ImportCourses'
import { Box, Stack } from '@mui/material'
import CustomTheme from '@/app/CustomTheme'
import { ThemeProvider } from '@mui/material/styles'

export default function AllCourseView() {
    return (
        <ThemeProvider theme={CustomTheme}>
            <Sidebar />
            <Box
                sx={{
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'safe center',
                    ml: '240px',
                }}
            >
                <Box
                    sx={{
                        mt: '20px',
                        ml: { xs: '5px', lg: '100px', xl: '200px' },
                    }}
                >
                    <DynamicBreadcrumb />
                </Box>
                <Box
                    sx={{
                        mt: '50px',
                        ml: { xs: '5px', lg: '150px', xl: '250px' },
                        mr: { xs: '5px', lg: '150px', xl: '250px' },
                        mb: '100px',
                    }}
                >
                    <ImportCourses />
                </Box>
            </Box>
        </ThemeProvider>
    )
}
