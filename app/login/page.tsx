    import React from 'react';
    import Box from '@mui/material/Box';
    import TextField from '@mui/material/TextField';
    import Stack from '@mui/material/Stack';
    import Button from '@mui/material/Button';

    function Login() {
    return (
        <div className="bg-green-100 min-h-screen flex items-center justify-center p-6">
        <Box
            component="form"
            sx={{ '& > :not(style)': { m: 1, width: '100%' } }}
            noValidate
            autoComplete="off"
            className="bg-white rounded-lg shadow-md p-6 px-4"
        >
            <h1 className="text-2xl font-bold mb-4 text-center text-green-700">CvSU - Silang Campus</h1>

            <TextField className="bg-white mb-4 px-2" id="username" label="Username" variant="outlined" fullWidth />
            <TextField className="bg-white mb-4 px-2" id="password" label="Password" variant="outlined" fullWidth />

            <Stack spacing={2} direction="row" justifyContent="center" className="mt-4 "> {/* Center the button */}
            <Button className='rounded-full px-8  text-gray-800 hover:bg-blue-600 hover:text-blue-200' variant="outlined">Login</Button>
            </Stack>
        </Box>
        </div>
    );
    }

    export default Login;
