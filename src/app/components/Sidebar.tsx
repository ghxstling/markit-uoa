import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ArchiveIcon from "@mui/icons-material/Archive";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import Link from "next/link";

const linkStyle = {
  textDecoration: "none",
  color: "white",
  width: "100%",
};

const IconStyle = {
  fill: "white",
};

const content = (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      justifyContent: "space-between",
      width: "15rem",
    }}
  >
    <List>
      <ListSubheader
        sx={{
          color: "white",
          fontSize: "1.2rem",
          backgroundColor: "#00467F",
        }}
      >
        <b>Burkhard W.</b>
      </ListSubheader>
      <ListSubheader sx={{ color: "white", backgroundColor: "#00467F" }}>
        bwue001@aucklanduni.ac.nz
      </ListSubheader>
      <ListItem disablePadding sx={{ mt: "1.5rem" }}>
        <Link href="./" passHref style={linkStyle}>
          <ListItemButton>
            <ListItemIcon>
              <DashboardIcon style={IconStyle} />
            </ListItemIcon>
            <ListItemText>Dashboard</ListItemText>
          </ListItemButton>
        </Link>
      </ListItem>

      <ListItem disablePadding>
        <Link href="./" passHref style={linkStyle}>
          <ListItemButton>
            <ListItemIcon>
              <ArchiveIcon style={IconStyle} />
            </ListItemIcon>
            <ListItemText>My Applications</ListItemText>
          </ListItemButton>
        </Link>
      </ListItem>

      <ListItem disablePadding>
        <Link href="./" passHref style={linkStyle}>
          <ListItemButton>
            <ListItemIcon>
              <NotificationsIcon style={IconStyle} />
            </ListItemIcon>
            <ListItemText>Notifications</ListItemText>
          </ListItemButton>
        </Link>
      </ListItem>

      <ListItem disablePadding>
        <Link href="./" passHref style={linkStyle}>
          <ListItemButton>
            <ListItemIcon>
              <SettingsIcon style={IconStyle} />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </ListItemButton>
        </Link>
      </ListItem>
    </List>

    <List>
      <ListItem disablePadding sx={{ mb: "1.5rem" }}>
        <Link href="./" passHref style={linkStyle}>
          <ListItemButton>
            <ListItemIcon>
              <LogoutIcon style={IconStyle} />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </ListItemButton>
        </Link>
      </ListItem>
    </List>
  </Box>
);

const Sidebar = () => {
  return (
    <div>
      <Drawer
        sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: "#00467F",
            color: "white",
          },
        }}
        anchor="left"
        variant="permanent"
      >
        {content}
      </Drawer>
    </div>
  );
};

export default Sidebar;
