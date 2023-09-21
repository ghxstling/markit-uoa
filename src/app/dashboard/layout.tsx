'use client'

import { Box, Stack } from '@mui/material'
import Sidebar from '../components/Sidebar'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function dashboardLayout(props: {
    children: React.ReactNode
    coordinator: React.ReactNode
    supervisor: React.ReactNode
    student: React.ReactNode
}) {
    const { data: session } = useSession()

    if (session) {
        switch (session.role) {
            case 'coordinator':
                return (
                    <>
                        <Stack direction={'row'}>
                            <Box sx={{ width: '15rem' }}>
                                <Sidebar />
                            </Box>
                            <Box sx={{ mt: '50px', ml: '96px' }}>{props.coordinator}</Box>
                        </Stack>
                    </>
                )
            case 'supervisor':
                return <>{props.supervisor}</>
            case 'student':
                return <>{props.student}</>
        }
    }
}
