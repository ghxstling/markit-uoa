'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { CircularProgress, LinearProgress, Typography, Box, Container } from '@mui/material'

function AuthCallback() {
    const { data: session } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (session) {
            router.push('/dashboard')
        }
    }, [session, router])

    return (
        <>
            <Container
                maxWidth={false}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    height: '65vh',
                    textAlign: 'center',
                    maxWidth: '15vw',
                }}
            >
                <Typography variant="overline" fontSize={'1vw'} align="center" gutterBottom>
                    Redirecting...
                </Typography>
                <LinearProgress
                    sx={{
                        height: '0.25vw',
                    }}
                />
            </Container>
        </>
    )
}

export default AuthCallback
