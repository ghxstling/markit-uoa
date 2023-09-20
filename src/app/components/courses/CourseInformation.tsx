import { Box, Typography, Button, Dialog } from '@mui/material'
import React, { useState } from 'react'
import { Card } from '@mui/material'
import Link from 'next/link'
import EditCourseDetails from './EditCourseDetails'

type CourseInformationProps = {
    courseId: string // Assuming courseId is a string
}

const CourseInformation = ({ courseId }: CourseInformationProps) => {
    const [open, setOpen] = React.useState(false)
    const [openEditCourseDetails, setOpenEditCourseDetails] = useState(false)
    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(5)
    const [isCoordinator, setIsCoordinator] = useState(false)

    const openEdit = () => {
        setOpenEditCourseDetails(true)
        setOpen(true)
    }

    const closeEdit = () => {
        setOpenEditCourseDetails(false)
    }

    const closeDialog = () => {
        setOpen(false)
    }

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    return (
        <>
            <Card>
                <Box display="flex">
                    <Typography variant="h5">Course Name</Typography>
                    <Button variant="contained" sx={{ ml: '20px' }} size="small" onClick={openEdit}>
                        Edit Course
                    </Button>
                </Box>

                {/* Table */}

                {/* Table Headers */}
            </Card>
            {openEditCourseDetails ? (
                <Dialog open={open} onClose={closeDialog} maxWidth="md" fullWidth>
                    <EditCourseDetails courseId={courseId} />
                </Dialog>
            ) : (
                <div></div>
            )}
        </>
    )
}

export default CourseInformation
