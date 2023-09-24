'use client'

import React from 'react'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import RecentActivityTable from '@/app/components/RecentActivityTable'
import Button from '@mui/material/Button'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Box } from '@mui/material'

export default function CoordinatorDashboard() {
    const { data: session } = useSession()

    let firstName: string = ''

    if (session && session.user && session.user.name && session.user.email) {
        firstName = session.user.name.slice(0, session.user.name.lastIndexOf(' ') + 1)
    }

    return (
        <Box sx={{ mt: '50px', ml: '120px' }}>
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
                Recent Activity
            </Typography>
            <Divider variant="fullWidth" sx={{ mb: '40px' }} />
            <RecentActivityTable />
        </Box>
    )
}
