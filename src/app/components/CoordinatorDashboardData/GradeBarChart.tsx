import React, { useEffect, useState } from 'react'
import { BarChart } from '@mui/x-charts/BarChart'
import { CircularProgress } from '@mui/material'

const palette = ['#00467f']

const chartSetting = {
    xAxis: [
        {
            label: 'Amount of Applications',
        },
    ],
    width: 650,
    height: 400,
}

export default function GradeBarChart() {
    const [applicationStats, setApplicationStats] = useState([
        { grade: 'A+', numberOfApplications: 0 },
        { grade: 'A', numberOfApplications: 0 },
        { grade: 'A-', numberOfApplications: 0 },
        { grade: 'B+', numberOfApplications: 0 },
        { grade: 'B', numberOfApplications: 0 },
        { grade: 'B-', numberOfApplications: 0 },
        { grade: 'C+', numberOfApplications: 0 },
        { grade: 'C', numberOfApplications: 0 },
        { grade: 'C-', numberOfApplications: 0 },
        { grade: 'D+', numberOfApplications: 0 },
        { grade: 'D', numberOfApplications: 0 },
        { grade: 'D-', numberOfApplications: 0 },
        { grade: 'Not Taken', numberOfApplications: 0 },
    ])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                // get all applications
                const response = await fetch('api/applications/', { method: 'GET' })
                const applicationsJson = await response.json()
                return applicationsJson
            } catch (error) {
                console.error('Error fetching data:', error)
                throw error
            }
        }

        fetchApplications()
            .then((applications) => {
                const grades = [
                    { grade: 'A+', numberOfApplications: 0 },
                    { grade: 'A', numberOfApplications: 0 },
                    { grade: 'A-', numberOfApplications: 0 },
                    { grade: 'B+', numberOfApplications: 0 },
                    { grade: 'B', numberOfApplications: 0 },
                    { grade: 'B-', numberOfApplications: 0 },
                    { grade: 'C+', numberOfApplications: 0 },
                    { grade: 'C', numberOfApplications: 0 },
                    { grade: 'C-', numberOfApplications: 0 },
                    { grade: 'D+', numberOfApplications: 0 },
                    { grade: 'D', numberOfApplications: 0 },
                    { grade: 'D-', numberOfApplications: 0 },
                    { grade: 'Not Taken Previously', numberOfApplications: 0 },
                ]

                for (const application of applications) {
                    const currentGrade = application.previouslyAchievedGrade // Handle missing grade
                    const gradeIndex = grades.findIndex((gradeData) => gradeData.grade === currentGrade)
                    if (gradeIndex !== -1) {
                        // If the grade is found in the array, update the numberOfApplications property
                        grades[gradeIndex].numberOfApplications += 1
                    }
                }

                setApplicationStats(grades)
                setIsLoading(false)
            })
            .catch((error) => {
                console.error('Error fetching data:', error)
                setIsLoading(false)
            })
    }, [])

    if (isLoading) {
        return <CircularProgress />
    }

    return (
        <BarChart
            colors={palette}
            dataset={applicationStats}
            yAxis={[{ scaleType: 'band', dataKey: 'grade' }]}
            series={[{ dataKey: 'numberOfApplications', label: 'Number of Applications' }]}
            layout="horizontal"
            xAxis={[
                {
                    label: 'Amount of Applications',
                },
            ]}
            width={650}
            height={400}
            sx={{
                '--ChartsLegend-rootOffsetX': '-50px',
                '--ChartsLegend-rootOffsetY': '-30px',
            }}
        />
    )
}
