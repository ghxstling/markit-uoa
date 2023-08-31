'use client'

import { Breadcrumbs, Link, Stack, Typography } from '@mui/material'
import { usePathname } from 'next/navigation'
import StarIcon from '@mui/icons-material/Star'
import NextLink from 'next/link'

const DynamicBreadcrumb = () => {
    const pathName = usePathname()

    let pathArray = pathName.split('/')
    pathArray = pathArray.filter((path) => path !== '')

    const breadcrumbs = pathArray.map((path, index) => {
        const href = '/' + pathArray.slice(0, index + 1).join('/')
        return {
            href,
            label: path.charAt(0).toUpperCase() + path.slice(1),
            isCurrent: index === pathArray.length - 1,
        }
    })

    return (
        <>
            <Stack direction={'row'} spacing={'20px'}>
                <Breadcrumbs separator="›" aria-label="breadcrumb">
                    {breadcrumbs.map((breadcrumb) => (
                        <Typography>
                            {/* <StarIcon
                                sx={{ mb: -0.2, mr: 0.5 }}
                                fontSize="inherit"
                                fill="#000000"
                            /> */}
                            <Link
                                component={NextLink}
                                href={breadcrumb.href}
                                underline="none"
                                // fontFamily={'Roboto'}
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
