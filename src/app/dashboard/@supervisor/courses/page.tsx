'use client'

import CourseDetails from '@/app/components/courses/CourseDetails'
import DynamicBreadcrumb from '@/app/components/DynamicBreadcrumb'
import { Box } from '@mui/material'

export default function CreateCoursePage() {
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
                        mt: '30px',
                        ml: { xs: '15px', lg: '150px', xl: '250px', xxl: '350px', xxxl: '450px' },
                    }}
                >
                    <DynamicBreadcrumb />
                </Box>
                <Box
                    sx={{
                        mt: '40px',
                        ml: { xs: '5px', lg: '150px', xl: '250px' },
                        mr: { xs: '5px', lg: '150px', xl: '250px' },
                        mb: '50px',
                    }}
                >
                    <CourseDetails />
                </Box>
            </Box>
        </>
    )
}
