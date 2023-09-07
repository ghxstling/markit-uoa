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
                backgroundColor: '#00467F',
                color: 'white',
                fontSize: '16px',
                textDecoration: hovered ? 'underline' : 'none',
                ...style,
            }}
            variant="contained"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => signIn('google')}
        >
            Get Started Here
        </Button>
    )
}
