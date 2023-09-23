// Used for debugging purposes only
// This is an easy way to test auth and roles for backend endpoints
'use client'
import { useState } from 'react'
import { UserStatus } from '../components/UserStatus'

const DebugPage = () => {
    const [apiResponse, setApiResponse] = useState(null)
    const [error, setError] = useState<string | null>(null)
    const [file, setFile] = useState<File>()

    const makeApiCall = async () => {
        // Use this variable for sending relevant data to API
        const formData = {
            courseCode: 'updated test course',
            courseDescription: 'fngdsljkghsdfghjg this is a test course for feature/kan-120',
            numOfEstimatedStudents: 100,
            numOfEnrolledStudents: 10,
            markerHours: 10,
            markerResponsibilities: 'dont just mark shit',
            needMarkers: false,
            markersNeeded: 10,
            semester: '2030S1',
        }

        try {
            const formData = {
                upi: 'TEST123',
                AUID: 123456789,
                currentlyOverseas: false,
                citizenOrPermanentResident: true,
                workVisa: true,
                degree: 'Masters',
                degreeYears: 1,
                workHours: 10,
            }
            const response = await fetch('/api/students/me/transcript', {
                method: 'GET',
                // headers: {
                //     'Content-Type': 'application/json',
                // },
                // body: JSON.stringify(formData)
            })

            const data = await response.json()
            setApiResponse(data)
            setError(null)
        } catch (err) {
            setError('Error fetching data from the API')
            setApiResponse(null)
        }
    }

    const uploadFile = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!file) return
        try {
            const data = new FormData()
            data.set('file', file)
            const res = await fetch('/api/students/me/transcript', {
                method: 'POST',
                body: data,
            })
            setApiResponse(await res.json())
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
            <form onSubmit={uploadFile}>
                <input type="file" name="file" onChange={(e) => setFile(e.target.files?.[0])} />
                <input type="submit" value="Upload to Server" />
            </form>
        </div>
    )
}

export default DebugPage
