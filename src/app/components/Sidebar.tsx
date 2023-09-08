'use client'

import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
} from '@mui/material'
import React from 'react'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ArchiveIcon from '@mui/icons-material/Archive'
import NotificationsIcon from '@mui/icons-material/Notifications'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

//Styling
const linkStyle = {
    textDecoration: 'none',
    color: 'white',
    width: '100%',
}

const IconStyle = {
    fill: 'white',
}

//Create Sidebar Content
let content = (username: string, email: string) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                justifyContent: 'space-between',
                width: '15rem',
            }}
        >
            <List>
                <ListSubheader
                    sx={{
                        color: 'white',
                        fontSize: '1.2rem',
                        backgroundColor: '#00467F',
                    }}
                >
                    <b>{username}</b>
                </ListSubheader>
                <ListSubheader
                    sx={{
                        color: 'white',
                        backgroundColor: '#00467F',
                        lineHeight: '0',
                    }}
                >
                    {email}
                </ListSubheader>
                <ListItem disablePadding sx={{ mt: '1.5rem' }}>
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
                <ListItem disablePadding sx={{ mb: '1.5rem' }}>
                    <ListItemButton
                        onClick={() => signOut({ callbackUrl: '/' })}
                    >
                        <ListItemIcon>
                            <LogoutIcon style={IconStyle} />
                        </ListItemIcon>
                        <ListItemText>Logout</ListItemText>
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    )
}

const Sidebar = () => {
    const { data: session } = useSession()

    let sidebarContent = content('', '')

    //Get users name and email from session
    if (session && session.user && session.user.name && session.user.email) {
        const name: string =
            session.user.name.slice(0, session.user.name.lastIndexOf(' ') + 1) +
            session.user.name.slice(session.user.name.lastIndexOf(' '))[1] +
            '.'
        const email: string = session.user.email
        sidebarContent = content(name, email)
    }

    return (
        <div>
            <Drawer
                sx={{
                    '& .MuiDrawer-paper': {
                        backgroundColor: '#00467F',
                        color: 'white',
                    },
                }}
                anchor="left"
                variant="permanent"
            >
                {sidebarContent}
            </Drawer>
        </div>
    )
}

export default Sidebar
