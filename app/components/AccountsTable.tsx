import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Header from '@/components/Header';
import Loading from '../components/loading';
import EditIcon from '@mui/icons-material/Edit';

interface User {
  name: string;
  department: string;
  email: string;
  role: string;
  contact: string;
}

function AccountsTable() {
  const [users, setUsers] = React.useState<User[]>([]); 
  const [loading, setLoading] = React.useState<boolean>(true); 

  // Fetch user data from the API when the component mounts
  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/user');
        const data = await response.json();
        setUsers(data); 
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false); 
      }
    };

    fetchUsers();
  }, []); 

  // If data is loading, show a loading message
  if (loading) {
    return <Loading />;
  }

  return (
    <>

    
    {/* <div className='ml-52'> */}
    
      <TableContainer component={Paper} sx={{ margin: '10px', marginLeft: '13rem' }} className=''>
        <Table sx={{ minWidth: 200 }} aria-label="simple table">
          <TableHead>
            <TableRow className=''>
              <TableCell align="left" sx={{ width: '15%' }}>Name</TableCell>
              <TableCell align="left" sx={{ width: '35%' }}>Department</TableCell>
              <TableCell align="left" sx={{ width: '20%' }}>E-mail</TableCell>
              <TableCell align="left" sx={{ width: '15%' }}>Contact</TableCell>
              <TableCell align="left" sx={{ width: '10%' }}>Role</TableCell>
              <TableCell align="left" sx={{ width: '10%' }}> Edit</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {user.name}
                </TableCell>
                <TableCell align="left">{user.department}</TableCell>
                <TableCell align="left">{user.email}</TableCell>
                <TableCell align="left">{user.contact}</TableCell>
                <TableCell align="left">{user.role}</TableCell>
                <TableCell align="left">
                  <button className='hover:-translate-y-1 ease-linear'><EditIcon/></button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    {/* </div> */}
      
    </>
  );
}

export default AccountsTable;
