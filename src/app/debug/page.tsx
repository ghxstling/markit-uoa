// Used for debugging purposes only
// This is an easy way to test auth and roles for backend endpoints
'use client'
import { useState } from 'react'

const DebugPage = () => {
    const [apiResponse, setApiResponse] = useState(null)
    const [error, setError] = useState<string | null>(null)

    const makeApiCall = async () => {
        try {
            const response = await fetch('/api/courses/1', {
                method: 'PATCH',
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
