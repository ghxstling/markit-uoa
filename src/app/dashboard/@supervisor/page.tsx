'use client'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useSession } from 'next-auth/react'
import CourseTable from '@/app/components/courses/CourseTable'
import React from 'react'

export default function CSHomepage() {
    const { data: session } = useSession()

    let firstName: string = ''

    if (session && session.user && session.user.name && session.user.email) {
        firstName = session.user.name.slice(0, session.user.name.lastIndexOf(' ') + 1)
    }

    return (
        <>
            {/* <Box
                style={{
                    paddingTop: 50,
                    paddingLeft: 350,
                    paddingRight: 100,
                    marginBottom: 50,
                }}
            > */}
            <Typography sx={{ mt: '28px' }} variant="h4" fontWeight="bold">
                Welcome, {firstName}
            </Typography>
            <Button
                variant="contained"
                sx={{ backgroundColor: '#00467F', mt: '53px', mb: '58px' }}
                href="/dashboard/courses"
            >
                CREATE NEW COURSE
            </Button>
            <CourseTable />
            {/* </Box> */}
        </>
    )
}
