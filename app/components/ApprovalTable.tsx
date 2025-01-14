import * as React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

function createData(
    fileName: string,
    uploader: string,
    date:  string,
){
    return { fileName, uploader, date };
}

const  rows = [
    createData('Records', 'jim', '01-01-1999'),
    createData('Records', 'jim', '01-01-1999'),
    createData('Records', 'jim', '01-01-1999'),
    createData('Records', 'jim', '01-01-1999'),
    createData('Records', 'jim', '01-01-1999'),
];

function ApprovalTable() {
  return (
    <TableContainer component={Paper} sx={{ margin: '10px', marginLeft: '220px' }}>
      <Table sx={{ minWidth: 150 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align='left' sx={{ width: '25%' }}>File Name</TableCell>
            <TableCell align="left" sx={{ width: '10%' }}>Uploader</TableCell>
            <TableCell align="left" sx={{ width: '10%' }}>Date Uploaded</TableCell>
            <TableCell align="left" sx={{ width: '10%' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.fileName}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.fileName}
              </TableCell>
              <TableCell align="left">{row.uploader}</TableCell>
              <TableCell align="left">{row.date}</TableCell>

              {/* actions whether to revise approve or decline */}
              <TableCell align="left">
                <div className='flex flex-row justify-between gap-0'>
                    <button type='button' className='text-white bg-green-800 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-800 dark:hover:bg-green-700 dark:focus:ring-green-800'>
                        approve
                    </button>
                    <button type='button' className='text-white bg-blue-800 hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-400 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-800 dark:hover:bg-blue-700 dark:focus:ring-blue-500'>
                        revision
                    </button>
                    <button type='button' className='text-white bg-red-400 hover:bg-red-500 focus:outline-none focus:ring-4 focus:ring-red-400 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-800 dark:hover:bg-red-700 dark:focus:ring-red-500'>
                        decline
                    </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ApprovalTable