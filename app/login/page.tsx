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

export default function Login() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { status: sessionStatus} = useSession();

    const router = useRouter();

    useEffect(() => {
        if (sessionStatus === "authenticated") {
            router.replace("/");
        }
    }, [sessionStatus, router]);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        try {
            const res = await signIn("credentials",{
                email: userName,
                password: password,
                redirect: false,
            });

            if (res?.error) {
                setError("Invalid Credtials");
                return
            }

            router.replace("/");
        } catch (error) {
            console.error("Error signing in:", error);
            setError("Invalid Credtials");
        }
    };

    if (sessionStatus === "loading") {
        return <Loading />;
    }

    return (
        sessionStatus !== "authenticated" && (
            <div className="bg-green-100 min-h-screen flex items-center justify-center p-6">
                <Box
                    component="form"
                    sx={{ '& > :not(style)': { m: 1, width: '100%' } }}
                    noValidate
                    autoComplete="off"
                    className="bg-white rounded-lg shadow-md p-6 px-4"
                    onSubmit={handleLogin} 
                >
                    <h1 className="text-2xl font-bold mb-4 text-center text-green-700">
                        CvSU - Silang Campus
                    </h1>

                    <TextField
                        className="bg-white mb-4 px-2"
                        id="username"
                        label="Username"
                        variant="outlined"
                        fullWidth
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)} 
                    />
                    
                    <TextField
                        className="bg-white mb-4 px-2"
                        id="password"
                        label="Password"
                        variant="outlined"
                        fullWidth
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                    />

                    {error && (
                        <div className="errorMessage">
                            {error}
                        </div>
                    )}

                    <Stack spacing={2} direction="row" justifyContent="center" className="mt-4 ">
                        <Button 
                            className='
                            rounded-full px-8 
                            text-gray-800 
                            hover:bg-blue-600 
                            hover:text-blue-200'
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