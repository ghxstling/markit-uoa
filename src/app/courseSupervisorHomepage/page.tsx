'use client'

import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from "../components/Sidebar"
import StarIcon from '@mui/icons-material/Star';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';
import React, { useState, useEffect } from 'react';
import { fetchData } from 'next-auth/client/_utils';
import { AlignStart } from 'react-bootstrap-icons';
import { start } from 'repl';

export default function CSHomepage(){

    interface Course {
        id: number
        course: string
        semester: string
        markers: number
        applicants: number
    }
    
    const [data,setData] = useState<Course[]>([]);;
    const api = String(process.env.ApiToken);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
          const response = await fetch(api);
          const jsonData = await response.json();
          setData(jsonData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

    


    return(
        <div>
            <div>
                <Sidebar></Sidebar>
            </div>
            <div style={{
                paddingTop: 50,
                paddingLeft: 350,
                paddingRight:100
                }}>
                <div style={{display:"inline-flex", fontSize: 16}}>
                <StarIcon style={{
                    width: 16
                }}></StarIcon>
                <p>Dashboard</p>
                </div>
                <h1 style={{paddingTop:30, paddingBottom:50}}>Welcome, Supervisor</h1>
                <Button variant="contained">CREATE NEW COURSE</Button>
                <div style={{paddingTop:40, margin:0}}>
                    <Row style={{width:'100%'}}>
                        <Col style={{textAlign:'center'}}>Course <ArrowDownwardIcon></ArrowDownwardIcon></Col>
                        <Col style={{textAlign:'center'}}>Semester <ArrowDownwardIcon/></Col>
                        <Col style={{textAlign:'center'}}>Edit Course Details</Col>
                        <Col style={{textAlign:'center'}} md="auto">Markers Needed <Tooltip title="Markers"><InfoOutlinedIcon/></Tooltip> <ArrowDownwardIcon/></Col>
                        <Col style={{textAlign:'center'}} md="auto">Number of Applicants <Tooltip title="Applicants"><InfoOutlinedIcon/></Tooltip> <ArrowDownwardIcon/></Col>
                        <Col style={{textAlign:'center'}}>Status <Tooltip title="status"><InfoOutlinedIcon/></Tooltip> </Col>
                        <Divider variant='fullWidth' style={{backgroundColor:'#000000', textAlign:'left'}}/>
                    </Row>
                    {data.map((course, index) => (
                        <Row key={index} style={{paddingTop:10, paddingBottom:10}}>
                            <Col>{course.course}</Col>
                            <Col>{course.semester}</Col>
                            <Col><Button>Edit</Button></Col>
                            <Col>{course.markers}</Col>
                            <Col>{course.applicants}</Col>
                            <Col><Button>Status</Button></Col>
                            <Divider variant='fullWidth' style={{backgroundColor:'#000000', textAlign:'left'}}/>
                        </Row>
                    ))}
                </div>
            </div>
        </div>
    )
}