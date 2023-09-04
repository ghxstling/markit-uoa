'use client'

import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from "../components/Sidebar"
import StarIcon from '@mui/icons-material/Star';
import Container from 'react-bootstrap/Container';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';
import React, { useState, useEffect } from 'react';
import { fetchData } from 'next-auth/client/_utils';
import { AlignStart } from 'react-bootstrap-icons';
import { start } from 'repl';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
      event: React.MouseEvent<HTMLButtonElement>,
      newPage: number,
    ) => void;
  }


function TablePaginationActions(props: TablePaginationActionsProps) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;
  
    const handleFirstPageButtonClick = (
      event: React.MouseEvent<HTMLButtonElement>,
    ) => {
      onPageChange(event, 0);
    };
  
    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onPageChange(event, page - 1);
    };
  
    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onPageChange(event, page + 1);
    };
  
    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };
  
    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Box>
    );
  }

export default function CSHomepage(){

    interface Course {
        course: string
        semester: string
        markers: number
        applicants: number
        status: boolean
        id: number
    }
    
    const [data,setData] = useState<Course[]>([]);;
    const api = String(process.env.ApiToken);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
          const response = await fetch('https://64edee691f87218271420833.mockapi.io/Courses/Course');
          const jsonData = await response.json();
          setData(jsonData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      const [page, setPage] = React.useState(0);
      const [rowsPerPage, setRowsPerPage] = React.useState(5);
    
      const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
    
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
                <TableContainer component={Paper}>
                    <Table style={{paddingTop:40, margin:0}}>
                        <TableHead>
                            <TableRow style={{width:'100%'}}>
                                <TableCell style={{textAlign:'center'}}>Course <ArrowDownwardIcon></ArrowDownwardIcon></TableCell>
                                <TableCell style={{textAlign:'center'}}>Semester <ArrowDownwardIcon/></TableCell>
                                <TableCell style={{textAlign:'center'}}>Edit Course Details</TableCell>
                                <TableCell style={{textAlign:'center'}}>Markers Needed <Tooltip title="Markers"><InfoOutlinedIcon/></Tooltip> <ArrowDownwardIcon/></TableCell>
                                <TableCell style={{textAlign:'center'}}>Number of Applicants <Tooltip title="Applicants"><InfoOutlinedIcon/></Tooltip> <ArrowDownwardIcon/></TableCell>
                                <TableCell style={{textAlign:'center'}}>Status <Tooltip title="status"><InfoOutlinedIcon/></Tooltip> </TableCell>
                            </TableRow>
                        </TableHead>
                        {(rowsPerPage > 0
                            ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : data
                        ).map((course, index) => (
                            <TableRow key={index} style={{}}>
                                <TableCell style={{textAlign:'center'}}>{course.course}</TableCell>
                                <TableCell style={{textAlign:'center'}}>{course.semester}</TableCell>
                                <TableCell style={{textAlign:'center'}}><Button>Edit</Button></TableCell>
                                <TableCell style={{textAlign:'center'}}>{course.markers}</TableCell>
                                <TableCell style={{textAlign:'center'}}>{course.applicants}</TableCell>
                                <TableCell style={{textAlign:'center'}}> {course.status ? (
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
                        <TableFooter style={{ display: 'flex', justifyContent: 'center', textAlign:'center' }}>
                            <TableRow>
                                <TablePagination 
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={3}
                                count={data.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                SelectProps={{
                                    inputProps: {
                                    'aria-label': 'rows per page',
                                    },
                                    native: true,
                                }}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
                <div style={{paddingTop:50}}></div>
            </div>
        </div>
    )
}