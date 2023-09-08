'use client'
import Image from 'next/image'
import { Container, Typography } from '@mui/material'
import { SignInButton } from './components/SignInButton'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

function LandingPage() {
    const [loaded, setLoaded] = useState(false)
    const { data: session } = useSession()
    const router = useRouter()

    useEffect(() => {
        setLoaded(true)
    }, [])

    useEffect(() => {
        // If the user is already signed in, redirect to the dashboard.
        if (session) {
            router.push('/courseSupervisorHomepage')
        }
    }, [session, router])

    if (session) return null

    return (
        <div
            style={{
                position: 'relative',
                width: '100vw',
                height: '100vh',
                overflow: 'hidden',
                margin: 0,
                padding: 0,
                backgroundColor: 'white',
            }}
        >
            <div
                style={{
                    opacity: loaded ? 1 : 0,
                    transition: 'opacity 0.8s ease-in-out',
                    position: 'absolute',
                    width: '65%',
                    height: '100%',
                    overflow: 'hidden',
                    right: 0,
                    maskImage:
                        'linear-gradient(to right, transparent, white 80%, white)',
                    WebkitMaskImage:
                        'linear-gradient(to right, transparent, white 80%, white)',
                }}
            >
                <Image
                    src="/landingPage.jpg"
                    alt="Landing Page Image"
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                />
            </div>

            <Container
                style={{
                    position: 'absolute',
                    left: '5%',
                    top: '25%',
                    width: '38%',
                }}
            >
                <Typography
                    variant="h3"
                    style={{
                        opacity: loaded ? 1 : 0,
                        transition: 'opacity 1.3s ease-in-out',
                        fontSize: '95px',
                        //fontWeight: 'bold',
                    }}
                    gutterBottom
                >
                    MarkIt-UoA
                </Typography>
                <Typography
                    variant="h5"
                    style={{
                        opacity: loaded ? 1 : 0,
                        transition: 'opacity 1.7s ease-in-out',
                        fontSize: '26px',
                        marginBottom: '30px',
                    }}
                >
                    Simplifying the marker application process for you.
                </Typography>
                <SignInButton
                    style={{
                        opacity: loaded ? 1 : 0,
                        transition: 'opacity 2.5s ease-in-out',
                        transform: `scale(${loaded ? 1 : 0.95})`,
                    }}
                />
            </Container>
        </div>
    )
}

export default LandingPage
