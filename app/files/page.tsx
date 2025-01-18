'use client';

import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, ToggleButtonGroup, ToggleButton, Button } from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import UploadFile from '../components/UploadFile';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

interface Folder {
  id: string;
  name: string; // Folder name will now be a combination of department and course
}

function Files() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [layout, setLayout] = useState<'list' | 'grid'>('grid');
  const router = useRouter();

  useEffect(() => {
    const fetchFolders = async () => {
      const { data, error } = await supabase
        .from('departments') // Assuming your table name is file_folder
        .select('id, name') // Fetch only department and course fields
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching folders:', error);
      } else {
        // Combine department and course to form the folder name
        const transformedFolders = data?.map((folder: { id: string; name: string }) => ({
          id: `${folder.id}`, // Unique ID based on department and course
          name: `${folder.name}`, // Folder name
        })) || [];
        setFolders(transformedFolders);
      }
    };

    fetchFolders();
  }, []);

  const handleLayoutChange = (event: React.MouseEvent<HTMLElement>, newLayout: 'list' | 'grid' | null) => {
    if (newLayout) setLayout(newLayout);
  };

  const handleFolderClick = (folderId: string) => {
    console.log(`Folder clicked: ${folderId}`);
    router?.push(`/files/${folderId}`); // Handle folder click action here, e.g., navigate to folder details page
  };

  return (
    <div>
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <div className='justify-items-center mt-3'>
        <div className="ml-[220px]">
          <Box sx={{ padding: 3, width: '1200px', }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5">Departments</Typography>
              <ToggleButtonGroup
                value={layout}
                exclusive
                onChange={handleLayoutChange}
                aria-label="layout toggle"
              >
                <ToggleButton value="grid" aria-label="grid layout">
                  <GridViewIcon />
                </ToggleButton>
                <ToggleButton value="list" aria-label="list layout">
                  <ViewListIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Grid View Layout */}
            {layout === 'grid' ? (
              <Box display="flex" flexWrap="wrap" gap={2}>
                {folders.map((folder) => (
                  <Box key={folder.id} width="300px" mb={2} position="relative">
                    <Card
                      variant="outlined"
                      sx={{
                        borderRadius: '12px',
                        boxShadow: 3,
                        cursor: 'pointer',
                        position: 'relative',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: 6,
                        },
                      }}
                      onClick={() => handleFolderClick(folder.id)}
                    >
                      <Box
                        sx={{
                          backgroundColor: '#e0e0e0',
                          height: '150px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant="h6" color="textSecondary">
                          {folder.name}
                        </Typography>
                      </Box>

                      <Box sx={{ p: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {folder.name}
                        </Typography>
                      </Box>
                    </Card>
                  </Box>
                ))}
              </Box>
            ) : (
              // List View Layout
              <Box>
                {folders.map((folder) => (
                  <Card
                    key={folder.id}
                    variant="outlined"
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 2,
                      width: '1200px',
                      marginBottom: 2,
                      cursor: 'pointer',
                      '&:hover': {
                        boxShadow: 3,
                      },
                    }}
                    onClick={() => handleFolderClick(folder.id)}
                  >
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {folder.name}
                      </Typography>
                    </Box>
                    {/* <Button variant="contained" color="primary" onClick={() => handleFolderClick(folder.id)}>
                      View
                    </Button> */}
                  </Card>
                ))}
              </Box>
            )}
          </Box>
        </div>
      </div>

      <div className='fixed bottom-10 right-10 z-50'>
        <UploadFile />
      </div>
    </div>
  );
}

export default Files;