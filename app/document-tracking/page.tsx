import React from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

function track() {
    return (
        <div>
            <div className='text-4xl m-5 bg-slate-200 p-2 font-bold font-mono'> DOCUMENT TRACKING
            </div>
            <Box className='justify-self-end mr-10'
            component="form"
            sx={{ '& > :not(style)': { m: 1, width: '100ch' } }}
            noValidate
            autoComplete="off">
                <TextField className='' id="Reference" label="Enter Reference Number" variant="outlined" />
                <Stack spacing={2} direction="row" className='justify-center'>
                    <Button variant="contained" className='rounded-3xl bg-[#004225] hover:bg-green-600 '>Search</Button>
                    </Stack>
                </Box>
                <div className='text-4xl m-5 bg-slate-200 p-2 font-bold font-mono'> TRACKING DETAILS
                </div>
            <div className='justify-self-center font-bold'>
            [REFERENCE NUMBER]
            </div>
            
            <hr className='w-5/6 border-t-2 border-black border-opacity-10 mt-2 mx-auto '/>

            <div className='m-5 ml-44 flex'>
                <div className=' text-black opacity-50 mr-24'>
                    January 01 2025, 12:01 am
                </div>
                <div className='text-black'>
                        Uploading in CVSU Drive
                </div>
            </div>

            <div className='m-5 ml-44 flex'>
                <div className=' text-black opacity-50 mr-24'>
                    January 01 2025, 12:01 am
                </div>
                <div className='text-black'>
                        Received by the Admin
                </div>
            </div>

            <div className='m-5 ml-44 flex'>
                <div className=' text-black opacity-50 mr-24'>
                    January 01 2025, 12:01 am
                </div>
                <div className='text-black'>
                        Approved by the Admin
                </div>
            </div>

            <div className='m-5 ml-44 flex'>
                <div className=' text-black opacity-50 mr-24'>
                    January 01 2025, 12:01 am
                </div>
                <div className='text-black'>
                        Uploaded in CVSU Drive
                </div>
            </div>

            
            
                
        </div>
        
        
        
        
        

        
      );

        
        
      

      
      
}

export default track






  