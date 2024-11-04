"use client"
import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useState, useEffect } from "react";
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Loading from '../components/loading';
//import img1 from 'C:/Users/Christian/Desktop/CvSU-Drive/CvSU-Drive/app/login/Cvsu-logo.png'

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
            <div className="bg-green-100 min-h-screen flex items-center justify-between p-20">
    {/* Left Side Sample Text */}
    <div className="flex-1 text-green-900 ml-20 mb-14 justify-start bg-green-200 py-16 mr-4 ">
        <div className="flex mb-4 mx-24">
            {/* <img src= img1={} alt="wala potaena" /> */}
            <h2 className="text-3xl font-bold text-black">Welcome to</h2>
            <h2 className="text-3xl font-bold text-green-700 ml-2">CvSU Drive - Silang Campus</h2>
        </div> 
        <p className="mb-4 text-justify mx-24 tracking-widest leading-relaxed">
    In the early part of 2006, loads of requests from the members of the Silang community have been received by the local government for the establishment of the branch campus of Cavite State University. Believing in the aspirations of CvSU, Mayor Clarito A. Poblete representing the Local Government of Silang and Dr. Ruperto S. Sangalang, representing Cavite State University signed a Memorandum of Agreement on April 18, 2006 granting the creation of Cavite State University Silang Campus. CvSU – Silang initially offered six curricular programs while holding fast to the theme “Focus to Build a Guaranteed Future.” The degree programs offered were: Bachelor of Science in Business Management, Bachelor of Science in Tourism and Resort Management, Bachelor of Science in Computer Science, Bachelor of Science in Landscape Design and Management, Bachelor of Science in Hotel and Restaurant Management, and Diploma in Hotel and Restaurant Management.
</p>
    </div>


    <Box
    component="form"
    sx={{ '& > :not(style)': { m: 1, width: '100%' } }}
    noValidate
    autoComplete="off"
    className="bg-white rounded-lg shadow-2xl p-10 px-8 max-w-lg mr-36 ring-1 ring-gray-300 pb-20 pt-24 mb-16" // Increased padding and width
    onSubmit={handleLogin} 
>
    <div className='max-w-md'>
        <h1 className="text-2xl font-bold mb-4 text-center text-green-700 pb-8">
            CvSU - Silang Campus
        </h1>

        <TextField
            className="bg-white mb-6"
            id="username"
            label="Username"
            variant="outlined"
            fullWidth
            value={userName}
            onChange={(e) => setUserName(e.target.value)} 
        />
        
        <TextField
            className="bg-white mb-6"
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
                        <div className="text-red-500 mb-4">
                            {error}
                        </div>
                    )}

                    <Stack spacing={2} direction="row" justifyContent="center" className="mt-4 ">
                        <Button 
                            className='
                            rounded-full px-8
                            text-gray-500 
                            hover:bg-green-600 
                            hover:text-green-200
                            border-green-700
                            hover:border-green-500'
                            
                            variant="outlined"
                            type="submit"
                        >
                            Login
                        </Button>
                    </Stack>
                </Box>
            </div>
        )
    );
}
