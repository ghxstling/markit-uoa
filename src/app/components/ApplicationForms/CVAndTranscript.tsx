'use client'
import React, { useState } from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DeleteIcon from '@mui/icons-material/Delete'
import DescriptionIcon from '@mui/icons-material/Description'
import { Button, Grid, Typography, Box } from '@mui/material'
import { unknown } from 'zod'

const CVAndTranscript = () => {
    const [files, setFiles]: any[] = useState([])
    const [fileLimit, setFileLimit] = useState(false)
    const MAX_COUNT = 2

    const handleFileDelete = (index: any) => {
        const newFiles = [...files]
        newFiles.splice(index, 1)
        setFiles(newFiles)
    }

    const handleFileEvent = (event: any) => {
        const uploadedFiles = Array.prototype.slice.call(event.target.files)
        handleFileUpload(uploadedFiles)
    }

    const handleFileUpload = (uploadedFiles: any) => {
        const uploaded = [...files]
        let limitExceeded = false
        uploadedFiles.some((file: any) => {
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
                onClick={() => document.querySelector('.input-field').click()}
            >
                <input type="file" multiple className="input-field" hidden onChange={handleFileEvent} />

                <CloudUploadIcon style={{ color: '#1475cf', fontSize: '60px' }} />
            </form>

            {/* Map each file to its own grid item */}
            {files.map((file: any, index: any) => (
                <>
                    <Grid container spacing={1}>
                        <Grid item>
                            <Grid
                                spacing={1}
                                container
                                alignItems="center"
                                justifyContent="space-between"
                                sx={{ mt: '20px', backgroundColor: '#e9f0fe', p: '1px 2px' }}
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
        </>
    )
}

export default CVAndTranscript
