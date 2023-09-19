'use client'
import EditCourseDetails from '@/app/components/courses/EditCourseDetails'
import Sidebar from '../../../../components/Sidebar'
import DynamicBreadcrumb from '@/app/components/DynamicBreadcrumb'
import { usePathname } from 'next/navigation'

export default function CreateCoursePage() {
    const pathname = usePathname()
    const courseId = pathname.split('/').pop() || ''

    return (
        <>
            {/* <Sidebar />
            <div> */}
            <div style={{ marginLeft: '300px' }}>
                <DynamicBreadcrumb />
            </div>
            <EditCourseDetails courseId={courseId} />
            {/* </div> */}
        </>
    )
}