'use client'

import { Grid, Button, Typography } from '@mui/material'
import React, { useState } from 'react'

const CVAndTranscript = () => {
    const [cvFile, setCvFile] = useState<File>()
    const [cvFileName, setCvFileName] = useState('')
    const [transcriptFile, setTranscriptFile] = useState<File>()
    const [transcriptFileName, setTranscriptFileName] = useState('')

    const handleCvFileUpload = (event: any) => {
        setCvFile(event.target.files[0])
        setCvFileName(event.target.files[0].name)
        return
    }

    const handleTranscriptFileUpload = (event: any) => {
        setTranscriptFile(event.target.files[0])
        setTranscriptFileName(event.target.files[0].name)
        return
    }

    const onCvSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!cvFile) return

        try {
            const data = new FormData()
            data.set('file', cvFile)

            const res = await fetch('/api/application/upload', {
                method: 'POST',
                body: data,
            })

            if (!res.ok) throw new Error(await res.text())
        } catch (e: any) {
            console.error(e)
        }
    }

    const onTranscriptSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!transcriptFile) return

        try {
            const data = new FormData()
            data.set('file', transcriptFile)

            const res = await fetch('/api/application/upload', {
                method: 'POST',
                body: data,
            })

            if (!res.ok) throw new Error(await res.text())
        } catch (e: any) {
            console.error(e)
        }
    }

    return (
        <>
            <Typography
                component="h1"
                variant="h5"
                fontWeight="bold"
                sx={{ mb: '20px' }}
            >
                CV and Transcript Upload
            </Typography>
            <Grid container spacing={4} direction="column">
                <Grid item>
                    <form onSubmit={onCvSubmit}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item>
                                <Button variant="contained" component="label">
                                    Upload CV
                                    <input
                                        hidden
                                        type="file"
                                        onChange={handleCvFileUpload}
                                    />
                                </Button>
                            </Grid>
                            <Grid item>
                                <Typography>{cvFileName}</Typography>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" component="label">
                                    Submit CV Upload
                                    <input
                                        hidden
                                        type="submit"
                                        value="Submit CV Upload"
                                    />
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
                <Grid item>
                    <form onSubmit={onTranscriptSubmit}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item>
                                <Button variant="contained" component="label">
                                    Upload Transcript
                                    <input
                                        hidden
                                        type="file"
                                        onChange={handleTranscriptFileUpload}
                                    />
                                </Button>
                            </Grid>
                            <Grid item>
                                <Typography>{transcriptFileName}</Typography>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" component="label">
                                    Submit Transcript Upload
                                    <input
                                        hidden
                                        type="submit"
                                        value="Submit CV Upload"
                                    />
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
        </>
    )
}

export default CVAndTranscript
