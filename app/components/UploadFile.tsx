'use client';

import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useSession } from 'next-auth/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';

const FileUpload = () => {
  const {data:session} = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);

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
    if (!file) return;

    setUploading(true);

    const fileName = `documents/${Date.now()}_${file.name}`; // Add a timestamp for uniqueness

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      setUploading(false);
      return;
    }

    console.log('Uploaded file data:', uploadData);

    const fileReference = generateFileReference();

    // Get the public URL for the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName);


    const publicUrl = publicUrlData.publicUrl;

    console.log('Public URL:', publicUrl);
    console.log(fileReference)

    // Save file metadata to the database
    const { data: metadataData, error: metadataError } = await supabase
      .from('file_metadata')
      .insert([
        {
            file_name: file.name,
            uploaded_by: session?.user.name, 
            file_url: publicUrl,
            isApproved: false,
            referenceId: fileReference,
        },
      ]);

    if (metadataError) {
      console.error('Error saving metadata:', metadataError);
      setUploading(false);
      return;
    }

    console.log('Metadata inserted:', metadataData);

    setUploadedFileUrl(publicUrl);
    setUploading(false);
  };

  const [open, setOpenModal] = React.useState(false);
  const openModal = () => setOpenModal(true);
  const closeModal = () => setOpenModal(false);

  return (
    <div>
      <Button onClick={openModal} variant='contained' className='bg-[#004225] text-[#FFB000] text-base'>Upload</Button>
      <Modal
        open={open}
        onClose={closeModal}
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          bgcolor: 'background.paper',
          //border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          borderRadius: 3,
        }}>
          <button onClick={closeModal} className='absolute top-2 right-2'><CloseIcon/></button>
          <div className='justify-items-center gap-3  mt-4'>
            <div  className='flex flex-row justify-between align-middle'>
              <input type="file" onChange={handleFileChange}/>
              <Button onClick={handleUpload} disabled={uploading} variant='contained'  className='bg-[#004225] text-[#FFB000] text-base'>
                {uploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
            {uploadedFileUrl && (
              <div className='mt-3 justify-items-center'>
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

export default FileUpload;
