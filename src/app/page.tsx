import Typography from "@mui/material/Typography";
import { UserStatus } from "./components/UserStatus";

export default function Home() {
    return (
        <>
            <Typography variant="h1">Hello World</Typography>
            <UserStatus />
        </>
    );
}
