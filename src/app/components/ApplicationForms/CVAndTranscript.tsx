'use client'
import React, { useState } from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DeleteIcon from '@mui/icons-material/Delete'
import DescriptionIcon from '@mui/icons-material/Description'
import { Button, Grid, Typography, Snackbar } from '@mui/material'
import MuiAlert, { AlertProps } from '@mui/material/Alert'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const CVAndTranscript = () => {
    //have a seperate file upload for CV and Transcript
    const [files, setFiles] = useState<File[]>([])
    const [fileLimit, setFileLimit] = useState(false)
    const [openSnackBar, setOpenSnackBar] = useState(false)

    const MAX_COUNT = 2

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }

        setOpenSnackBar(false)
    }

    const handleFileDelete = (index: number) => {
        const newFiles = [...files]
        newFiles.splice(index, 1)
        setFiles(newFiles)
    }

    const handleFileEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFiles: File[] = Array.prototype.slice.call(event.target.files)
        for (let i = 0; i < uploadedFiles.length; i++) {
            const file = uploadedFiles[i]
            if (file.type !== 'application/pdf') {
                setOpenSnackBar(true)
                event.target.value = '' // clear the input
                return
            }
            handleFileUpload(uploadedFiles)
        }
    }

    const handleFileUpload = (uploadedFiles: File[]) => {
        const uploaded = [...files]
        let limitExceeded = false
        uploadedFiles.some((file: File) => {
            if (uploaded.findIndex((f) => f.name === file.name) === -1) {
                uploaded.push(file)
                if (uploaded.length === MAX_COUNT) {
                    setFileLimit(true)
                }
                if (uploaded.length > MAX_COUNT) {
                    alert(`You can only add a maximum of ${MAX_COUNT} files`)
                    setFileLimit(false)
                    limitExceeded = true
                    return true
                }
            }
        })
        if (!limitExceeded) {
            setFiles(uploaded)
        }
    }

    return (
        <>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: '30px' }}>
                CV and Academic Transcript Upload
            </Typography>
            <form
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: '2px dashed #1475cf',
                    height: '300px',
                    cursor: 'pointer',
                    borderRadius: '5px',
                }}
                onClick={() => (document.querySelector('.input-field') as HTMLElement).click()}
            >
                <input
                    type="file"
                    multiple
                    className="input-field"
                    accept="application/pdf"
                    hidden
                    onChange={handleFileEvent}
                />

                <CloudUploadIcon style={{ color: '#1475cf', fontSize: '60px' }} />
                <Typography variant="subtitle1">Click to upload</Typography>
                <Typography variant="subtitle2">PDF only</Typography>
                <Typography variant="subtitle2">MAXIMUM 2 FILES</Typography>
            </form>

            {/* Map each file to its own grid item */}
            {files.map((file: File, index: number) => (
                <>
                    <Grid container spacing={1} width={809}>
                        <Grid item width="100%">
                            <Grid
                                spacing={1}
                                container
                                alignItems="center"
                                justifyContent="space-between"
                                sx={{ m: '10px 0px', backgroundColor: '#e9f0fe', p: '1px 2px' }}
                                width="100%"

                                //margin: '10px 0',
                                //padding: '15px 20px'
                            >
                                <Grid item>
                                    <Grid container alignItems="center" spacing={2}>
                                        <Grid item>
                                            <DescriptionIcon style={{ color: '#1475cf' }} />
                                        </Grid>
                                        <Grid item>{file.name}</Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Button onClick={() => handleFileDelete(index)}>
                                        <DeleteIcon style={{ color: '#1475cf' }} />
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </>
            ))}
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                open={openSnackBar}
                autoHideDuration={6000}
                onClose={handleClose}
            >
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    Please upload a PDF File
                </Alert>
            </Snackbar>
        </>
    )
}

export default CVAndTranscript
