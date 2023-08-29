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

export default function CSHomepage(){
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
                <Container style={{paddingTop:40}}>
                    <Row>
                        <Col>Course <ArrowDownwardIcon/></Col>
                        <Col>Semester <ArrowDownwardIcon/></Col>
                        <Col>Edit Course Details</Col>
                        <Col md="auto">Markers Needed <Tooltip title="Markers"><InfoOutlinedIcon/></Tooltip> <ArrowDownwardIcon/></Col>
                        <Col md="auto">Number of Applicants <Tooltip title="Applicants"><InfoOutlinedIcon/></Tooltip> <ArrowDownwardIcon/></Col>
                        <Col>Status <Tooltip title="status"><InfoOutlinedIcon/></Tooltip> </Col>
                    </Row>
                    <Divider style={{backgroundColor:'#000000'}}/>
                </Container>
            </div>
        </div>
    )
}