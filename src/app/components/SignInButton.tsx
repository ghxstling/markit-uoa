'use client'

import { Button } from '@mui/material'
import { signIn } from 'next-auth/react'
import { useState } from 'react'

type SignInButtonProps = {
    style?: React.CSSProperties
}

export function SignInButton(props: SignInButtonProps) {
    const { style } = props
    const [hovered, setHovered] = useState(false)

    return (
        <Button
            style={{
                width: '300px',
                height: '50px',
                backgroundColor: hovered ? '#00467F' : 'transparent',
                color: hovered ? 'white' : '#00467F',
                fontSize: '16px',
                border: '2px solid #00467F',
                ...style,
            }}
            variant="outlined"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() =>
                signIn('google', {
                    callbackUrl: '/auth/callback',
                })
            }
        >
            Get Started Here
        </Button>
    )
}
