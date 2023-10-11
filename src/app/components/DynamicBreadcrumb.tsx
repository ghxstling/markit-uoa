'use client'

import { Breadcrumbs, Link, Stack, Typography } from '@mui/material'
import { usePathname } from 'next/navigation'
import NextLink from 'next/link'
import path from 'path'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

const DynamicBreadcrumb = () => {
    const { data: session } = useSession()
    const pathName = usePathname()
    const [courseCode, setCourseCode] = useState('')

    let pathArray = pathName.split('/')
    pathArray = pathArray.filter((segment) => segment !== '')

    let lastIndex = pathArray.indexOf('courses')
    if (lastIndex !== undefined && lastIndex === pathArray.length - 1) {
        pathArray.splice(lastIndex, 0, 'CreateCourse')
        pathArray = pathArray.filter((segment) => segment !== 'courses')
    }

    const breadcrumbs = pathArray.map((path, index) => {
        if (path === 'courses' && session && session.role === 'coordinator') {
            const href = '/dashboard/viewAllCourses'
            return {
                href,
                label: 'ViewAllCourses',
            }
        } else if (isNaN(parseInt(path)) === false) {
            const href = '/dashboard/courses/' + path
            const fetchData = async () => {
                try {
                    const response = await fetch('/api/courses/' + path, { method: 'GET' })
                    const jsonData = await response.json()
                    return jsonData
                } catch (error) {
                    console.error('Error fetching data:', error)
                }
            }
            fetchData().then((data) => {
                setCourseCode(data.courseCode)
            })
            return {
                href,
                label: courseCode,
            }
        } else {
            const href = '/' + pathArray.slice(0, index + 1).join('/')
            return {
                href,
                label: path.charAt(0).toUpperCase() + path.slice(1),
            }
        }
    })

    return (
        <>
            <Stack direction={'row'} spacing={'20px'}>
                <Breadcrumbs separator="›" aria-label="breadcrumb">
                    {breadcrumbs.map((breadcrumb, index) => (
                        <Typography key={index}>
                            <Link
                                component={NextLink}
                                href={breadcrumb.href}
                                underline="none"
                                fontSize={'15px'}
                                color={'#000000'}
                            >
                                {breadcrumb.label}
                            </Link>
                        </Typography>
                    ))}
                </Breadcrumbs>
            </Stack>
        </>
    )
}

export default DynamicBreadcrumb
