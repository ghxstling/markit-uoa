'use client'

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import DynamicBreadcrumb from '../components/DynamicBreadcrumb';
import Sidebar from "../components/Sidebar";
import { TableBody } from '@mui/material';

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
      event: React.MouseEvent<HTMLButtonElement>,
      newPage: number,
    ) => void;
  }


export default function CSHomepage(){

    interface Course {
        courseCode: string
        semester: string
        markersNeeded: number
        applicants: number
        needMarkers: boolean
        id: number
    }
    
    const [data,setData] = useState<Course[]>([]);;
    const api = String(process.env.ApiToken);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
          const response = await fetch('/api/courses', { method:'GET'});
          const jsonData = await response.json();
          setData(jsonData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      const [page, setPage] = React.useState(0);
      const [rowsPerPage, setRowsPerPage] = React.useState(5);
    
      const emptyRows =
        page >= 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
    
      const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
      ) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        data.map((course, index) => (
        console.log(course.status)
        ))
      };

      const { data: session } = useSession()

      let firstName: string = ''

      if (session && session.user && session.user.name && session.user.email) {
          firstName = session.user.name.slice(
              0,
              session.user.name.lastIndexOf(' ') + 1
          )
      }



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
                <Typography
                        sx={{ mt: '28px' }}
                        variant="h4"
                        fontWeight="bold">
                        Welcome, {firstName}
                    </Typography>
                <Button variant="contained" sx={{backgroundColor: '#00467F', mt: '53px', mb: '58px',}}>CREATE NEW COURSE</Button>

                <TableContainer component={Paper} style={{marginTop:20}}>
                    <Table style={{paddingTop:40}}>
                        <TableHead>
                            <TableRow style={{}}>
                                <TableCell style={{textAlign:'center'}}>Course<ArrowDownwardIcon/></TableCell>
                                <TableCell style={{textAlign:'center'}}>Semester <ArrowDownwardIcon/></TableCell>
                                <TableCell style={{textAlign:'center'}}>Edit Course Details</TableCell>
                                <TableCell style={{textAlign:'center'}}>Markers Needed <Tooltip title="Markers"><InfoOutlinedIcon/></Tooltip> <ArrowDownwardIcon/></TableCell>
                                <TableCell style={{textAlign:'center'}}>Number of Applicants <Tooltip title="Applicants"><InfoOutlinedIcon/></Tooltip> <ArrowDownwardIcon/></TableCell>
                                <TableCell style={{textAlign:'center'}}>Status <Tooltip title="status"><InfoOutlinedIcon/></Tooltip> </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                          {(rowsPerPage > 0
                              ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                              : data
                          ).map((course, index) => (
                              <TableRow key={index} style={{}}>
                                  <TableCell style={{textAlign:'center'}}>{course.courseCode}</TableCell>
                                  <TableCell style={{textAlign:'center'}}>{course.semester}</TableCell>
                                  <TableCell style={{textAlign:'center'}}><Button href='src/app/dashboard/courses/[courseId]/page.tsx'>Edit</Button></TableCell>
                                  <TableCell style={{textAlign:'center'}}>{course.markersNeeded}</TableCell>
                                  <TableCell style={{textAlign:'center'}}>{course.applicants}</TableCell>
                                  <TableCell style={{textAlign:'center'}}> {course.needMarkers ? (
                                      <Button variant="contained" color="success" style={{width:'75%'}}>
                                        Complete
                                      </Button>
                                    ) : (
                                      <Button variant="contained" color="error" style={{width:'75%'}}>
                                        Incomplete
                                      </Button>
                                    )}
                                  </TableCell>
                              </TableRow>
                          ))}
                          {emptyRows > 0 && (
                            <TableRow style={{ height: 69.5 * emptyRows }}>
                              <TableCell colSpan={6} />
                            </TableRow>
                          )}
                        </TableBody>
                    </Table>
                    <TablePagination 
                      component='div'
                      sx={{width:'100%'}}
                      rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                      colSpan={3}
                      count={data.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      showFirstButton= {true}
                      showLastButton= {true}
                    />
                </TableContainer>
            </Box>
        </>
    )
}
