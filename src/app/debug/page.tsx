// Used for debugging purposes only
// This is an easy way to test auth and roles for backend endpoints
'use client'
import { useState } from 'react'
import { UserStatus } from '../components/UserStatus'
import { Document, Page, pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
  ).toString();

const DebugPage = () => {
    const [apiResponse, setApiResponse] = useState(null)
    const [error, setError] = useState<string | null>(null)
    const [file, setFile] = useState<File>()
    
    const [displayFile, setDisplayFile] = useState<File>()
    const [numPages, setNumPages] = useState<number>()
    const [pageNum, setPageNum] = useState<number>(1)

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages)
    }

    const makeApiCall = async () => {
        try {
            const formData = {
                upi: "TEST123",
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

            const contentType = response.headers.get('content-type')
            let data

            if (contentType!.includes('application/pdf')) {
                data = await response.blob()
                setDisplayFile(new File([data], 'test.pdf'))
            }
            else {
                data = await response.json()
                setApiResponse(data)
            }
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
            <Document file={displayFile} onLoadSuccess={onDocumentLoadSuccess}>
                <Page pageNumber={pageNum}></Page>
            </Document>
            <p>
                Page {pageNum} of {numPages}
            </p>
            <form onSubmit={uploadFile}>
                <input
                    type="file"
                    name="file"
                    onChange={(e) => setFile(e.target.files?.[0])}
                /><input type="submit" value="Upload to Server" />
            </form>
        </div>
    )
}

export default DebugPage
