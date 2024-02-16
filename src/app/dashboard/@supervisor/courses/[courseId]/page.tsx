'use client'

import EditCourseDetails from '@/app/components/courses/EditCourseDetails'
import DynamicBreadcrumb from '@/app/components/DynamicBreadcrumb'
import { usePathname } from 'next/navigation'
import { Box } from '@mui/material'

export default function CreateCoursePage() {
    const pathname = usePathname()
    const courseId = pathname.split('/').pop() || ''

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
                        ml: { xs: '5px', lg: '100px', xl: '200px' },
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
                    <EditCourseDetails courseId={courseId} />
                </Box>
            </Box>
        </>
    )
}
