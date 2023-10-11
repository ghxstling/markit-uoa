import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { headers } from 'next/headers'

export default function Page404() {
    const headersList = headers()
    const images = [
        '/1588108312438.jpg',
        '/1635775297990.png',
        '/1635775235997.png',
        '/1635775108030.png',
        '/1635775045217.png',
        '/1622585370816.png',
    ]
    const textcolor = ['#6C73A7', '#A1ECA9', '#6F6563', '#960B2B', '#000000', '#AD847B']
    const randomIndex = Math.floor(Math.random() * images.length)
    const randomImage = images[randomIndex]
    const randomTextColor = textcolor[randomIndex]

    return (
        <>
            <div>
                <Image
                    src={randomImage}
                    alt="Landing Page Image"
                    quality={100}
                    layout="fill"
                    style={{
                        display: 'flex',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                />
            </div>
            <div
                style={{
                    position: 'absolute',
                    top: '15%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    color: randomTextColor,
                    backgroundColor: '#fff',
                    padding: '5px 20px 20px 20px',
                    borderRadius: '10px',
                }}
            >
                <h1>ERROR 404</h1>
                <h2>Not Found</h2>
                <p>Could not find the requested resource</p>
                <Link href="/">Return Home</Link>
            </div>
        </>
    )
}
