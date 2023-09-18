import React from "react";
import Image from 'next/image'

export default function Page404(){


    return(
        <div>
            <Image
                src="/1588108312438.jpg"
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
    )
}