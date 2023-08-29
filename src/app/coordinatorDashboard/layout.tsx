import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar";

export default function coordinatorDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <Sidebar />
                {children}
            </body>
        </html>
    );
}
