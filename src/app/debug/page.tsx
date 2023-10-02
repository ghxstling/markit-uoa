// Used for debugging purposes only
// This is an easy way to test auth and roles for backend endpoints
'use client'
import { useState } from 'react'
import { UserStatus } from '../components/UserStatus'
import { DegreeType } from '@/models/degreeType'

const DebugPage = () => {
    const [apiResponse, setApiResponse] = useState(null)
    const [error, setError] = useState<string | null>(null)
    const [file, setFile] = useState<File>()

    const makeApiCall = async () => {
        try {
            const data = [{"id":256,"applicationStatus":"pending","allocatedHours":5,"preferenceId":2,"student":{"id":294,"userId":399,"preferredEmail":"agra218@aucklanduni.ac.nz","upi":"agra218","auid":430843672,"overseas":false,"overseasStatus":null,"residencyStatus":true,"validWorkVisa":null,"degreeType":"phd","degreeYear":1,"maxWorkHours":15,"otherContracts":false,"otherContractsDetails":null,"CV":"CV.pdf","academicTranscript":"Academic Transcript.pdf"},"studentId":294,"course":{"id":144,"courseCode":"COMPSCI 316","courseDescription":"Cyber Security","numOfEstimatedStudents":1006,"numOfEnrolledStudents":1382,"markerHours":136,"markerResponsibilities":"Omnis repellat deleo. Speculum tamdiu cruciamentum. Subvenio animus vociferor illo alioqui aeger. Solitudo odio vulnus.","needMarkers":false,"markersNeeded":16,"semester":"2024S1","modifiedAt":"2023-10-02T11:44:38.535Z"},"courseId":144,"hasCompletedCourse":true,"previouslyAchievedGrade":"D","hasTutoredCourse":true,"hasMarkedCourse":true,"notTakenExplanation":null,"equivalentQualification":null},{"id":327,"applicationStatus":"pending","allocatedHours":5,"preferenceId":2,"student":{"id":188,"userId":192,"preferredEmail":"bcum591@aucklanduni.ac.nz","upi":"bcum591","auid":633718771,"overseas":false,"overseasStatus":null,"residencyStatus":true,"validWorkVisa":null,"degreeType":"phd","degreeYear":7,"maxWorkHours":21,"otherContracts":false,"otherContractsDetails":null,"CV":"CV.pdf","academicTranscript":"Academic Transcript.pdf"},"studentId":188,"course":{"id":122,"courseCode":"COMPSCI 762","courseDescription":"Foundations of Machine Learning","numOfEstimatedStudents":520,"numOfEnrolledStudents":1549,"markerHours":93,"markerResponsibilities":"Usus quia vulnero aiunt bonus talis perspiciatis et. Paens vinculum maiores clam varietas suscipio caste accendo commodo.","needMarkers":false,"markersNeeded":14,"semester":"2023S2","modifiedAt":"2023-10-02T11:43:02.621Z"},"courseId":122,"hasCompletedCourse":true,"previouslyAchievedGrade":"A-","hasTutoredCourse":false,"hasMarkedCourse":false,"notTakenExplanation":null,"equivalentQualification":"Surculus sordeo cuius. Neque illo atqui velociter caterva attonbitus. Cavus tamen cultura thymbra campana."},{"id":191,"applicationStatus":"pending","allocatedHours":5,"preferenceId":2,"student":{"id":147,"userId":151,"preferredEmail":"swis463@aucklanduni.ac.nz","upi":"swis463","auid":422016220,"overseas":false,"overseasStatus":null,"residencyStatus":true,"validWorkVisa":null,"degreeType":"phd","degreeYear":10,"maxWorkHours":25,"otherContracts":false,"otherContractsDetails":null,"CV":"CV.pdf","academicTranscript":"Academic Transcript.pdf"},"studentId":147,"course":{"id":176,"courseCode":"COMPSCI 751","courseDescription":"Advanced Topics in Database Systems","numOfEstimatedStudents":1284,"numOfEnrolledStudents":1295,"markerHours":79,"markerResponsibilities":"Attero sordeo deleo. Celer earum conspergo ipsum.","needMarkers":false,"markersNeeded":14,"semester":"2023SS","modifiedAt":"2023-10-02T11:44:38.551Z"},"courseId":176,"hasCompletedCourse":true,"previouslyAchievedGrade":"A-","hasTutoredCourse":true,"hasMarkedCourse":true,"notTakenExplanation":null,"equivalentQualification":null},{"id":254,"applicationStatus":"pending","allocatedHours":5,"preferenceId":1,"student":{"id":124,"userId":128,"preferredEmail":"erau677@aucklanduni.ac.nz","upi":"erau677","auid":726419712,"overseas":false,"overseasStatus":null,"residencyStatus":false,"validWorkVisa":true,"degreeType":"masters","degreeYear":10,"maxWorkHours":7,"otherContracts":false,"otherContractsDetails":null,"CV":"CV.pdf","academicTranscript":"Academic Transcript.pdf"},"studentId":124,"course":{"id":49,"courseCode":"COMPSCI 720","courseDescription":"Advanced Design and Analysis of Algorithms","numOfEstimatedStudents":1637,"numOfEnrolledStudents":1866,"markerHours":65,"markerResponsibilities":"Demulceo ara provident laboriosam cultellus capto vulgivagus tempore. Trans bos amiculum.","needMarkers":true,"markersNeeded":13,"semester":"2023S1","modifiedAt":"2023-10-02T11:27:37.631Z"},"courseId":49,"hasCompletedCourse":true,"previouslyAchievedGrade":"A-","hasTutoredCourse":true,"hasMarkedCourse":false,"notTakenExplanation":null,"equivalentQualification":null}]

            const res = await fetch('/api/courses/[courseId]/markers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
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
