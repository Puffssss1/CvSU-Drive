'use client';

import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, ToggleButtonGroup, ToggleButton, CircularProgress } from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import UploadFile from '@/app/components/UploadFile';
import { useSession } from 'next-auth/react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

interface Folder {
  id: string;
  name: string; // Folder name will now be a combination of department and course
}

function Files() {
  const { data: session } = useSession();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [layout, setLayout] = useState<'list' | 'grid'>('grid');
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const router = useRouter();
  const pathname = usePathname();
  const previous = pathname;
  const newPath = previous;

  useEffect(() => {
    const fetchFolders = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching folders:', error);
      } else {
        console.log('Fetched Data:', data); // Log the fetched data

        let filteredFolders = data;

        console.log('User  Role:', session?.role); // Log the user role
        if (session?.role === 'Admin') {
          filteredFolders = data; // Admin sees all categories
        } else if (session?.role === 'Faculty') {
          filteredFolders = data.filter(folder => folder.id === 8); // Faculty sees specific category (id 8)
        } else if (session?.role === 'Chairperson') {
          const allowedIds = [7, 14, 13, 10]; // IDs for allowed categories
          filteredFolders = data.filter(folder => allowedIds.includes(folder.id)); // Filter based on allowed IDs
        }

        console.log('Filtered Folders:', filteredFolders); // Log the filtered results

        const transformedFolders = filteredFolders?.map(folder => ({
          id: `${folder.id}`, // Keep as string for rendering
          name: `${folder.name}`,
        })) || [];
        setFolders(transformedFolders);
      }
      setLoading(false); // Set loading to false after fetching
    };

    fetchFolders();
  }, [session]);

  const handleLayoutChange = (event: React.MouseEvent<HTMLElement>, newLayout: 'list' | 'grid' | null) => {
    if (newLayout) setLayout(newLayout);
  };

  const handleFolderClick = (folderId: string) => {
    console.log(`Folder clicked: ${folderId}`);
    router?.push(`${newPath}/${folderId}`); // Handle folder click action here, e.g., navigate to folder details page
  };

  return (
    <div>
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <div className='justify-items-center mt-3'>
        <div className="ml-[220px]">
          <Box sx={{ padding: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5">Categories</Typography>
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

            {loading ? (
              <Box display="flex" justifyContent ="center" alignItems="center" height="200px">
                <CircularProgress />
              </Box>
            ) : (
              layout === 'grid' ? (
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
                <Box>
                  <Typography variant="h6">Table View (not implemented)</Typography>
                </Box>
              )
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