import { PieChart } from '@mui/x-charts/PieChart'
import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import CustomTheme from '@/app/CustomTheme'
import { ThemeProvider } from '@mui/material/styles'
import { CircularProgress } from '@mui/material'

interface ChartData {
    id: number
    value: number
    label: string
}
// const palette = ['#07447E', '#99ACC0', '#336697', '#004382', '#10497F']
const palette = [
    '#07447E',
    '#2C5E8F',
    '#50789F',
    '#99ACC0',
    '#C5D1DC',
    '#F1F6F7',
    '#799DBD',
    '#004382',
    '#084681',
    '#10497F',
]

export default function CoursePieChart() {
    const [applicationStats, setApplicationStats] = useState<ChartData[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

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

    useEffect(() => {
        fetchCoursesData().then(async (courses) => {
            const stats: ChartData[] = []

            for (const course of courses) {
                const courseId = course.id
                const applications = course.application
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
            setIsLoading(false)
        })
    }, [])

    if (isLoading) {
        return <CircularProgress />
    }

    return (
        <ThemeProvider theme={CustomTheme}>
            <PieChart
                colors={palette}
                series={[
                    {
                        data: applicationStats,
                        outerRadius: 200,
                        paddingAngle: 0.5,
                        cornerRadius: 5,
                        cx: 250,
                        highlightScope: { faded: 'global', highlighted: 'item' },
                    },
                ]}
                sx={{
                    '--ChartsLegend-rootOffsetX': { xs: '-100px', lg: '-40px' },
                    '--ChartsLegend-rootOffsetY': '-10px',
                    '--ChartsLegend-rootSpacing': '20px',
                }}
                width={700}
                height={500}
            />
        </ThemeProvider>
    )
}
