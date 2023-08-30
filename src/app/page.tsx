import Typography from '@mui/material/Typography'
import { UserStatus } from './components/UserStatus'
import Sidebar from './components/Sidebar'
import Container from '@mui/material/Container'

export default function Home() {
    return (
        <>
            <Typography variant="h1">Hello World</Typography>
            <Container maxWidth="xs">
                <UserStatus />
                <Sidebar />
            </Container>
        </>
    )
}
