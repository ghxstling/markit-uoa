import Typography from "@mui/material/Typography";
import Link from "next/link";
import { UserStatus } from "./components/UserStatus";

export default function Home() {
  return (
    <>
      <Typography variant="h1">Hello World</Typography>
      <UserStatus />

      {/* Add the link to the course creation page */}
      <div style={{ marginTop: "20px" }}>
        <Link href="/createCourse">Create a New Course</Link>
      </div>
    </>
  );
}
