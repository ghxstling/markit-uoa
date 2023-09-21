// Used for debugging purposes only
// This is an easy way to test auth and roles for backend endpoints
'use client'
import { useState } from 'react'
import { UserStatus } from '../components/UserStatus'

const DebugPage = () => {
    const [apiResponse, setApiResponse] = useState(null)
    const [error, setError] = useState<string | null>(null)

    const makeApiCall = async () => {
        // Use this variable for sending relevant data to API
        const formData = {
            courseCode: "updated test course",
            courseDescription: "fngdsljkghsdfghjg this is a test course for feature/kan-120",
            numOfEstimatedStudents: 100,
            numOfEnrolledStudents: 10,
            markerHours: 10,
            markerResponsibilities: "dont just mark shit",
            needMarkers: false,
            markersNeeded: 10,
            semester: "2030S1",
        }

        try {
            const response = await fetch('/api/courses/101', {
                method: 'PATCH',
                // If method is POST or PATCH, headers and body are required
                // Otherwise, both can be commented out
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            const data = await response.json()
            setApiResponse(data)
            setError(null)
        } catch (err) {
            setError('Error fetching data from the API')
            setApiResponse(null)
        }
    }

    return (
        <div>
            <h1>Debug Page - API Calls</h1>
            <UserStatus />
            <button onClick={makeApiCall}>Make API Call</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {apiResponse && (
                <pre>
                    <code>{JSON.stringify(apiResponse, null, 2)}</code>
                </pre>
            )}
        </div>
    )
}

export default DebugPage
