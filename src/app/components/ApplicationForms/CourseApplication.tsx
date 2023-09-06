import { Button, Typography } from '@mui/material'
import React from 'react'

const CourseApplication = ({ application, updateApplication, removeCourseApplication }) => {
    const thisApplicationId = application.id
    const thisApplicationData = application.data

    const handleDataChange = (updatedData: any) => {
        const updatedApplication = {
            id: thisApplicationId,
            data: updatedData,
        }
    }

    return (
        <>
            <Typography variant="subtitle2">Course Application Here</Typography>
            <Button onClick={() => removeCourseApplication(thisApplicationId)}>Remove Application</Button>
        </>
    )
}

export default CourseApplication
