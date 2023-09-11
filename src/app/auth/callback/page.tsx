'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

function AuthCallback() {
    const { data: session } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (session) {
            switch (session.role) {
                case 'coordinator':
                    router.push('/coordinatorDashboard')
                    break
                case 'supervisor':
                    router.push('/courseSupervisorHomepage')
                    break
                default:
                    router.push('/studentHomepage')
                    break
            }
        }
    }, [session, router])

    return <div>Redirecting...</div>
}

export default AuthCallback
