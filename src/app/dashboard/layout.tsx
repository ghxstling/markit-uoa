'use client'

import { Box, Stack } from '@mui/material'
import Sidebar from '../components/Sidebar'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardLayout(props: {
    children: React.ReactNode
    coordinator: React.ReactNode
    supervisor: React.ReactNode
    student: React.ReactNode
}) {
    const { data: session } = useSession()

    if (session) {
        switch (session.role) {
            case 'coordinator':
                return <>{props.coordinator}</>
            case 'supervisor':
                return <>{props.supervisor}</>
            case 'student':
                return <>{props.student}</>
        }
    }
}
