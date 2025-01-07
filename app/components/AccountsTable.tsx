import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Loading from '../components/loading';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

interface User {
  _id: string;
  name: string;
  department: string;
  email: string;
  role: string;
  contact: string;
}

function AccountsTable() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [editUser, setEditUser] = React.useState<User | null>(null);
  const [deleteUserId, setDeleteUserId] = React.useState<string | null>(null);

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

  const handleEditClick = (user: User) => {
    setEditUser(user);
  };

  const handleEditSubmit = async () => {
    if (editUser) {
      try {
        const response = await fetch(`http://localhost:3000/api/user/${editUser._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editUser),
        });

        if (response.ok) {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user._id === editUser._id ? { ...editUser } : user
            )
          );
          setEditUser(null);
        } else {
          alert('Failed to update user.');
        }
      } catch (error) {
        console.error('Error updating user:', error);
        alert('An error occurred while updating the user.');
      }
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteUserId(id);
  };

  const handleDeleteConfirm = async () => {
    if (deleteUserId) {

    console.log(deleteUserId);
      try {
        const response = await fetch(`/api/user/${deleteUserId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setUsers((prevUsers) => prevUsers.filter((user) => user._id !== deleteUserId));
          setDeleteUserId(null);
        } else {
          alert('Failed to delete user.');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('An error occurred while deleting the user.');
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteUserId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editUser) {
      setEditUser({ ...editUser, [name]: value });
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ margin: '10px', marginLeft: '13rem' }}>
        <Table sx={{ minWidth: 200 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left" sx={{ width: '15%' }}>Name</TableCell>
              <TableCell align="left" sx={{ width: '35%' }}>Department</TableCell>
              <TableCell align="left" sx={{ width: '20%' }}>E-mail</TableCell>
              <TableCell align="left" sx={{ width: '15%' }}>Contact</TableCell>
              <TableCell align="left" sx={{ width: '10%' }}>Role</TableCell>
              <TableCell align="left" sx={{ width: '10%' }}>Edit</TableCell>
              <TableCell align="left" sx={{ width: '10%' }}>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.contact}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <button onClick={() => handleEditClick(user)} className="hover:-translate-y-1 ease-linear">
                    <EditIcon />
                  </button>
                </TableCell>
                <TableCell>
                  <button onClick={() => handleDeleteClick(user._id)} className="hover:-translate-y-1 ease-linear">
                    <DeleteIcon />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      {editUser && (
        <Dialog open={!!editUser} onClose={() => setEditUser(null)}>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              name="name"
              value={editUser.name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Department"
              name="department"
              value={editUser.department}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              name="email"
              value={editUser.email}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Contact"
              name="contact"
              value={editUser.contact}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Role"
              name="role"
              value={editUser.role}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditUser(null)}>Cancel</Button>
            <Button onClick={handleEditSubmit} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteUserId && (
        <Dialog open={!!deleteUserId} onClose={handleDeleteCancel}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>Are you sure you want to delete this user?</DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} variant="contained" color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

export default AccountsTable;
