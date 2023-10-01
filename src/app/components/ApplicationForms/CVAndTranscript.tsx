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
    const [cvFileName, setCvFileName] = useState<string>('No file uploaded...')
    const [transcriptFileName, setTranscriptFileName] = useState<string>('No file uploaded...')

    const [failureOpenSnackBar, setFailureOpenSnackBar] = useState(false)
    const [successOpenSnackBar, setSuccessOpenSnackBar] = useState(false)
    const [failureSnackbarMessage, setFailureSnackbarMessage] = useState('Please uploade a PDF')
    const [sucessSnackbarMessage, setSucessSnackbarMessage] = useState('CV Successfully uploaded')

    const handleFailureClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }
        setFailureOpenSnackBar(false)
    }

    const handleSuccessClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }
        setSuccessOpenSnackBar(false)
    }

    const handleCvFileDelete = () => {
        setCvFileName('No file uploaded...')
        ;(document.getElementById('cvFileInput') as HTMLInputElement).value = ''
    }

    const handleCvFileEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            if (event.target.files[0].type !== 'application/pdf') {
                setFailureOpenSnackBar(true)
                return
            }
            handleCvFileUpload(event.target.files[0])
        }
    }

    const handleCvFileUpload = async (uploadedFile: File) => {
        const data = new FormData()
        data.set('file', uploadedFile)
        const res = await fetch('/api/students/me/cv', {
            method: 'POST',
            body: data,
        })
        console.log(res)
        if (res.ok) {
            setSucessSnackbarMessage('CV successfully uploaded')
            setSuccessOpenSnackBar(true)
            setCvFileName(uploadedFile.name)
        } else {
            setFailureSnackbarMessage('Failed to upload CV, please try again')
            setFailureOpenSnackBar(true)
        }
        return
    }

    const handleTranscriptFileDelete = () => {
        setTranscriptFileName('No file uploaded...')
        ;(document.getElementById('transcriptFileInput') as HTMLInputElement).value = ''
    }

    const handleTranscriptFileEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            if (event.target.files[0].type !== 'application/pdf') {
                setFailureSnackbarMessage('Please uploade a PDF')
                setFailureOpenSnackBar(true)
                return
            }
            handleTranscriptFileUpload(event.target.files[0])
        }
    }

    const handleTranscriptFileUpload = async (uploadedFile: File) => {
        const data = new FormData()
        data.set('file', uploadedFile)
        const res = await fetch('/api/students/me/transcript', {
            method: 'POST',
            body: data,
        })
        if (res.ok) {
            setSucessSnackbarMessage('Transcript successfully uploaded')
            setSuccessOpenSnackBar(true)
            setTranscriptFileName(uploadedFile.name)
        } else {
            setFailureSnackbarMessage('Failed to upload transcript, please try again')
            setFailureOpenSnackBar(true)
        }
        console.log(res)
        return
    }

    return (
        <>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: '30px' }}>
                CV and Academic Transcript Upload
            </Typography>

            <Grid container spacing={5} direction="row" width="100%" justifyContent="space-between">
                <Grid item width="50%">
                    <Grid container width="100%">
                        <Grid item width="100%">
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
                                onClick={() => (document.querySelector('.input-field-cv') as HTMLElement).click()}
                            >
                                <input
                                    id="cvFileInput"
                                    type="file"
                                    className="input-field-cv"
                                    accept="application/pdf"
                                    hidden
                                    onChange={handleCvFileEvent}
                                />
                                <CloudUploadIcon style={{ color: '#1475cf', fontSize: '60px' }} />
                                <Typography variant="subtitle1">Click to upload CV</Typography>
                                <Typography variant="subtitle2">PDF only</Typography>
                                <Typography variant="subtitle2">MAXIMUM 1 FILE</Typography>
                            </form>
                            <Grid item>
                                <Grid container spacing={1} width="100%">
                                    <Grid item width="100%">
                                        <Grid
                                            spacing={1}
                                            container
                                            alignItems="center"
                                            justifyContent="space-between"
                                            sx={{ m: '10px 0px', backgroundColor: '#e9f0fe', p: '1px 2px' }}
                                            width="100%"
                                        >
                                            <Grid item>
                                                <Grid container alignItems="center" spacing={2}>
                                                    <Grid item>
                                                        <DescriptionIcon style={{ color: '#1475cf' }} />
                                                    </Grid>
                                                    <Grid item>{cvFileName}</Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item>
                                                <Button onClick={handleCvFileDelete}>
                                                    <DeleteIcon style={{ color: '#1475cf' }} />
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item width="50%">
                    <Grid container width="100%">
                        <Grid item width="100%">
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
                                onClick={() =>
                                    (document.querySelector('.input-field-transcript') as HTMLElement).click()
                                }
                            >
                                <input
                                    id="transcriptFileInput"
                                    type="file"
                                    className="input-field-transcript"
                                    accept="application/pdf"
                                    hidden
                                    onChange={handleTranscriptFileEvent}
                                />
                                <CloudUploadIcon style={{ color: '#1475cf', fontSize: '60px' }} />
                                <Typography variant="subtitle1">Click to upload Transcript</Typography>
                                <Typography variant="subtitle2">PDF only</Typography>
                                <Typography variant="subtitle2">MAXIMUM 1 FILE</Typography>
                            </form>
                            <Grid item>
                                <Grid container spacing={1} width="100%">
                                    <Grid item width="100%">
                                        <Grid
                                            spacing={1}
                                            container
                                            alignItems="center"
                                            justifyContent="space-between"
                                            sx={{ m: '10px 0px', backgroundColor: '#e9f0fe', p: '1px 2px' }}
                                            width="100%"
                                        >
                                            <Grid item>
                                                <Grid container alignItems="center" spacing={2}>
                                                    <Grid item>
                                                        <DescriptionIcon style={{ color: '#1475cf' }} />
                                                    </Grid>
                                                    <Grid item>{transcriptFileName}</Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item>
                                                <Button onClick={handleTranscriptFileDelete}>
                                                    <DeleteIcon style={{ color: '#1475cf' }} />
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                open={failureOpenSnackBar}
                autoHideDuration={6000}
                onClose={handleFailureClose}
            >
                <Alert onClose={handleFailureClose} severity="error" sx={{ width: '100%' }}>
                    {failureSnackbarMessage}
                </Alert>
            </Snackbar>

            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                open={successOpenSnackBar}
                autoHideDuration={6000}
                onClose={handleSuccessClose}
            >
                <Alert onClose={handleSuccessClose} severity="success" sx={{ width: '100%' }}>
                    {sucessSnackbarMessage}
                </Alert>
            </Snackbar>
        </>
    )
}

export default CVAndTranscript
