import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useSession } from 'next-auth/react'
import DynamicBreadcrumb from '@/app/components/DynamicBreadcrumb'
import Sidebar from '@/app/components/Sidebar'
import CourseTable from '@/app/components/courses/CourseTable'

export default function AllCourseView() {
    return (
        <>
            <Box>
                <h2>Course View</h2>
                <CourseTable />
            </Box>
        </>
    )
}
