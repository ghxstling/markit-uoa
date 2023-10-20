// Used for debugging purposes only
// This is an easy way to test auth and roles for backend endpoints
'use client'
import { useState } from 'react'
import { UserStatus } from '../components/UserStatus'
import { DegreeType } from '@/models/degreeType'

const DebugPage = () => {
    const [apiResponse, setApiResponse] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [file, setFile] = useState<File>()

    const makeApiCall = async () => {
        setApiResponse('Waiting for response...')
        try {
            // const data = {
            //     sourceSemester: '2030S1',
            //     targetSemester: '2020S1',
            // }
            const res = await fetch('/api/email', {
                method: 'POST',
                // headers: {
                //     'Content-Type': 'application/json',
                // },
                // body: JSON.stringify(data)
            })
            setApiResponse(await res.json())
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
            const res = await fetch('/api/students/me/cv', {
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
            <a href='/api/applications/csv' download='/api/applications/csv'>
                <button>Generate CSV File!</button>
            </a>
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
