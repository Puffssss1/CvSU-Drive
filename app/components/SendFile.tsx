'use client'; 

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useSession } from 'next-auth/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

interface User {
    id: string;
    name: string;
}

const SendFile = () => {
    const [category, setCategory] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser , setSelectedUser ] = useState<string>('');
    const { data: session } = useSession();
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [open, setOpenModal] = useState(false);
    const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/user');
                const data = await response.json();
                setUsers(data); // Ensure data is in the correct format
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleCategoryChange = (event: SelectChangeEvent) => {
        setCategory(event.target.value);
    };

    const handleUserChange = (event: SelectChangeEvent) => {
        setSelectedUser (event.target.value); // Update selected user
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files ? event.target.files[0] : null;
        setFile(selectedFile);
    };

    function generateRandomString(length: number): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    function generateFileReference(): string {
        const timestamp = Date.now(); // Unique timestamp
        const randomString = generateRandomString(8); // Random 8-character string
        return `${timestamp}_${randomString}`;
    }

    const handleUpload = async () => {
        if (!file || !selectedUser ) {
            alert('Please select a file and a user to send it to.'); // User feedback
            return;
        }

        // Define allowed file types
        const allowedFileTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

        // Check if the file type is allowed
        if (!allowedFileTypes.includes(file.type)) {
            alert('Invalid file type. Please upload a PDF, DOCX, or XLSX file.'); // User feedback
            return;
        }

        setUploading(true);

        const fileName = `documents/${Date.now()}_${file.name}`; // Add a timestamp for uniqueness

        // Upload file to Supabase Storage
        const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(fileName, file);

        if (uploadError) {
            console.error('Error uploading file:', uploadError);
            alert('Error uploading file. Please try again.'); // User feedback
            setUploading(false);
            return;
        }

        const fileReference = generateFileReference();

        // Get the public URL for the uploaded file
        const { data: publicUrlData } = supabase.storage
            .from('documents')
            .getPublicUrl(fileName);

        const publicURL = publicUrlData.publicUrl; // Correctly access publicUrl

        // Insert file metadata into Supabase
        const { error: metadataError } = await supabase
            .from('file_metadata')
            .insert([
                {
                    file_name: file.name,
                    uploaded_by: selectedUser ,
                    sent_by: session?.user?.name || 'Unknown', // Handle session safely
                    file_url: publicURL,
                    isApproved: false,
                    referenceId: fileReference,
                    Category: category, // Include category in metadata
                },
            ]);

        if (metadataError) {
            console.error('Error inserting metadata:', metadataError);
            alert('Error saving file metadata. Please try again.'); // User feedback
        } else {
            alert('File sent successfully! '); // User feedback
            setUploadedFileUrl(publicURL); // Set the uploaded file URL for display
        }

        setUploading(false);
    };

    const openModal = () => setOpenModal(true);
    const closeModal = () => setOpenModal(false);

    return (
        <div>
            <Button
                onClick={openModal}
                variant="contained"
                sx={{
                    backgroundColor: '#FFB000',
                    color: '#6A1E9C',
                    fontSize: '1rem',
                    '&:hover': {
                    backgroundColor: '#511281',
                    color: '#FFB000',
                    },
                    borderRadius: '1rem',
                    padding: '0.5rem 2rem',
                }}
                >
                Send File
                </Button>
            <Modal open={open} onClose={closeModal}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 500,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 3,
                }}>
                    <button onClick={closeModal} className='absolute top-2 right-2'><CloseIcon /></button>
                    <h2>Send File</h2>
                    <div className='flex flex-col gap-3'>
                        <FormControl fullWidth>
                            <InputLabel id="user-select-label">Select User</InputLabel>
                            <Select
                                labelId="user-select-label"
                                value={selectedUser }
                                onChange={handleUserChange}
                            >
                                {users.map((user) => (
                                    <MenuItem key={user.id} value={user.id}>
                                        {user.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="category-select-label">Select Category</InputLabel>
                            <Select
                                labelId="category-select-label"
                                value={category}
                                onChange={handleCategoryChange}
                            >
                                <MenuItem value="">
                                </MenuItem>
                                <MenuItem value={'COG'}>Certificate of Grade</MenuItem>
                                <MenuItem value={'IPCR'}>Individual Performance Commitment Record</MenuItem>
                                <MenuItem value={'OPCR'}>OPCR</MenuItem>
                                <MenuItem value={'Memorandum'}>Memorandum</MenuItem>
                                <MenuItem value={'Minutes of Meeting'}>Minutes of the Meeting</MenuItem>
                                <MenuItem value={'Board Resolution'}>Board Resolution</MenuItem>
                                <MenuItem value={'Faculty Schedule'}>Faculty Schedule</MenuItem>
                                <MenuItem value={'Faculty Workload'}>Faculty Workload</MenuItem>
                                <MenuItem value={'AL'}>Approved Letter</MenuItem>
                                <MenuItem value={'Accomplishment Report'}>Accomplishment Report</MenuItem>
                                <MenuItem value={'Annual Report'}>Annual Report</MenuItem>
                                <MenuItem value={'Student Evaluation of Teacher Result'}>Student Evaluation of Teacher Result</MenuItem>
                                <MenuItem value={'Class Observation'}>Class Observation</MenuItem>
                            </Select>
                        </FormControl>
                        <input type="file" onChange={handleFileChange} />
                        <Button onClick={handleUpload} disabled={uploading} variant='contained' className='bg-[#6A1E9C] text-[#FFB000] text-base rounded-lg'>
                            {uploading ? 'Uploading...' : 'Upload'}
                        </Button>
                        {uploadedFileUrl && (
                            <div className='mt-3'>
                                <p>File uploaded successfully!</p>
                                <a href={uploadedFileUrl} target="_blank" rel="noopener noreferrer">
                                    View File
                                </a>
                            </div>
                        )}
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

export default SendFile;