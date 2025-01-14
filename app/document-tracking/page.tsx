'use client'
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Header from '@/components/Header';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

function Track() {
    const [reference, setReference] = useState('');
    const [trackingData, setTrackingData] = useState<any>(null);

    const handleReferenceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setReference(event.target.value);
    };

    const fetchTrackingDetails = async () => {
        if (!reference) return;
        
    
        try {
          // Fetch data from Supabase based on reference number
          const { data, error } = await supabase
            .from('file_metadata')
            .select('*')
            .eq('referenceId', reference);
            
    
          if (error) {
            console.error('Error fetching tracking data:', error);
          } else {
            setTrackingData(data ? data[0] : null);
            console.log(data? data[0]: null);
          }
        } catch (err) {
          console.error('Error:', err);
        }
      };
    return (
        <div>
            <div className="sticky top-0 z-50">
                <Header/>
            </div>
            <div className='text-4xl m-5 bg-slate-200 p-4 font-bold font-mono ml-52'> DOCUMENT TRACKING</div>
            <div className='flex justify-items-center items-center'>
            <Box className='justify-self-start ml-56 flex items-center'
            component="form"
            sx={{ '& > :not(style)': { m: 1, width: '100ch' } }}
            noValidate
            autoComplete="off">
                <TextField className=""
                    id="Reference"
                    label="Enter Reference Number"
                    variant="outlined"
                    value={reference}
                    onChange={handleReferenceChange} />
                <Stack spacing={2} direction="row" className='flex'>
                <Button
                    variant="contained"
                    className="rounded-3xl bg-[#004225] hover:bg-green-600 h-10"
                    onClick={fetchTrackingDetails}
                    >
                        Search
                </Button>
                    </Stack>
                </Box>
            </div>
            
               

            {trackingData?(
                <>
                <div className='text-4xl m-5 bg-slate-200 p-4 font-bold font-mono ml-52'> 
                    TRACKING DETAILS
                </div>
                <div className='justify-self-center font-bold'>
                    [{trackingData.referenceId}]
                </div>
            
                <hr className='w-2/3 border-t-2 border-black border-opacity-10 mt-2 mx-auto '/>
                <div className='m-5 ml-56 flex'>
                <div className=' text-black opacity-50 mr-24'>
                    {trackingData.uploaded_at}
                </div>
                <div className='text-black'>
                        Uploading in CVSU Drive
                </div>
            </div>

            {/* <div className='m-5 ml-56 flex'>
                <div className=' text-black opacity-50 mr-24'>
                    {trackingData.uploaded_at}
                </div>
                <div className='text-black'>
                        Received by the Admin
                </div>
            </div> */}

            <div className='m-5 ml-56 flex'>
                <div className=' text-black opacity-50 mr-24'>
                    {trackingData.uploaded_at}
                </div>
                <div className='text-black'>
                    {trackingData.uploaded_by}
                </div>
            </div>

            <div className='m-5 ml-56 flex'>
                <div className=' text-black opacity-50 mr-24'>
                    {trackingData.uploaded_at}
                </div>
                <div className='text-black'>
                    Status: {trackingData.isApproved ? ' ✅ Approved' : '❌ Not Approved'}
                </div>
            </div>
            </>
            ) : (
                <div className="justify-self-center font-bold text-red-500">No data found</div>
            )}

            
            
                
        </div>
);
}

export default Track






  