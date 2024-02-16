'use client'
import { useSession } from 'next-auth/react'
import { ThemeProvider } from 'react-bootstrap'
import CustomTheme from '../CustomTheme'
import Sidebar from '../components/Sidebar'

export default function DashboardLayout(props: {
    children: React.ReactNode
    coordinator: React.ReactNode
    supervisor: React.ReactNode
    student: React.ReactNode
}) {
    const { data: session } = useSession()
    if (session) {
        return (
            <ThemeProvider theme={CustomTheme}>
                <Sidebar />
                {session.role === 'coordinator' ? (
                    <>{props.coordinator}</>
                ) : session.role === 'supervisor' ? (
                    <>{props.supervisor}</>
                ) : (
                    <>{props.student}</>
                )}
            </ThemeProvider>
        )
    }
}
