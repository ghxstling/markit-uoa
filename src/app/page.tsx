import Typography from '@mui/material/Typography'
import Link from 'next/link'
import { UserStatus } from './components/UserStatus'
import Sidebar from './components/Sidebar'

export default function Home() {
    return (
        <>
            <Typography variant="h1">Hello World</Typography>
            <Sidebar />

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 'calc(100vh - /* Height of your other content */)',
                    marginTop: '20px',
                }}
            >
                <UserStatus />
                <Link href="/dashboard/courses">Create a New Course</Link>
            </div>
        </>
    )
}
