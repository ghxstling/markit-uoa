'use client'

import { Breadcrumbs, Link, Stack, Typography } from '@mui/material'
import { usePathname } from 'next/navigation'
import NextLink from 'next/link'
import path from 'path'

const DynamicBreadcrumb = () => {
    const pathName = usePathname()

    let pathArray = pathName.split('/')
    pathArray = pathArray.filter((segment) => segment !== '')
    let index = pathArray.indexOf('courses')
    if (index !== undefined && index === pathArray.length - 1) {
        pathArray.splice(index, 0, 'CreateCourse')
    }

    pathArray = pathArray.filter((segment) => segment !== 'courses')

    const breadcrumbs = pathArray.map((path, index) => {
        console.log(path)
        if (path === 'CreateCourse') {
            const href = '/' + pathArray.slice(0, index).join('/') + '/courses'
            return {
                href,
                label: 'CreateCourse',
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
