"use client";
import CourseDetails from "./CourseDetails";
import Sidebar from "../components/Sidebar";

export default function CreateCoursePage() {
    return (
        <>
            <Sidebar />
            <div>
                <CourseDetails />
            </div>
        </>
    );
}
