"use client";
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Loading from '../components/loading';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';



export default function Login() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { status: sessionStatus } = useSession(); 
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    useEffect(() => {
        if (sessionStatus === "authenticated") {
            router.replace("/");
        }
    }, [sessionStatus, router]);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        // Basic validation
        if (!userName) {
            setError("Email is required.");
            return;
        }
    
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(userName)) {
            setError("Please enter a valid email address.");
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
    
        // If validation passes, clear error and proceed with login
        setError("");
    
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
            setError("An error occurred. Please try again.");
        }
    };

    if (sessionStatus === "loading") {
        return <Loading />;
    }

    return (
        sessionStatus !== "authenticated" && (
            <div className="bg-[url('/images/cvsuuu.png')] bg-no-repeat bg-cover min-h-screen flex items-center justify-center p-10">
                {/* Left Side Sample Text */}
                <Box
                    component="form"
                    sx={{ 
                        '& > :not(style)': { m: 0, width: '100%' },
                        maxWidth: '1350px',         // Set a max-width for the login box
                        minHeight: '550px',        // Increase the height (you can adjust the value)
                        marginRight: '4rem'
                    }}
                    noValidate
                    autoComplete="off"
                    className="rounded-lg shadow-2xl ring-1 ring-green-800 backdrop-blur-sm bg-green-900 bg-opacity-30"
                > 
                    <div className="text-green-900">
    {/* <div className="flex mx-10 mt-10 m-4">
        <h2 className="text-3xl font-bold text-black">Welcome to</h2>
        <h2 className="text-3xl font-bold text-black ml-2">CvSU Drive - Silang Campus</h2>
    </div> */}
    <br />
    
    {/* Vision Section */}
    <p className="text-justify mx-5 md:mx-10 mt-10 tracking-widest leading-10 text-green-100 font-bold text-3xl sm:text-4xl lg:text-5xl">
        Vision
    </p>
    <p className="text-justify mx-5 md:mx-10 mt-6 tracking-widest leading-10 text-white text-base sm:text-lg lg:text-md">
        The premier university in historic Cavite globally recognized for excellence in character development, academics, research, innovation, and sustainable community engagement.
    </p>
    <br />

    {/* Mission Section */}
    <p className="text-justify mx-5 md:mx-10 mt-10 tracking-widest leading-10 text-green-100 font-bold text-3xl sm:text-4xl lg:text-5xl">
        Mission
    </p>
    <p className="text-justify mx-5 md:mx-10 mt-6 tracking-widest leading-10 text-white text-base sm:text-lg lg:text-md">
        Cavite State University shall provide excellent, equitable, and relevant educational opportunities in the arts, sciences, and technology through quality instruction and responsive research and development activities. It shall produce professional, skilled, and morally upright individuals for global competitiveness.
    </p>
</div>

                </Box>

                {/* Login Form Box */}
                <Box
                    component="form"
                    sx={{ 
                        '& > :not(style)': { m: 0, width: '100%' },
                        maxWidth: '1000px',         // Set a max-width for the login box
                        minHeight: '700px',        // Increase the height (you can adjust the value)
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
                            className="w-200 h-auto" 
                        />
                    </div>
                    <div className=''>
                    <TextField
                        className="bg-white mb-8 mt-8 text-3xl"
                        id="username"
                        label="Email"
                        variant="outlined"
                        fullWidth
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        error={!!error && error.includes("Email")}
                        helperText={error && error.includes("Email") ? error : ""} 
                        InputProps={{
                            classes: {
                              input: "text-2xl", // Adjusts the input text size
                            },
                          }}
                          InputLabelProps={{
                            className: "text-xl", // Adjusts the label text size
                          }}
                        />
                    </div>
                    
                    <div>
                    <TextField
                        className="bg-white mb-8"
                        id="password"
                        label="Password"
                        variant="outlined"
                        fullWidth
                        type={showPassword ? 'text' : 'password'} // Toggle between 'text' and 'password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={!!error && error.includes("Password")}
                        InputProps={{
                            classes: {
                                input: "text-2xl", // Adjusts the input text size
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
                            className: "text-xl", // Adjusts the label text size
                        }}
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
                            className="rounded-full px-8 text-gray-500 hover:bg-green-600 hover:text-green-200 border-green-700 hover:border-green-500 w-[200px] h-[60px]"
                            variant="outlined"
                            type="submit"
                        >
                            Login
                        </Button>
                    </Stack>

                    <div className='mt-6 text-slate-200'>
                        ____________________________________________
                    </div>

                    <button className='text-blue-500 hover:underline cursor-pointer mt-10'>
                        Forgot password?
                    </button>

                    
                    </div>

                    
                    
                </Box>
            </div>
        )
    );
}
