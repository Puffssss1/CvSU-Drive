"use client";
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Loading from '../components/loading';



export default function Login() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { status: sessionStatus } = useSession(); 
    const router = useRouter();

    useEffect(() => {
        if (sessionStatus === "authenticated") {
            router.replace("/");
        }
    }, [sessionStatus, router]);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        try {
            const res = await signIn("credentials", {
                email: userName,
                password: password,
                redirect: false,
            });

            if (res?.error) {
                setError("Invalid Credentials");
                return;
            }

            router.replace("/");
        } catch (error) {
            console.error("Error signing in:", error);
            setError("Invalid Credentials");
        }
    };

    if (sessionStatus === "loading") {
        return <Loading />;
    }

    return (
        sessionStatus !== "authenticated" && (
            <div className="bg-[url('/images/LoginBackground.png')] bg-no-repeat bg-cover min-h-screen flex items-center justify-center p-10">
                {/* Left Side Sample Text */}
                <Box
                    component="form"
                    sx={{ 
                        '& > :not(style)': { m: 0, width: '100%' },
                        maxWidth: '1000px',         // Set a max-width for the login box
                        minHeight: '550px',        // Increase the height (you can adjust the value)
                    }}
                    noValidate
                    autoComplete="off"
                    className="rounded-lg shadow-2xl ring-1 ring-gray-300 backdrop-blur-sm bg-green-100 bg-opacity-35"
                > 
                    <div className="text-green-900">
                        <div className="flex mx-10 mt-10 m-4">
                            <h2 className="text-3xl font-bold text-black">Welcome to</h2>
                            <h2 className="text-3xl font-bold text-black ml-2">CvSU Drive - Silang Campus</h2>
                        </div> 
                        <p className="text-justify mx-10  tracking-widest leading-10 text-black ">
                            In the early part of 2006, loads of requests from the members of the Silang community have been received by the local government for the establishment of the branch campus of Cavite State University. Believing in the aspirations of CvSU, Mayor Clarito A. Poblete representing the Local Government of Silang and Dr. Ruperto S. Sangalang, representing Cavite State University signed a Memorandum of Agreement on April 18, 2006 granting the creation of Cavite State University Silang Campus. CvSU – Silang initially offered six curricular programs while holding fast to the theme “Focus to Build a Guaranteed Future.” The degree programs offered were: Bachelor of Science in Business Management, Bachelor of Science in Tourism and Resort Management, Bachelor of Science in Computer Science, Bachelor of Science in Landscape Design and Management, Bachelor of Science in Hotel and Restaurant Management, and Diploma in Hotel and Restaurant Management.
                        </p>
                    </div>
                </Box>

                {/* Login Form Box */}
                <Box
                    component="form"
                    sx={{ 
                        '& > :not(style)': { m: 0, width: '100%' },
                        maxWidth: '400px',         // Set a max-width for the login box
                        minHeight: '550px',        // Increase the height (you can adjust the value)
                        padding: '40px',           // Add padding to give more space inside the form
                        margin: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',      // Center the content horizontally
                        textAlign: 'center',       // Center the text (username, password labels)
                        backgroundColor: 'white'
                    }}
                    noValidate
                    autoComplete="off"
                    className="rounded-lg shadow-2xl ring-1 ring-gray-300 backdrop-blur-2xl"
                    onSubmit={handleLogin} 
                >
                    {/* Add the logo above the heading */}
                    <div className="flex justify-center py-4">
                        <img 
                            src="/images/Cvsu-logo.png" 
                            alt="CvSU Logo" 
                            className="w-200 h-auto"  // You can adjust the size of the logo here
                        />
                    </div>
                    <div className=''>
                    <TextField
                        className="bg-white mb-8 mt-8"
                        id="username"
                        label="Username"
                        variant="outlined"
                        fullWidth
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)} 
                    />
                    </div>
                    
                    <div>
                    <TextField
                        className="bg-white mb-8"
                        id="password"
                        label="Password"
                        variant="outlined"
                        fullWidth
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                    </div>
                    

                    {error && (
                        <div className="text-red-500 mb-4 text-center">
                            {error}
                        </div>
                    )}
                    <div>
                    <Stack spacing={2} direction="row" justifyContent="center" className="mt-16">
                        <Button 
                            className="rounded-full px-8 text-gray-500 hover:bg-green-600 hover:text-green-200 border-green-700 hover:border-green-500 w-[150px] h-[40px]"
                            variant="outlined"
                            type="submit"
                        >
                            Login
                        </Button>
                    </Stack>
                    </div>
                    
                </Box>
            </div>
        )
    );
}
