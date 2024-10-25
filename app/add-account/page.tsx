import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const type = [
    { value: 'Faculty', label: 'Faculty Account' },
    { value: 'Chairperson', label: 'Chairperson Account' },
];

const department = [
    { value: 'DIT', label: 'Department of Information Technology' },
    { value: 'DE', label: 'Department of Education' },
];

const sex = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
];



function AddAccount() {
    return (
        <Box
            component="form"
            className="flex flex-col items-center p-6 overflow-hidden"
            noValidate
            autoComplete="off"
        >
            <div>
                <h1 className='font-bold text-3xl mb-4 px-6'>| ADD ACCOUNT</h1>
            </div>

            {[
                
                { id: 'name', label: 'Name', type: 'text' },
                { id: 'email', label: 'Email', type: 'email' },
                { id: 'password', label: 'Password', type: 'password' },
                { id: 'contact', label: 'Contact', type: 'text' },
                { id: 'role', label: 'Role', options: type, defaultValue: 'Faculty' },
                { id: 'department', label: 'Department', options: department, defaultValue: 'DIT' },
                { id: 'sex', label: 'Sex', options: sex, defaultValue: 'Male' }
                
            ].map(field => (
                <div className='mb-4 w-full max-w-xs' key={field.id}>
                    <TextField
                        id={`outlined-${field.id}`}
                        label={field.label}
                        select={!!field.options}
                        type={field.type || 'text'}
                        variant="outlined"
                        fullWidth
                        defaultValue={field.defaultValue}
                    >
                        {field.options && field.options.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </div>
            ))}

            <div className='mb-4 w-full max-w-xs'>
                <TextField
                    label="Birthday"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                        min: '1900-01-01',
                        max: new Date().toISOString().split('T')[0],
                    }}
                    variant="outlined"
                    fullWidth
                />
            </div>

            <Stack spacing={2} direction="row">
            <Button variant="contained">Create Account</Button>
            </Stack>
        </Box>
    );
}

export default AddAccount;
