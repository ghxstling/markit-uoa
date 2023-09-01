'use client'
import EditCourseDetails from '@/app/components/courses/EditCourseDetails'
import Sidebar from '@/app/components/Sidebar'

export default function CreateCoursePage({ params }: { params: { courseId: string } }) {
    console.log("course id: " + params.courseId)
    return (
        <>
            <Sidebar />
            <div>
                <EditCourseDetails params={params} />
            </div>
        </>
    )
}
