"use client";
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ForgetPassword() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(""); // State for OTP
    const [password, setPassword] = useState(""); // State for new password
    const [confirmPassword, setConfirmPassword] = useState(""); // State for confirming new password
    const [error, setError] = useState("");
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        // Basic validation
        if (!email) {
            setError("Email is required.");
            return;
        }

        // Basic validation
        if (!otp) {
            setError("OTP is required.");
            return;
        }
    
        if (!password) {
            setError("Password is required.");
            return;
        }
    
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        // Fetch OTP from Supabase
        const { data, error: fetchError } = await supabase
            .from('store_otp')
            .select('otp, expirationTime, emailAddress')
            .eq('otp', otp)
            .single();


        if (fetchError) {
            setError("Error fetching OTP.");
            return;
        }

        // Validate OTP
        // const currentTime = Date.now();
        // console.log(currentTime, Number(data.expirationTime))
        if (data.otp === Number(otp) && email === data.emailAddress) {
            // // OTP is valid, proceed to update the password
            try {
                const response = await fetch('/api/editUsers', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password: password }),
                });
    
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to update password');
                }
    
                const data = await response.json();
            } catch (err) {
                setError(err.message);
            }
            

            // Password updated successfully
            setError("");
            alert("Password updated successfully!");
            // router.push('/login'); // Redirect to login or another page
        } else {
            setError("Invalid or expired OTP.");
        }
    };

    return (
        <Box
            sx={{
                backgroundImage: "url('/images/cvsuuu.png')",
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px'
            }}
        >
            <Box
                component="form"
                sx={{ 
                    maxWidth: '1000px',
                    minHeight: '700px',
                    padding: '40px',
                    margin: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(10px)',
                }}
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit} 
            >
                <Box sx={{ display: 'flex', justifyContent: 'center', paddingY: '16px' }}>
                    <img 
                        src="/images/Cvsu-logo.png" 
                        alt="CvSU Logo" 
                        style={{ width: '200px', height: 'auto' }} 
                    />
                </Box>

                <Box sx={{ marginBottom: '16px', fontSize: '1.25rem' }}>Input OTP and confirm your password</Box>
                <TextField
                    id="email"
                    label="Email"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!error && error.includes("Email")}
                    helperText={error && error.includes("Email") ? error : ""} 
                    InputProps={{
                        sx: {
                            fontSize: '1.5rem',
                        },
                    }}
                    InputLabelProps={{
                        sx: {
                            fontSize: '1.25rem',
                        },
                    }}
                    sx={{ marginBottom: '50px', backgroundColor: 'white' }} // Add margin bottom here
                />

                <TextField
                    id="otp"
                    label="Enter OTP"
                    variant="outlined"
                    fullWidth
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    error={!!error && error.includes("OTP")}
                    helperText={error && error.includes("OTP") ? error : ""} 
                    InputProps={{
                        sx: {
                            fontSize: '1.5rem',
                        },
                    }}
                    InputLabelProps={{
                        sx: {
                            fontSize: '1.25rem',
                        },
                    }}
                    sx={{ marginBottom: '50px', backgroundColor: 'white' }} // Add margin bottom here
                />

                <TextField
                    id="password"
                    label="Password"
                    variant="outlined"
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!error && error.includes("Password")}
                    InputProps={{
                        sx: {
                            fontSize: '1.5rem',
                        },
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    InputLabelProps={{
                        sx: {
                            fontSize: '1.25rem',
                        },
                    }}
                    sx={{ marginBottom: '50px', backgroundColor: 'white' }} // Add margin bottom here
                />

                <TextField
                    id="confirmPassword"
                    label="Confirm Password"
                    variant="outlined"
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={!!error && error.includes("Passwords do not match")}
                    InputProps={{
                        sx: {
                            fontSize: '1.5rem',
                        },
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    InputLabelProps={{
                        sx: {
                            fontSize: '1.25rem',
                        },
                    }}
                    sx={{ marginBottom: '50px', backgroundColor: 'white' }} // Add margin bottom here
                />

                {error && (
                    <Box sx={{ color: 'red', marginBottom: '16px', textAlign: 'center' }}>
                        {error}
                    </Box>
                )}

                <Stack spacing={2} direction="row" justifyContent="center" sx={{ marginTop: '32px' }}>
                    <Button 
                        className="rounded-full px-8 text-gray-500 hover:bg-green-600 hover:text-green-200 border-green-700 hover:border-green-500 w-[200px] h-[60px]"
                        variant="outlined"
                        type="submit">
                        Confirm Password
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
}