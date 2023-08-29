import * as React from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import RecentActivityTable from "../components/RecentActivityTable";
import Button from "@mui/material/Button";

export default function coordinatorDashboard() {
    return (
        <>
            <Stack paddingLeft={"20rem"} paddingRight={"5rem"}>
                <Typography variant="h6" paddingBottom={"3rem"}>
                    Breadcrumb Placeholder
                </Typography>
                <Stack paddingLeft={"3rem"}>
                    <Typography
                        variant="h5"
                        fontWeight={"bold"}
                        paddingBottom={"3%"}
                    >
                        Welcome, Burkhard!
                    </Typography>
                    <Button
                        variant="contained"
                        style={{
                            width: "12rem",
                            backgroundColor: "#00467F",
                            marginBottom: "5%",
                        }}
                    >
                        VIEW ALL COURSES
                    </Button>
                    <Typography variant="h5">Recent Activity</Typography>
                    <Divider variant="fullWidth" sx={{ mb: "5%" }} />
                    <RecentActivityTable />
                </Stack>
            </Stack>
        </>
    );
}
