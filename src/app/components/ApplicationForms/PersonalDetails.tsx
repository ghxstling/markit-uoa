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
import validator from 'validator'
import { IFormValues } from '@/app/interfaces/FormValues'

interface PersonalDetailsProps {
    formValues: IFormValues
    setFormValues: React.Dispatch<React.SetStateAction<IFormValues>>
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const PersonalDetails: React.FC<PersonalDetailsProps> = ({
    formValues,
    setFormValues,
}) => {
    const [snackbarMessage, setSnackbarMessage] = useState(
        'Please enter 9 digits for your student ID'
    )
    const [openSnackBar, setOpenSnackBar] = useState(false)

    const handleAuidChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (
            (/^\d+$/.test(event.target.value) === true ||
                event.target.value === '') &&
            (event.target.value as string).length <= 9
        ) {
            setFormValues({ ...formValues, AUID: event.target.value as string })
        }
    }

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({ ...formValues, email: event.target.value })
    }

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

        const studentID = data.get('AUID') as string

        if (validator.isEmail(data.get('email') as string) === false) {
            setSnackbarMessage('Please enter a valid email address')
            setOpenSnackBar(true)
            return
        }

        // Check if the length of the studentID is not 9, show error message
        else if (studentID.length !== 9) {
            setSnackbarMessage('Please enter 9 digits for your student ID')
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

    let fullName: string = ''
    let formUpi: string = ''

    if (session && session.user && session.user.name && session.user.email) {
        fullName = session.user.name
        formUpi = session.user.email.slice(0, 7)
        if (fullName !== formValues.name && formUpi !== formValues.upi) {
            setFormValues({ ...formValues, name: fullName, upi: formUpi })
        }
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
                            value={formValues.name}
                            disabled
                        />
                        <input
                            type="hidden"
                            name="name"
                            value={formValues.name}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="upi"
                            required
                            fullWidth
                            id="upi"
                            label="UPI"
                            autoFocus
                            value={formValues.upi}
                            disabled
                        />
                        <input
                            type="hidden"
                            name="upi"
                            value={formValues.upi}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="email"
                            required
                            type="email"
                            fullWidth
                            id="email"
                            label="Preferred Email Address"
                            value={formValues.email}
                            onChange={handleEmailChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            name="AUID"
                            label="Student ID"
                            id="AUID"
                            value={formValues.AUID}
                            onChange={handleAuidChange}
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
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    )
}

export default PersonalDetails
