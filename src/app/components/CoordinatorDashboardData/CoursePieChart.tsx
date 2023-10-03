import { PieChart } from '@mui/x-charts/PieChart'
import { useEffect, useState } from 'react'

interface ChartData {
    id: number
    value: number
    label: string
}

export default function CoursePieChart() {
    const [applicationStats, setApplicationStats] = useState<ChartData[]>([])

    const fetchCoursesData = async () => {
        try {
            // get all courses
            const response = await fetch('/api/courses', { method: 'GET' })
            const coursesJson = await response.json()
            return coursesJson
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    const fetchApplications = async (courseId: number) => {
        try {
            // get all applications for each course based on courseId (PK)
            const response = await fetch('/api/courses/' + courseId.toString() + '/applications', { method: 'GET' })
            const applicationsJson = await response.json()
            return applicationsJson
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    useEffect(() => {
        fetchCoursesData().then(async (courses) => {
            const stats: ChartData[] = []

            for (const course of courses) {
                const courseId = course.id
                const applications = await fetchApplications(courseId)
                const numOfApplications = applications.length
                const courseCode = course.courseCode

                const courseData = {
                    id: courseId,
                    value: numOfApplications,
                    label: courseCode,
                }

                stats.push(courseData)
            }
            stats.sort((a, b) => b.value - a.value) // sort the data in descending order
            setApplicationStats(stats.slice(0, 10)) // Update the state with the fetched data
        })
    }, [])

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
