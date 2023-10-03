import { PieChart } from '@mui/x-charts/PieChart'
import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'

interface ChartData {
    id: number
    value: number
    label: string
}
const palette = ['#07447E', '#99ACC0', '#336697', '#004382', '#10497F']

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
            const domNode = document.getElementById('loading')
            domNode?.parentNode?.removeChild(domNode)
        })
    }, [])

    return (
        <>
            <PieChart
                colors={palette}
                series={[
                    {
                        data: applicationStats,
                        outerRadius: 200,
                        paddingAngle: 0.5,
                        cornerRadius: 5,
                        cx: 200,
                        highlightScope: { faded: 'global', highlighted: 'item' },
                    },
                ]}
                sx={{
                    '--ChartsLegend-rootOffsetX': '-40px',
                    '--ChartsLegend-rootOffsetY': '-10px',
                    '--ChartsLegend-rootSpacing': '20px',
                }}
                width={700}
                height={500}
            />
        </>
    )
}
