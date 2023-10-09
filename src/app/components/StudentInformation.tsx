'use client'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box, Divider, TableBody } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { number } from 'zod';
import Button from '@mui/material/Button';
import Link from 'next/link';

type ViewStudentInformationProps = {
  studentUpi: string
}


export default function ViewStudentInformation({ studentUpi }: ViewStudentInformationProps){

  interface Course {
    courseCode: string
    semester: string
    markersNeeded: number
    applicants: number
    needMarkers: boolean
    id: number
    }

    interface Application {
      id: number
      applicationStatus: string
      student: Student
      studentId: number
      course: Course
      courseId: number
      preferredEmail: string
      hasCompletedCourse: boolean
      previouslyAchievedGrade: string
      hasTutoredCourse: boolean
      hasMarkedCourse: boolean
      notTakenExplanation: string
      equivalentQualification: string
    }

    interface Student{
        id: number
        upi: string
        auid: number
        preferredEmail: string
        overseas: boolean
        residencyStatus: boolean
        validWorkVisa: boolean
        degreeYear: number
        maxWorkHours: number
        degreeType: string
        applications: Application[]
    }

    const router = usePathname();

    const [data, setData] = useState<Student>();
    
    useEffect(() => {
        if (studentUpi) {
          fetchData(studentUpi as string);
        }
      }, [studentUpi]);

      const fetchData = async (studentId: string | undefined) => {
        try {
          const response = await fetch(`/api/students/${studentUpi}`, { method: 'GET' });
          if (response.ok) {
            const jsonData = await response.json();
            setData(jsonData);
          } else {
            console.error('Error fetching data:', response.status);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      const [openRows, setOpenRows] = useState(Array((data?.applications?.length ?? 0)).fill(false));
  
      const toggleRow = (index : number) => {
          const newOpenRows = [...openRows];
          newOpenRows[index] = !newOpenRows[index];
          setOpenRows(newOpenRows);
      };    

    return(
        <>
          <div style={{ display: 'flex', justifyContent: 'center', width: '500px'}}>
            <Box>
                <h1>{data?.upi}-{data?.auid}</h1>
                <h2>Student Info</h2>
                <Divider/>
                <p>Email: {data?.preferredEmail}</p>
                <Divider/>
                {data?.overseas ? (
                <p>Living Overseas: Yes</p>
                ) : (
                <p>Living Overseas: No</p>
                )}
                <Divider/>
                {data?.validWorkVisa ? (
                <p>Valid Work Visa: Yes</p>
                ) : (
                <p>Valid Work Visa: No</p>
                )}
                
                <p>Years into Degree: {data?.degreeYear}</p>
                <Divider/>
                <p>Maximum Hours Per Week: {data?.maxWorkHours}</p>
                <Divider/>
                <p>Degree Type: {data?.degreeType}</p>
                <Divider/>
                <Link legacyBehavior href='/api/students/[studentId]/cv' as={`/api/students/${String(data?.upi)}/cv`}><a target="_blank"><Button>Student CV</Button></a></Link>
                <Divider/>
                <Link legacyBehavior href='/api/students/[studentId]/transcript' as={`/api/students/${String(data?.upi)}/transcript`}><a target="_blank"><Button>Student Transcript</Button></a></Link>
                <h2>Student Applications</h2>
                <TableContainer component={Paper} style={{marginTop:20}}>
                        <Table style={{paddingTop:40}}>
                            <TableHead>
                                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                                    <TableCell/>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {data?.applications ? (
                              data.applications.map((application, index) => (
                                    <>
                                        <TableRow key={index}>
                                            <IconButton
                                                    aria-label="expand row"
                                                    size="small"
                                                    onClick={() => toggleRow(index)}
                                                >
                                                        {openRows[index] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                            </IconButton>
                                            <TableCell style={{textAlign:'left'}}>{application.course?.courseCode}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                <Collapse in={openRows[index]} timeout="auto" unmountOnExit>
                                                    <Box sx={{ margin: 1 }}>
                                                      <p>
                                                        Completed Course: {application.hasCompletedCourse ? "Yes" : "No"}
                                                      </p>
                                                      <Divider/>
                                                      <p>Has Marked Before: {application.hasMarkedCourse ? "Yes" : "No"}</p>
                                                      <Divider/>
                                                      <p>Has Tutored Before: {application.hasTutoredCourse ? "Yes": "No"}</p>
                                                      <Divider/>
                                                      {application.hasCompletedCourse ? <p>Previously Achieved Grade: {application.previouslyAchievedGrade}</p>: <p>Reason for Incompletion: {application.notTakenExplanation}</p>}
                                                      <Divider/>
                                                    </Box>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </>
                                )))
                                  : (
                                    <TableRow>
                                      <TableCell colSpan={6}>No applications found.</TableCell>
                                    </TableRow>
                                  )}
                            </TableBody>
                        </Table>
                    </TableContainer>
            </Box>
          </div>
        </>     
)}