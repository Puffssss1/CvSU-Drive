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
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { SelectChangeEvent } from '@mui/material'; // Import SelectChangeEvent
interface User {
  _id: string;
  name: string;
  department: string;
  email: string;
  role: string;
  contact: string;
}

const departments = ['Department of Information Technology', 'Department of Education'];  // departments
const roles = ['Faculty', 'Chairperson', 'Admin']; // roles

function AccountsTable() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [editUser, setEditUser] = React.useState<User | null>(null);
  const [deleteUserId, setDeleteUserId] = React.useState<string | null>(null);
  const [confirmationText, setConfirmationText] = React.useState<string>("");

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
    // Name validation: at least 2 valid parts (first and last name), can include spaces, hyphens, or apostrophes
    const namePattern = /^[A-Za-zÀ-ÿ\s'-]{2,}$/;
    const nameParts = editUser .name.trim().split(/\s+/); // Split by whitespace

    if (!namePattern.test(editUser .name) || nameParts.length < 2 || nameParts.some(part => part.length < 2)) {
        alert('Name must contain at least 2 valid parts (e.g., first and last name) and can include spaces, hyphens, or apostrophes.');
        return;
    }

    // Email validation: must end with @gmail.com and contain only letters before that
    const emailRegex = /^[A-Za-z._%+-]+@gmail\.com$/;
    if (!emailRegex.test(editUser .email)) {
        alert('Please enter a valid email address ending with @gmail.com and containing only letters.');
        return;
    }

    // Validate contact number: must be a valid 11-digit phone number starting with 09
    if (!editUser .contact || !/^09\d{9}$/.test(editUser .contact)) {
      alert('Contact must be a valid 11-digit phone number starting with 09.');
      return;
  }

      try {
        const response = await fetch(`/api/editUsers/?id=${editUser._id}`, {
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
    if (deleteUserId && confirmationText === "YES" && deleteUserId) {
      try {
        const response = await fetch(`/api/editUsers/?id=${deleteUserId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setUsers((prevUsers) => prevUsers.filter((user) => user._id !== deleteUserId));
          setDeleteUserId(null);
          alert("Successfully deleted the account.");
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
    setConfirmationText(""); 
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    if (editUser) {
      setEditUser({ ...editUser, [name as string]: value });
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
                  <button onClick={() => handleEditClick(user)} className="hover:-translate-y-1 transition-transform duration-100 ease-in-out">
                    <EditIcon />
                  </button>
                </TableCell>
                <TableCell>
                  <button onClick={() => handleDeleteClick(user._id)} className="hover:-translate-y-1 transition-transform duration-100 ease-in-out">
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
        <Dialog
          open={!!editUser}
          onClose={() => setEditUser(null)}
          sx={{
            '& .MuiDialog-paper': {
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '400px', 
              maxWidth: '90vw',
            },
          }}
        >
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
            <FormControl fullWidth margin="normal">
              <InputLabel>Department</InputLabel>
              <Select
                label="Department"
                name="department"
                value={editUser.department}
                onChange={handleInputChange}
              >
                {departments.map((department) => (
                  <MenuItem key={department} value={department}>
                    {department}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
            <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Select
                label="Role"
                name="role"
                value={editUser.role}
                onChange={handleInputChange}
              >
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
            <DialogContent>
              <TextField
                label="Type 'YES' to confirm"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                fullWidth
              />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} variant="contained" className='hover:bg-blue-800'>Cancel</Button>
            <Button onClick={handleDeleteConfirm} variant="contained" color="error" className='hover:bg-red-800'>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

export default AccountsTable;
