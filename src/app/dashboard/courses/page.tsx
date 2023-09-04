'use client'
import CourseDetails from '../../components/courses/CourseDetails'
import Sidebar from '../../components/Sidebar'
import DynamicBreadcrumb from '../../components/DynamicBreadcrumb'

export default function CreateCoursePage() {
    return (
        <>
            <Sidebar />
            <div>
                <div style={{ marginLeft: '300px' }}>
                    {' '}
                    <DynamicBreadcrumb />
                </div>
                <CourseDetails />
            </div>
        </>
    )
}
