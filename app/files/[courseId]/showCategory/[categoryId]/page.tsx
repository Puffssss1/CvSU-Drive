'use client';

import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header'
import UploadFile from '../../../../components/UploadFile';

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


  const pathname = usePathname()

  const lastSegment = pathname.split('/').pop();


  const departmentId = lastSegment;
  

  console.log(pathname )

  useEffect(() => {
    if (!departmentId) return;

    const fetchFolders = async () => {
      const { data, error } = await supabase
        .from('categories') 
        .select('id, name')
        .eq('id', departmentId) 
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
  }, [departmentId]);


  const handleLayoutChange = (event: React.MouseEvent<HTMLElement>, newLayout: 'list' | 'grid' | null) => {
    if (newLayout) setLayout(newLayout);
  };

  const handleFolderClick = (folderId: string) => {
    console.log(`Folder clicked: ${folderId}`);
    router?.push(`${pathname}/allFiles`); // Handle folder click action here, e.g., navigate to folder details page
  };
  return (
    <div>
      <div className="sticky top-0 z-50">
        <Header/>
      </div>

      <div className='justify-items-center mt-3'>
        {/* <DepartmentCard /> */}
        <div className="ml-[220px]">
          <Box sx={{ padding: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5">File Category</Typography>
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
                        {/* Placeholder for image or folder content */}
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
              <Box>
                <Typography variant="h6">Table View (not implemented)</Typography>
              </Box>
            )}
          </Box>
        </div>
      </div>
    
      <div className='fixed bottom-10 right-10 z-50s'>
        <UploadFile />
      </div>
    </div>
  )
}

export default Files