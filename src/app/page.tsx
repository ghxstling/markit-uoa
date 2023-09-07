'use client'
import Image from 'next/image'
import { Container, Typography } from '@mui/material'
import { SignInButton } from './components/SignInButton'
import { useEffect, useState } from 'react'

function LandingPage() {
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        setLoaded(true)
    }, [])

    return (
        <div
            style={{
                position: 'relative',
                width: '100vw',
                height: '100vh',
                overflow: 'hidden',
                margin: 0,
                padding: 0,
            }}
        >
            <div
                style={{
                    opacity: loaded ? 1 : 0,
                    transition: 'opacity 0.5s ease-in-out',
                    position: 'absolute',
                    width: '60%',
                    height: '100%',
                    overflow: 'hidden',
                    left: 0,
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
                    right: '5%',
                    top: '25%',
                    width: '35%',
                }}
            >
                <Typography
                    variant="h1"
                    style={{
                        opacity: loaded ? 1 : 0,
                        transition: 'opacity 1s ease-in-out',
                        fontSize: '85px',
                        fontWeight: 'bold',
                    }}
                    gutterBottom
                >
                    MarkIt-UoA
                </Typography>
                <Typography
                    variant="h5"
                    style={{
                        opacity: loaded ? 1 : 0,
                        transition: 'opacity 1.5s ease-in-out',
                        fontSize: '26px',
                        marginBottom: '30px',
                    }}
                >
                    Simplifying the marker application process for you.
                </Typography>
                <SignInButton
                    style={{
                        opacity: loaded ? 1 : 0,
                        transition: 'opacity 2s ease-in-out',
                        transform: `scale(${loaded ? 1 : 0.95})`,
                    }}
                />
            </Container>
        </div>
    )
}

export default LandingPage
