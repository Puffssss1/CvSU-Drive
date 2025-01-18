'use client'
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Typography } from '@mui/material';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

interface Folder {
    id: string;
    file_name: string;
    uploaded_by: string;
    uploaded_at: string;
    isApproved: boolean; // Add isApproved field
}

function ApprovalTable() {
    const { data: session } = useSession();
    const [rows, setRows] = useState<Folder[]>([]); // State to hold fetched data
    const [loading, setLoading] = useState<boolean>(true); // Loading state

    useEffect(() => {
        const fetchFolders = async () => {
            setLoading(true); // Set loading to true before fetching
            const { data, error } = await supabase
                .from('file_metadata')
                .select('id, file_name, uploaded_by, uploaded_at, isApproved') // Fetch isApproved field
                .order('uploaded_at', { ascending: false });

            if (error) {
                console.error('Error fetching folders:', error);
            } else {
                setRows(data); // Set the fetched data to rows
            }
            setLoading(false); // Set loading to false after fetching
        };

        fetchFolders();
    }, []);

    const handleApprove = async (folderId: string) => {
        const { error } = await supabase
            .from('file_metadata')
            .update({ isApproved: true }) // Update isApproved to true
            .eq('id', folderId);

        if (error) {
            console.error('Error approving folder:', error);
        } else {
            // Update the local state to reflect the change
            setRows((prevRows) =>
                prevRows.map((row) =>
                    row.id === folderId ? { ...row, isApproved: true } : row
                )
            );
        }
    };

    if (loading) {
        return <Typography variant="h6" align="center">Loading...</Typography>; // Loading state
    }

    return (
        <TableContainer component={Paper} sx={{ margin: '10px', marginLeft: '220px' }}>
            <Table sx={{ minWidth: 150 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align='left' sx={{ width: '25%' }}>File Name</TableCell>
                        <TableCell align="left" sx={{ width: '10%' }}>Status</TableCell>
                        <TableCell align="left" sx={{ width: '10%' }}>Uploader</TableCell>
                        <TableCell align="left" sx={{ width: '10%' }}>Date Uploaded</TableCell>
                        <TableCell align="left" sx={{ width: '10%' }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.file_name}
                            </TableCell>
                            <TableCell align="left">{row.isApproved ? 'Approved' : 'Pending'}</TableCell>
                            <TableCell align="left">{row.uploaded_by}</TableCell>
                            <TableCell align="left">{new Date(row.uploaded_at).toLocaleDateString()}</TableCell>

                            {/* Actions: Approve, Revise, Decline */}
                            <TableCell align="left">
                                <div className='flex flex-row justify-between gap-0'>
                                    <Button 
                                        variant="contained" 
                                        color="success" 
                                        size="small" 
                                        onClick={() => handleApprove(row.id)} // Call handleApprove on click
                                        disabled={ row.isApproved} // Disable if already approved
                                    >
                                        Approve
                                    </Button>
                                    {/* <Button variant="contained" color="error" size="small">
                                        Decline
                                    </Button> */}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default ApprovalTable;