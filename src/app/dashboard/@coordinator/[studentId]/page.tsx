'use client'

import { DegreeType } from '@/models/degreeType';
import { Box, Divider } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { TabContainer } from 'react-bootstrap';


export default function viewStudentInformation(){

    interface Student{
        id: number
        upi: string
        auid: number
        email: string
        overseas: boolean
        residencyStatus: boolean
        validWorkVisa: boolean
        degreeYear: number
        maxWorkHours: number
        degreeType: string
    }

    const router = useRouter();
    const { studentId } = router.query;

    const [data, setData] = useState<Student | null>(null);

    useEffect(() => {
        if (studentId) {
          fetchData(studentId as string);
        }
      }, [studentId]);

      const fetchData = async (studentId: string) => {
        try {
          const response = await fetch(`/api/users/${studentId}`, { method: 'GET' });
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

    return(
        <>
            <Box width={'80%'}>
                <h1>{data?.upi}-{data?.auid}</h1>
                <h2>Student Info</h2>
                <Divider/>
                <p>Email: {data?.email}</p>
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
            </Box>
        </>     
)}