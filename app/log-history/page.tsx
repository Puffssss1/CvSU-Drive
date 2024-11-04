import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Header from '@/components/Header';

function createData(
    name: string,
    department: string,
    date: string,
    file: string,
    ) {
        return { name, department, date, file};
    }

    const rows = [
        createData('Gil Menciano', 'Department of Information Technology', 'January 01 2024', 'Nehemiah.docx'),
        createData('Nehemiah Bernardo Mota', 'Department of Information Technology', 'January 02 2024', 'Gil.docx'),
        createData('Joshua', 'Department of Information Technology', 'January 03 2024', 'Joshua.docx'),
    ];

function LogHistory
() {
return (
    
    <div>
        <><Header />
        <TableContainer component={Paper}
        sx={{
            margin:'10px',


        }}
        >
            <h1 className='font-bold text-3xl'> |   LOG HISTORY </h1>
            <Table sx={{ minWidth: 200 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align='left' className='font-bold text-green-800'>Name</TableCell>
                        <TableCell align="left" className='font-bold text-green-800'>Department</TableCell>
                        <TableCell align="left" className='font-bold text-green-800'>Date</TableCell>
                        <TableCell align="left" className='font-bold text-green-800'>File</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="left">{row.department}</TableCell>
                            <TableCell align="left">{row.date}</TableCell>
                            <TableCell align="left">{row.file}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer></>
    </div>
)
}

export default LogHistory
