import { Box, Grid, TextField, Typography } from '@mui/material'
import { useSession } from 'next-auth/react'
import React from 'react'
import { IFormValues } from '@/app/types/IFormValues'

interface PersonalDetailsProps {
    formValues: IFormValues
    setFormValues: React.Dispatch<React.SetStateAction<IFormValues>>
}

const PersonalDetails: React.FC<PersonalDetailsProps> = ({ formValues, setFormValues }) => {
    const handleAuidChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (
            (/^\d+$/.test(event.target.value) === true || event.target.value === '') &&
            (event.target.value as string).length <= 9
        ) {
            setFormValues({ ...formValues, AUID: event.target.value as string })
        }
    }

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({ ...formValues, email: event.target.value })
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
            <Box component="form" noValidate sx={{ mt: 3 }}>
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
                        <input type="hidden" name="name" value={formValues.name} />
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
                        <input type="hidden" name="upi" value={formValues.upi} />
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
            </Box>
        </>
    )
}

export default PersonalDetails
