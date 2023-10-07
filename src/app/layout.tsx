import './globals.css'
import type { Metadata } from 'next'
import { NextAuthProvider } from './providers'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'MarkIt UOA',
    description: 'Apply for marking positions at the University of Auckland',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <NextAuthProvider>{children}</NextAuthProvider>
            </body>
        </html>
    )
}
