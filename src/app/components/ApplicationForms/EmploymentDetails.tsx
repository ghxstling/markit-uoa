import {
    Box,
    Grid,
    TextField,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
    MenuItem,
    Slider,
    Input,
    Snackbar,
} from '@mui/material'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import React, { useState } from 'react'
import { IFormValues } from '@/types/IFormValues'

interface EmploymentDetailsProps {
    formValues: IFormValues
    setFormValues: React.Dispatch<React.SetStateAction<IFormValues>>
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const EmploymentDetails: React.FC<EmploymentDetailsProps> = ({ formValues, setFormValues }) => {
    const [openSnackBar, setOpenSnackBar] = useState(false)

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }

        setOpenSnackBar(false)
    }

    const handleDegreeSliderChange = (event: Event, newValue: number | number[]) => {
        setFormValues({
            ...formValues,
            degreeYears: newValue as number,
        })
    }

    const handleDegreeYearsInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({
            ...formValues,
            degreeYears: Math.min(event.target.value === '' ? 1 : Number(event.target.value), 10),
        })
    }

    const handleWorkHoursSliderChange = (event: Event, newValue: number | number[]) => {
        setFormValues({ ...formValues, workHours: newValue as number })
    }

    const handleWorkHoursInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({
            ...formValues,
            workHours: Math.min(event.target.value === '' ? 1 : Number(event.target.value), 30),
        })
    }

    const handleDegreeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({
            ...formValues,
            degree: event.target.value,
        })
    }

    const handleResidencyChange = (event: any) => {
        setFormValues({
            ...formValues,
            citizenOrPermanentResident: event.target.value,
        })
    }

    const handleOverseasChange = (event: any) => {
        setFormValues({ ...formValues, currentlyOverseas: event.target.value })
    }

    const handleWorkVisaChange = (event: any) => {
        setFormValues({ ...formValues, workVisa: event.target.value })
    }

    const degreeYearMarks = [
        {
            value: 1,
            label: '1',
        },
        {
            value: 10,
            label: '10',
        },
    ]

    const workHoursMarks = [
        {
            value: 1,
            label: '1',
        },
        {
            value: 30,
            label: '30',
        },
    ]

    return (
        <>
            <Typography component="h1" variant="h5" fontWeight="bold">
                Employment Details
            </Typography>
            <Box component="form" noValidate sx={{ mt: 3 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Grid container direction="column" spacing={0} justifyContent="center" alignItems="center">
                            <Grid item>
                                <Typography>Are you currently living overseas?</Typography>
                            </Grid>
                            <Grid item>
                                <RadioGroup
                                    value={formValues.currentlyOverseas}
                                    row
                                    name="overseas"
                                    id="overseas"
                                    onChange={handleOverseasChange}
                                >
                                    <Grid container spacing={4}>
                                        <Grid item>
                                            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                                        </Grid>
                                        <Grid item>
                                            <FormControlLabel value="No" control={<Radio />} label="No" />
                                        </Grid>
                                    </Grid>
                                </RadioGroup>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container direction="column" spacing={0} justifyContent="center" alignItems="center">
                            <Grid item>
                                <Typography>Are you a citizen or permanent resident?</Typography>
                            </Grid>
                            <Grid item>
                                <RadioGroup
                                    value={formValues.citizenOrPermanentResident}
                                    row
                                    name="permenantResident"
                                    id="permenantResident"
                                    onChange={handleResidencyChange}
                                >
                                    <Grid container spacing={4}>
                                        <Grid item>
                                            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                                        </Grid>
                                        <Grid item>
                                            <FormControlLabel value="No" control={<Radio />} label="No" />
                                        </Grid>
                                    </Grid>
                                </RadioGroup>
                            </Grid>
                        </Grid>
                    </Grid>
                    {formValues.citizenOrPermanentResident === 'No' && (
                        <>
                            <Grid item xs={12}>
                                <Grid
                                    container
                                    direction="column"
                                    spacing={0}
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    <Grid item>
                                        <Typography textAlign="center">
                                            If you are not a citizen/permanent resident, do you have a valid work visa?
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <RadioGroup
                                            value={formValues.workVisa}
                                            row
                                            name="workVisa"
                                            id="workVisa"
                                            onChange={handleWorkVisaChange}
                                        >
                                            <Grid container spacing={4}>
                                                <Grid item>
                                                    <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                                                </Grid>
                                                <Grid item>
                                                    <FormControlLabel value="No" control={<Radio />} label="No" />
                                                </Grid>
                                            </Grid>
                                        </RadioGroup>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </>
                    )}

                    <Grid item xs={12}>
                        <TextField
                            name="degree"
                            id="degree"
                            label="Degree"
                            select
                            value={formValues.degree}
                            onChange={handleDegreeChange}
                            fullWidth
                            required
                        >
                            <MenuItem value={'Bachelors'}>Bachelors</MenuItem>
                            <MenuItem value={'Post Graduate'}>Post Graduate</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container direction="column" spacing={0} justifyContent="center" alignItems="center">
                            <Grid item>
                                <Typography gutterBottom>How many years into this degree are you?</Typography>
                            </Grid>

                            <Grid item>
                                <Input
                                    name="degreeYears"
                                    id="degreeYears"
                                    value={formValues.degreeYears}
                                    size="small"
                                    onChange={handleDegreeYearsInputChange}
                                    inputProps={{
                                        step: 1,
                                        min: 1,
                                        max: 10,
                                        type: 'number',
                                        'aria-labelledby': 'input-slider',
                                    }}
                                    sx={{ ml: '20px' }}
                                />
                            </Grid>

                            <Grid item>
                                <Slider
                                    value={formValues.degreeYears}
                                    onChange={handleDegreeSliderChange}
                                    aria-labelledby="degree-years-slider"
                                    min={1}
                                    max={10}
                                    sx={{ width: '400px', ml: '15px' }}
                                    marks={degreeYearMarks}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container direction="column" spacing={0} justifyContent="center" alignItems="center">
                            <Grid item xs={12}>
                                <Typography gutterBottom>
                                    What is the maximum number of hours per week you can work?
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Input
                                    name="workHours"
                                    id="workHours"
                                    value={formValues.workHours}
                                    size="small"
                                    onChange={handleWorkHoursInputChange}
                                    inputProps={{
                                        step: 1,
                                        min: 1,
                                        max: 30,

                                        type: 'number',
                                        'aria-labelledby': 'input-slider',
                                    }}
                                    sx={{ ml: '20px' }}
                                />
                            </Grid>
                            <Grid item>
                                <Slider
                                    value={formValues.workHours}
                                    onChange={handleWorkHoursSliderChange}
                                    aria-labelledby="degree-years-slider"
                                    min={1}
                                    max={30}
                                    sx={{ width: '400px', ml: '15px' }}
                                    marks={workHoursMarks}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={openSnackBar}
                autoHideDuration={6000}
                onClose={handleClose}
            >
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    Please enter your degree type
                </Alert>
            </Snackbar>
        </>
    )
}

export default EmploymentDetails
