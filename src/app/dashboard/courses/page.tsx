'use client'
import CourseDetails from '../../components/courses/CourseDetails'
import Sidebar from '../../components/Sidebar'
import DynamicBreadcrumb from '../../components/DynamicBreadcrumb' // Importing the DynamicBreadcrumb component

export default function CreateCoursePage() {
    return (
        <>
            <Sidebar />
            <div>
                <div style={{ marginLeft: '300px' }}>
                    {' '}
                    {/* Add some left margin */}
                    <DynamicBreadcrumb />
                </div>
                <CourseDetails />
            </div>
        </>
    )
}
