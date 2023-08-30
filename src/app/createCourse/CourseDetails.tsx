"use client";

import {
    Container,
    Paper,
    Grid,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Slider,
    Box,
    FormHelperText,
    Button,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";

export default function CourseDetails() {
    const [courseCode, setCourseCode] = useState("");
    const [courseDescription, setCourseDescription] = useState("");
    const [semester, setSemester] = useState("");
    const [sliderValue, setSliderValue] = useState(0);
    const [manualInputValue, setManualInputValue] = useState<string>(
        sliderValue.toString()
    );
    const [enrolledSliderValue, setEnrolledSliderValue] = useState(0);
    const [enrolledManualInputValue, setEnrolledManualInputValue] =
        useState<string>(enrolledSliderValue.toString());

    const [markerHoursSliderValue, setMarkerHoursSliderValue] = useState(0);
    const [markerHoursManualInputValue, setMarkerHoursManualInputValue] =
        useState<string>(markerHoursSliderValue.toString());
    const [markerSliderValue, setMarkerSliderValue] = useState(0);
    const [markerManualInputValue, setMarkerManualInputValue] =
        useState<string>(markerSliderValue.toString());
    const [description, setDescription] = useState<string>("");
    const [wordCount, setWordCount] = useState<number>(0);

    const handleManualInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.valueAsNumber;
        if (value >= 0 && value <= 800) {
            setSliderValue(value);
            setManualInputValue(event.target.value);
        }
    };
    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        if (typeof newValue === "number") {
            setSliderValue(newValue);
            setManualInputValue(newValue.toString());
        }
    };

    const handleEnrolledManualInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.valueAsNumber;
        if (value >= 0 && value <= 800) {
            setEnrolledSliderValue(value);
            setEnrolledManualInputValue(event.target.value);
        }
    };
    const handleEnrolledSliderChange = (
        event: Event,
        newValue: number | number[]
    ) => {
        if (typeof newValue === "number") {
            setEnrolledSliderValue(newValue);
            setEnrolledManualInputValue(newValue.toString());
        }
    };

    const handleMarkerHoursManualInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.valueAsNumber;
        if (value >= 0 && value <= 200) {
            setMarkerHoursSliderValue(value);
            setMarkerHoursManualInputValue(event.target.value);
        }
    };
    const handleMarkerHoursSliderChange = (
        event: Event,
        newValue: number | number[]
    ) => {
        if (typeof newValue === "number") {
            setMarkerHoursSliderValue(newValue);
            setMarkerHoursManualInputValue(newValue.toString());
        }
    };

    const handleMarkerManualInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.valueAsNumber;
        if (value >= 0 && value <= 200) {
            setMarkerSliderValue(value);
            setMarkerManualInputValue(event.target.value);
        }
    };

    const handleMarkerSliderChange = (
        event: Event,
        newValue: number | number[]
    ) => {
        if (typeof newValue === "number") {
            setMarkerSliderValue(newValue);
            setMarkerManualInputValue(newValue.toString());
        }
    };

    const handleDescriptionChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const newDescription = event.target.value;
        const newWordCount = newDescription.split(/\s+/).filter(Boolean).length;

        setDescription(newDescription);
        setWordCount(newWordCount);
    };

    async function handleSubmit() {
        const formData = {
            courseCode,
            courseDescription,
            semester,
            numOfEstimatedStudents: sliderValue,
            numOfEnrolledStudents: enrolledSliderValue,
            markerHours: markerHoursSliderValue,
            needMarkers: markerSliderValue > 0,
            markersNeeded: markerSliderValue,
            markerResponsibilitiesDescription: description,
        };
        console.log("Submitting form with data:", formData);
        try {
            const response = await fetch("/api/add-course", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.statusText);
            }

            // Handle success (e.g., navigate to another page or show a success message)
            console.log("Course added:", data);
        } catch (error) {
            // Handle error (show an error message to the user)
            console.error("Error:", error);
        }
    }

    function clearForm() {
        setCourseCode("");
        setCourseDescription("");
        setSemester("");
        setSliderValue(0);
        setManualInputValue("0");
        setEnrolledSliderValue(0);
        setEnrolledManualInputValue("0");
        setMarkerHoursSliderValue(0);
        setMarkerHoursManualInputValue("0");
        setMarkerSliderValue(0);
        setMarkerManualInputValue("0");
        setDescription("");
        setWordCount(0);
    }

    return (
        <Container maxWidth="sm" style={{ marginTop: "2em" }}>
            <Paper elevation={3} style={{ padding: "2em" }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    align="center"
                    style={{ fontWeight: 700 }}
                >
                    Course Details
                </Typography>
                <Grid container spacing={3} justifyContent="center">
                    <Grid item>
                        <TextField
                            label="Course Code"
                            variant="outlined"
                            style={{ width: "350px" }}
                            value={courseCode}
                            onChange={(e) => setCourseCode(e.target.value)}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            label="Course Description"
                            variant="outlined"
                            style={{ width: "350px" }}
                            value={courseDescription}
                            onChange={(e) =>
                                setCourseDescription(e.target.value)
                            }
                        />
                    </Grid>
                    <Grid item>
                        <FormControl fullWidth style={{ width: "350px" }}>
                            <InputLabel id="semester-select-label">
                                Semester
                            </InputLabel>
                            <Select
                                labelId="semester-select-label"
                                id="semester-select"
                                value={semester}
                                label="Semester"
                                onChange={(event) =>
                                    setSemester(event.target.value)
                                }
                            >
                                <MenuItem value={"2023S1"}>2023S1</MenuItem>
                                <MenuItem value={"2023S2"}>2023S2</MenuItem>
                                <MenuItem value={"2024SS"}>2024SS</MenuItem>
                                <MenuItem value={"2024S1"}>2024S1</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid
                        container
                        item
                        xs={12}
                        justifyContent="center"
                        spacing={3}
                    >
                        <Typography
                            variant="subtitle1"
                            style={{ marginTop: "20px" }}
                        >
                            Estimated number of students to enrol:
                        </Typography>
                        <Grid item xs={12}>
                            <Box sx={{ width: "350px", margin: "0 auto" }}>
                                <Slider
                                    aria-label="Number of students"
                                    defaultValue={0}
                                    valueLabelDisplay="auto"
                                    step={10}
                                    marks={[
                                        { value: 0, label: "0" },
                                        { value: 800, label: "800" },
                                    ]}
                                    min={0}
                                    max={800}
                                    value={sliderValue}
                                    onChange={handleSliderChange}
                                />
                                <Grid container justifyContent="center">
                                    <Grid item xs={6}>
                                        <Box
                                            display="flex"
                                            justifyContent="center"
                                        >
                                            {" "}
                                            <TextField
                                                type="number"
                                                value={manualInputValue}
                                                onChange={
                                                    handleManualInputChange
                                                }
                                                style={{ width: "90px" }}
                                                InputProps={{
                                                    inputProps: {
                                                        min: 0,
                                                        max: 800,
                                                    },
                                                }}
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>

                    <Grid
                        container
                        item
                        xs={12}
                        justifyContent="center"
                        spacing={3}
                    >
                        <Typography
                            variant="subtitle1"
                            style={{ marginTop: "20px" }}
                        >
                            Number of students currently enrolled:
                        </Typography>
                        <Grid item xs={12}>
                            <Box sx={{ width: "350px", margin: "0 auto" }}>
                                <Slider
                                    aria-label="Number of currently enrolled students"
                                    defaultValue={0}
                                    valueLabelDisplay="auto"
                                    step={10}
                                    marks={[
                                        { value: 0, label: "0" },
                                        { value: 800, label: "800" },
                                    ]}
                                    min={0}
                                    max={800}
                                    value={enrolledSliderValue}
                                    onChange={handleEnrolledSliderChange}
                                />
                                <Grid container justifyContent="center">
                                    <Grid item xs={6}>
                                        <Box
                                            display="flex"
                                            justifyContent="center"
                                        >
                                            {" "}
                                            <TextField
                                                type="number"
                                                value={enrolledManualInputValue}
                                                onChange={
                                                    handleEnrolledManualInputChange
                                                }
                                                style={{ width: "90px" }}
                                                InputProps={{
                                                    inputProps: {
                                                        min: 0,
                                                        max: 800,
                                                    },
                                                }}
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>

                    <Grid
                        container
                        item
                        xs={12}
                        justifyContent="center"
                        spacing={3}
                    >
                        <Typography
                            variant="subtitle1"
                            style={{ marginTop: "20px" }}
                        >
                            Estimated number of marker hours required:
                        </Typography>
                        <Grid item xs={12}>
                            <Box sx={{ width: "350px", margin: "0 auto" }}>
                                <Slider
                                    aria-label="Number of hours"
                                    defaultValue={0}
                                    valueLabelDisplay="auto"
                                    step={10}
                                    marks={[
                                        { value: 0, label: "0" },
                                        { value: 200, label: "200" },
                                    ]}
                                    min={0}
                                    max={200}
                                    value={markerHoursSliderValue}
                                    onChange={handleMarkerHoursSliderChange}
                                />
                                <Grid container justifyContent="center">
                                    <Grid item xs={6}>
                                        <Box
                                            display="flex"
                                            justifyContent="center"
                                        >
                                            {" "}
                                            <TextField
                                                type="number"
                                                value={
                                                    markerHoursManualInputValue
                                                }
                                                onChange={
                                                    handleMarkerHoursManualInputChange
                                                }
                                                style={{ width: "90px" }}
                                                InputProps={{
                                                    inputProps: {
                                                        min: 0,
                                                        max: 200,
                                                    },
                                                }}
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>

                    <Grid
                        container
                        item
                        xs={12}
                        justifyContent="center"
                        spacing={3}
                    >
                        <Typography
                            variant="subtitle1"
                            style={{ marginTop: "20px" }}
                        >
                            Preferred number of markers:
                        </Typography>
                        <Grid item xs={12}>
                            <Box sx={{ width: "350px", margin: "0 auto" }}>
                                <Slider
                                    aria-label="Number of markers"
                                    defaultValue={0}
                                    valueLabelDisplay="auto"
                                    step={1}
                                    marks={[
                                        { value: 0, label: "0" },
                                        { value: 20, label: "20" },
                                    ]}
                                    min={0}
                                    max={20}
                                    value={markerSliderValue}
                                    onChange={handleMarkerSliderChange}
                                />
                                <Grid container justifyContent="center">
                                    <Grid item xs={6}>
                                        <Box
                                            display="flex"
                                            justifyContent="center"
                                        >
                                            {" "}
                                            <TextField
                                                type="number"
                                                value={markerManualInputValue}
                                                onChange={
                                                    handleMarkerManualInputChange
                                                }
                                                style={{ width: "90px" }}
                                                InputProps={{
                                                    inputProps: {
                                                        min: 0,
                                                        max: 20,
                                                    },
                                                }}
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        item
                        xs={12}
                        justifyContent="center"
                        spacing={3}
                    >
                        <Grid item>
                            <TextField
                                label="Description of marker responsibilities"
                                variant="outlined"
                                style={{ width: "350px" }}
                                multiline
                                rows={4}
                                value={description}
                                onChange={handleDescriptionChange}
                            />
                            <FormHelperText>{`${wordCount}/100`}</FormHelperText>
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        item
                        alignItems="center"
                        spacing={1}
                        style={{ marginTop: "1em" }}
                    >
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                            >
                                CREATE
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={clearForm}
                            >
                                DISCARD
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}
