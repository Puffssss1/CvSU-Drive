import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Header from '@/components/Header';

interface User {
  name: string;
  department: string;
  email: string;
  role: string;
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
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <TableContainer component={Paper} sx={{ margin: '10px' }}>
        <Table sx={{ minWidth: 200 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Department</TableCell>
              <TableCell align="left">E-mail</TableCell>
              <TableCell align="left">Role</TableCell>
              <TableCell align="left"></TableCell>
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
                <TableCell align="left">{user.role}</TableCell>
                <TableCell align="left"></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default AccountsTable;
