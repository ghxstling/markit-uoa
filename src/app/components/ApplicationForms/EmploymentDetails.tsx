import {
    Box,
    Button,
    Grid,
    TextField,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
    MenuItem,
    Slider,
    Input,
} from '@mui/material'
import React, { useState } from 'react'

const EmploymentDetails = () => {
    const [permResidentSelectedValue, setPermResidentSelectedValue] =
        useState('Yes')
    const [degree, setDegree] = useState('')
    const [degreeYearsValue, setDegreeYearsValue] = React.useState(1)
    const [workHoursValue, setWorkHoursValue] = React.useState(1)

    const handleDegreeSliderChange = (
        event: Event,
        newValue: number | number[]
    ) => {
        setDegreeYearsValue(newValue as number)
    }

    const handleDegreeYearsInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setDegreeYearsValue(
            Math.min(
                event.target.value === '' ? 1 : Number(event.target.value),
                10
            )
        )
    }

    const handleWorkHoursSliderChange = (
        event: Event,
        newValue: number | number[]
    ) => {
        setWorkHoursValue(newValue as number)
    }

    const handleWorkHoursInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setWorkHoursValue(
            Math.min(
                event.target.value === '' ? 1 : Number(event.target.value),
                30
            )
        )
    }

    const handleDegreeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDegree(event.target.value as string)
    }

    const handleResidencyChange = (event: any) => {
        setPermResidentSelectedValue(event.target.value)
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)

        console.log({
            overseas: data.get('overseas'),
            citezenResidency: data.get('permenantResident'),
            workVisa: data.get('workVisa'),
            degree: data.get('degree'),
            degreeYears: data.get('degreeYears'),
            workHours: data.get('workHours'),
        })
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
            <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 3 }}
            >
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Grid
                            container
                            direction="column"
                            spacing={0}
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Grid item>
                                <Typography>
                                    Are you currently living overseas?
                                </Typography>
                            </Grid>
                            <Grid item>
                                <RadioGroup
                                    defaultValue="No"
                                    row
                                    name="overseas"
                                    id="overseas"
                                >
                                    <Grid container spacing={4}>
                                        <Grid item>
                                            <FormControlLabel
                                                value="Yes"
                                                control={<Radio />}
                                                label="Yes"
                                            />
                                        </Grid>
                                        <Grid item>
                                            <FormControlLabel
                                                value="No"
                                                control={<Radio />}
                                                label="No"
                                            />
                                        </Grid>
                                    </Grid>
                                </RadioGroup>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid
                            container
                            direction="column"
                            spacing={0}
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Grid item>
                                <Typography>
                                    Are you a citizen or permanent resident?
                                </Typography>
                            </Grid>
                            <Grid item>
                                <RadioGroup
                                    defaultValue="Yes"
                                    row
                                    name="permenantResident"
                                    id="permenantResident"
                                    onChange={handleResidencyChange}
                                >
                                    <Grid container spacing={4}>
                                        <Grid item>
                                            <FormControlLabel
                                                value="Yes"
                                                control={<Radio />}
                                                label="Yes"
                                            />
                                        </Grid>
                                        <Grid item>
                                            <FormControlLabel
                                                value="No"
                                                control={<Radio />}
                                                label="No"
                                            />
                                        </Grid>
                                    </Grid>
                                </RadioGroup>
                            </Grid>
                        </Grid>
                    </Grid>
                    {permResidentSelectedValue === 'No' && (
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
                                            If you are not a citizen/permanent
                                            resident, do you have a valid work
                                            visa?
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <RadioGroup
                                            defaultValue="Yes"
                                            row
                                            name="workVisa"
                                            id="workVisa"
                                        >
                                            <Grid container spacing={4}>
                                                <Grid item>
                                                    <FormControlLabel
                                                        value="Yes"
                                                        control={<Radio />}
                                                        label="Yes"
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <FormControlLabel
                                                        value="No"
                                                        control={<Radio />}
                                                        label="No"
                                                    />
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
                            value={degree}
                            onChange={handleDegreeChange}
                            fullWidth
                        >
                            <MenuItem value={'Bachelors'}>Bachelors</MenuItem>
                            <MenuItem value={'Post Graduate'}>
                                Post Graduate
                            </MenuItem>
                        </TextField>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid
                            container
                            direction="column"
                            spacing={0}
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Grid item>
                                <Typography gutterBottom>
                                    How many years into this degree are you?
                                </Typography>
                            </Grid>

                            <Grid item>
                                <Input
                                    name="degreeYears"
                                    id="degreeYears"
                                    value={degreeYearsValue}
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
                                    value={
                                        typeof degreeYearsValue === 'number'
                                            ? degreeYearsValue
                                            : 0
                                    }
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
                        <Grid
                            container
                            direction="column"
                            spacing={0}
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Grid item xs={12}>
                                <Typography gutterBottom>
                                    What is the maximum number of hours per week
                                    you can work?
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Input
                                    name="workHours"
                                    id="workHours"
                                    value={workHoursValue}
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
                                    value={
                                        typeof workHoursValue === 'number'
                                            ? workHoursValue
                                            : 0
                                    }
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
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Submit Details
                </Button>
            </Box>
        </>
    )
}

export default EmploymentDetails
