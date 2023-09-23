'use client'
import CourseDetails from '@/app/components/courses/CourseDetails'
import Sidebar from '../../../components/Sidebar'
import DynamicBreadcrumb from '@/app/components/DynamicBreadcrumb'

export default function CreateCoursePage() {
    return (
        <>
            {/* <Sidebar />
            <div> */}
            <div>
                <DynamicBreadcrumb />
            </div>
            <CourseDetails />
            {/* </div> */}
        </>
    )
}
