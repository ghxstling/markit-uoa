import {
    Box,
    Button,
    Grid,
    TextField,
    Typography,
    Snackbar,
} from '@mui/material'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import MuiAlert, { AlertProps } from '@mui/material/Alert'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const PersonalDetails = () => {
    const [openSnackBar, setOpenSnackBar] = useState(false)

    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === 'clickaway') {
            return
        }

        setOpenSnackBar(false)
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)

        const studentID = data.get('studentID') as string

        // Check if the length of the studentID is not 9, show error message
        if (studentID.length !== 9) {
            setOpenSnackBar(true)
            return
        }

        console.log({
            name: data.get('name'),
            upi: data.get('upi'),
            studentID: studentID,
            email: data.get('email'),
        })
    }

    const { data: session } = useSession()

    let name: string = ''
    let upi: string = ''
    let email: string = ''

    if (session && session.user && session.user.name && session.user.email) {
        name = session.user.name
        email = session.user.email
        upi = email.slice(0, 7)
    }

    return (
        <>
            <Typography component="h1" variant="h5" fontWeight="bold">
                Personal Details
            </Typography>
            <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 3 }}
            >
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            name="name"
                            required
                            fullWidth
                            id="name"
                            label="Full Name"
                            autoFocus
                            value={name}
                            disabled
                        />
                        <input type="hidden" name="name" value={name} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="upi"
                            required
                            fullWidth
                            id="upi"
                            label="UPI"
                            autoFocus
                            value={upi}
                            disabled
                        />
                        <input type="hidden" name="upi" value={upi} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="email"
                            required
                            type="email"
                            fullWidth
                            id="email"
                            label="Email Address"
                        />
                        <input type="hidden" name="email" value={email} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            name="studentID"
                            label="Student ID"
                            id="studentID"
                            type="number"
                        />
                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Submit Details
                </Button>
            </Box>
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={openSnackBar}
                autoHideDuration={6000}
                onClose={handleClose}
            >
                <Alert
                    onClose={handleClose}
                    severity="error"
                    sx={{ width: '100%' }}
                >
                    Please enter 9 digits for your student ID
                </Alert>
            </Snackbar>
        </>
    )
}

export default PersonalDetails
