'use client'

import DynamicBreadcrumb from '@/app/components/DynamicBreadcrumb'
import CourseTable from '@/app/components/courses/CourseTable'
import { Box } from '@mui/material'

export default function AllCourseView() {
    return (
        <>
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
                    <CourseTable />
                </Box>
            </Box>
        </>
    )
}
