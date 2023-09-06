import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useSession } from 'next-auth/react';
import DynamicBreadcrumb from '../components/DynamicBreadcrumb';
import Sidebar from "../components/Sidebar";
import CourseTable from '../components/courses/CourseTable';


export default function AllCourseView(){

  return(
      <>
          <Sidebar/>
          <Box style={{
              paddingTop: 50,
              paddingLeft: 350,
              paddingRight:100,
              marginBottom: 50
              }}>
              <DynamicBreadcrumb/>
              <div style={{height:70}}></div>
              <CourseTable/>
          </Box>
      </>
  )
}