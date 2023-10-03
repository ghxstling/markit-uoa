import { PieChart } from '@mui/x-charts/PieChart'
import { useEffect, useState } from 'react'

interface Course {
    id: number
    courseCode: string
    courseDescription: string
    numOfEstimatedStudents: number
    numOfEnrolledStudents: number
    markerHours: number
    markerResponsibilities: string
    needMarkers: boolean
    markersNeeded: number
    semester: string
}

interface ChartData {
    id: number
    value: number
    label: string
}

export default function CoursePieChart() {
    const [applicationStats, setApplicationStats] = useState<ChartData[]>([])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            // get all courses
            const response = await fetch('/api/courses', { method: 'GET' })
            const coursesJson = await response.json()
            for (let course in coursesJson) {
                console.log(coursesJson[course])
                let courseId = coursesJson[course].id.toString()
                try {
                    // get all applications for each course based on courseId (PK)
                    const response = await fetch('/api/courses/' + courseId + '/applications', { method: 'GET' })
                    const applicationsJson = await response.json()
                    setApplicationStats((prev) => [
                        ...prev,
                        {
                            id: coursesJson[course].id,
                            value: applicationsJson.length,
                            label: coursesJson[course].courseCode,
                        },
                    ])
                } catch (error) {
                    console.error('Error fetching data:', error)
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    return (
        <PieChart
            series={[
                {
                    data: applicationStats,
                },
            ]}
            width={700}
            height={500}
        />
    )
}
