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
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
} from '@mui/material'
import React, { useState } from 'react'

import DashboardIcon from '@mui/icons-material/Dashboard'
import ArchiveIcon from '@mui/icons-material/Archive'
import NotificationsIcon from '@mui/icons-material/Notifications'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import CalendarViewDayIcon from '@mui/icons-material/CalendarViewDay'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import LogoutIcon from '@mui/icons-material/Logout'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { SvgIconTypeMap } from '@mui/material'
import { OverridableComponent } from '@mui/material/OverridableComponent'

//Styling
const linkStyle = {
    textDecoration: 'none',
    color: 'white',
    width: '100%',
}

const IconStyle = {
    fill: 'white',
}

const icons: Record<string, OverridableComponent<SvgIconTypeMap<{}, 'svg'>>> = {
    ArchiveIcon: ArchiveIcon,
    ManageAccountsIcon: ManageAccountsIcon,
    CreateNewFolderIcon: CreateNewFolderIcon,
    CalendarViewDayIcon: CalendarViewDayIcon,
    ContentCopyIcon: ContentCopyIcon,
}

//Create Sidebar Content
let content = (
    username: string,
    email: string,
    Links: string[][],
    // redirectToDashboard: string,
    open: boolean,
    handleClickOpen: () => void,
    handleClose: () => void
) => {
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
                    <Link href="/dashboard" passHref style={linkStyle}>
                        <ListItemButton>
                            <ListItemIcon>
                                <DashboardIcon style={IconStyle} />
                            </ListItemIcon>
                            <ListItemText>Dashboard</ListItemText>
                        </ListItemButton>
                    </Link>
                </ListItem>

                {/* =============== Notifications are not implemented yet ============= */}
                {/* <ListItem disablePadding>
                    <Link href="./" passHref style={linkStyle}>
                        <ListItemButton>
                            <ListItemIcon>
                                <NotificationsIcon style={IconStyle} />
                            </ListItemIcon>
                            <ListItemText>Notifications</ListItemText>
                        </ListItemButton>
                    </Link>
                </ListItem> */}

                {Links.map((link, index) => (
                    <ListItem disablePadding key={index}>
                        <Link href={link[1]} passHref style={linkStyle}>
                            <ListItemButton>
                                <ListItemIcon>{React.createElement(icons[link[2]], { style: IconStyle })}</ListItemIcon>
                                <ListItemText>{link[0]}</ListItemText>
                            </ListItemButton>
                        </Link>
                    </ListItem>
                ))}
            </List>

            <List>
                <ListItem disablePadding sx={{ mb: '1.5rem' }}>
                    <ListItemButton onClick={handleClickOpen}>
                        <ListItemIcon>
                            <LogoutIcon style={IconStyle} />
                        </ListItemIcon>
                        <ListItemText>Logout</ListItemText>
                    </ListItemButton>
                </ListItem>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{'Confirm Logout'}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to log out?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                handleClose()
                                signOut({ callbackUrl: '/' })
                            }}
                            color="primary"
                            autoFocus
                        >
                            Yes, Logout
                        </Button>
                    </DialogActions>
                </Dialog>
            </List>
        </Box>
    )
}

const Sidebar = () => {
    const { data: session } = useSession()
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    let sidebarContent

    // Get users name and email from session
    if (session && session.user && session.user.name && session.user.email) {
        const name: string =
            session.user.name.slice(0, session.user.name.lastIndexOf(' ') + 1) +
            session.user.name.slice(session.user.name.lastIndexOf(' '))[1] +
            '.'
        const email: string = session.user.email
        switch (session.role) {
            case 'coordinator':
                sidebarContent = content(
                    name,
                    email,
                    [
                        ['Create New Course', '/dashboard/courses', 'CreateNewFolderIcon'],
                        ['Import Courses', '/dashboard/importCourses', 'ContentCopyIcon'],
                        ['View All Courses', '/dashboard/viewAllCourses', 'CalendarViewDayIcon'],
                        ['Manage User Roles', '/dashboard/manageUsers', 'ManageAccountsIcon'],
                    ],
                    open,
                    handleClickOpen,
                    handleClose
                )
                break
            case 'supervisor':
                sidebarContent = content(
                    name,
                    email,
                    [['Create New Course', '/dashboard/courses', 'CreateNewFolderIcon']],
                    open,
                    handleClickOpen,
                    handleClose
                )
                break
            case 'student':
                sidebarContent = content(
                    name,
                    email,
                    [
                        ['View All Courses', '/dashboard/ViewAllCourses', 'CalendarViewDayIcon'],
                        ['Apply Now', '/dashboard/application', 'ArchiveIcon'],
                    ],
                    open,
                    handleClickOpen,
                    handleClose
                )
                break
        }
    } else {
        sidebarContent = content('', '', [[]], open, handleClickOpen, handleClose)
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
