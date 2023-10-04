'use client'

import React from 'react'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Box, CircularProgress } from '@mui/material'
import Sidebar from '@/app/components/Sidebar'
import CoursePieChart from '@/app/components/CoordinatorDashboardData/CoursePieChart'
import CustomTheme from '@/app/CustomTheme'
import { ThemeProvider } from '@mui/material/styles'
import GradeBarChart from '@/app/components/CoordinatorDashboardData/GradeBarChart'
import ChartsContainer from '@/app/components/CoordinatorDashboardData/ChartsContainer'

export default function CoordinatorDashboard() {
    const { data: session } = useSession()

    let firstName: string = ''

    if (session && session.user && session.user.name && session.user.email) {
        firstName = session.user.name.slice(0, session.user.name.lastIndexOf(' ') + 1)
    }

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
                        ml: { sm: '60px', lg: '120px' },
                        mr: { sm: '25px', lg: '50px' },
                        mb: '20px',
                    }}
                >
                    <Typography sx={{ mt: '28px', mb: '53px' }} variant="h4" fontWeight="bold">
                        Welcome, {firstName}
                    </Typography>
                    <Link href="/dashboard/viewAllCoursespage" passHref>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#00467F',
                            }}
                        >
                            VIEW ALL COURSES
                        </Button>
                    </Link>
                    <Typography variant="h5" fontWeight="bold" sx={{ mt: '58px' }}>
                        Statistics
                    </Typography>
                    <Divider variant="fullWidth" sx={{ mb: '20px' }} />

                    <ChartsContainer />
                </Box>
            </Box>
        </ThemeProvider>
    )
}
