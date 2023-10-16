'use client'

import React, { useState } from 'react'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import {
    Alert,
    Box,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Snackbar,
} from '@mui/material'
import Sidebar from '@/app/components/Sidebar'
import CoursePieChart from '@/app/components/CoordinatorDashboardData/CoursePieChart'
import CustomTheme from '@/app/CustomTheme'
import { ThemeProvider } from '@mui/material/styles'
import GradeBarChart from '@/app/components/CoordinatorDashboardData/GradeBarChart'
import ChartsContainer from '@/app/components/CoordinatorDashboardData/ChartsContainer'
import { LoadingButton } from '@mui/lab'
import SaveIcon from '@mui/icons-material/Save'
import EmailIcon from '@mui/icons-material/Email'

export default function CoordinatorDashboard() {
    const { data: session } = useSession()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isLoadingEmail, setIsLoadingEmail] = useState<boolean>(false)
    const [open, setOpen] = useState(false)
    const [openSuccessSnackBar, setOpenSuccessSnackBar] = useState(false)
    const [openFailureSnackbar, setOpenFailureSnackbar] = useState(false)

    const handleFailureClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }

        setOpenFailureSnackbar(false)
    }

    const handleCloseSuccess = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }
        setOpenSuccessSnackBar(false)
    }

    const fetchAllApplications = async () => {
        setIsLoading(true)
        try {
            await fetch('/api/applications/csv', {
                method: 'GET',
                headers: {
                    'Content-Type': 'text/csv; charset=utf-8',
                },
            })
                .then((res) => res.blob())
                .then((blob) => {
                    let file = window.URL.createObjectURL(blob)
                    window.location.assign(file)
                    setIsLoading(false)
                })
        } catch (error) {
            console.error('Error fetching data:', error)
            setIsLoading(false)
        }
    }

    const submitEmail = async () => {
        setIsLoadingEmail(true)
        try {
            const response = await fetch('/api/email', {
                method: 'POST',
            })
            if (response.ok) {
                setOpenSuccessSnackBar(true)
            } else {
                setOpenFailureSnackbar(true)
            }
            setIsLoadingEmail(false)
        } catch (error) {
            console.error('Error fetching data:', error)
            setIsLoadingEmail(false)
        }
    }

    const openDialog = () => {
        setOpen(true)
    }

    const closeDialog = () => {
        setOpen(false)
    }

    let firstName: string = ''

    if (session && session.user && session.user.name && session.user.email) {
        firstName = session.user.name.slice(0, session.user.name.lastIndexOf(' ') + 1)
    }

    return (
        <ThemeProvider theme={CustomTheme}>
            <Sidebar />
            <Box
                sx={{
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'safe center',
                    ml: '240px',
                }}
            >
                <Box
                    sx={{
                        mt: '20px',
                        ml: { sm: '60px', lg: '120px' },
                        mr: { sm: '25px', lg: '50px' },
                        mb: '20px',
                    }}
                >
                    <Typography sx={{ mt: '28px', mb: '53px' }} variant="h4" fontWeight="bold">
                        Welcome, {firstName}
                    </Typography>
                    <Box display="flex">
                        <Link href="/dashboard/viewAllCourses" passHref>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: '#00467F',
                                    mr: 2,
                                }}
                            >
                                VIEW ALL COURSES
                            </Button>
                        </Link>
                        <LoadingButton
                            loading={isLoadingEmail}
                            loadingPosition="start"
                            startIcon={<EmailIcon />}
                            variant="contained"
                            sx={{
                                backgroundColor: '#00467F',
                            }}
                            onClick={openDialog}
                        >
                            SEND EMAIL
                        </LoadingButton>
                    </Box>
                    <Typography variant="h5" fontWeight="bold" sx={{ mt: '58px' }}>
                        Statistics
                    </Typography>
                    <Divider variant="fullWidth" sx={{ mb: '20px' }} />
                    <ChartsContainer />
                    <LoadingButton
                        loading={isLoading}
                        loadingPosition="start"
                        startIcon={<SaveIcon />}
                        fullWidth={true}
                        variant="contained"
                        sx={{
                            backgroundColor: '#00467F',
                        }}
                        onClick={fetchAllApplications}
                    >
                        Download Applications as CSV
                    </LoadingButton>
                </Box>
                <Dialog
                    open={open}
                    onClose={closeDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{'Confirm Email'}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to send an email confirming hours?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeDialog} color="primary">
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                closeDialog()
                                submitEmail()
                            }}
                            color="primary"
                            autoFocus
                        >
                            Yes, Send Email
                        </Button>
                    </DialogActions>
                </Dialog>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    open={openFailureSnackbar}
                    autoHideDuration={6000}
                    onClose={handleFailureClose}
                >
                    <Alert onClose={handleFailureClose} severity="error" sx={{ width: '100%' }}>
                        Failed to send email, please try again later.
                    </Alert>
                </Snackbar>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    open={openSuccessSnackBar}
                    autoHideDuration={6000}
                    onClose={handleCloseSuccess}
                >
                    <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
                        Email successfully sent!
                    </Alert>
                </Snackbar>
            </Box>
        </ThemeProvider>
    )
}
