'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  Typography, 
  Button, 
  ToggleButtonGroup, 
  ToggleButton 
} from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import { useSession } from 'next-auth/react';
import { createClient } from '@supabase/supabase-js';
import Loading from '@/app/components/loading';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

interface Folder {
  id: string;
  file_name: string;
  file_url: string;
  uploaded_at: string;
  uploaded_by: string;
}

const FolderList = () => {
  const { data: session } = useSession(); // Get the logged-in user session
  const [folders, setFolders] = useState<Folder[]>([]);
  const [layout, setLayout] = useState<'list' | 'grid'>('grid');
  const [filter, setFilter] = useState<string>('all'); // Filter state: 'all', '7days', 'week', 'month'
  const [currentPage, setCurrentPage] = useState<number>(1); // Current page for pagination
  const itemsPerPage = 5; // Number of items per page
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    const fetchFolders = async () => {
      setLoading(true); // Set loading to true before fetching
      const { data, error } = await supabase
        .from('file_metadata')
        .select('id, file_name, file_url, uploaded_at, uploaded_by')
        .order('uploaded_at', { ascending: false });

      if (error) {
        console.error('Error fetching folders:', error);
      } else {
        setFolders(data);
      }
      setLoading(false); // Set loading to false after fetching
    };

    fetchFolders();
  }, []);

  // Filter the folders based on the selected time range
  const filteredFolders = folders.filter((folder) => {
    if (folder.uploaded_by !== session?.user?.name) return false; // Only show files uploaded by the current user

    const uploadedDate = new Date(folder.uploaded_at);
    const now = new Date();

    switch (filter) {
      case '7days':
        return uploadedDate >= new Date(now.setDate(now.getDate() - 7));
      case 'week':
        // const startOfWeek = ; // Start of the week
        return uploadedDate >= new Date(now.setDate(now.getDate() - now.getDay()));
      case 'month':
        return uploadedDate >= new Date(now.setMonth(now.getMonth() - 1));
      default:
        return true; // Show all files
    }
  });

  // Paginated folders
  const paginatedFolders = filteredFolders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleLayoutChange = (event: React.MouseEvent<HTMLElement>, newLayout: 'list' | 'grid' | null) => {
    if (newLayout) setLayout(newLayout);
  };

  const handleFilterChange = (timeRange: string) => {
    setFilter(timeRange); // Update the filter state when a button is clicked
    setCurrentPage(1); // Reset to the first page on filter change
  };

  const handleFolderClick = (fileUrl: string) => {
    window.open(fileUrl, '_blank');
  };

  const handleNextPage = () => {
    if (currentPage * itemsPerPage < filteredFolders.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <Box sx={{ padding: 3, marginLeft: '220px', minWidth: '600px', maxWidth: '1200px' }}>
      <Box sx={{width: '1200px'}} display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Recent Files</Typography>

        {/* Filter Buttons */}
        {!loading && (
          <Box>
            <div className='flex flex-row justify-between gap-2'>
              <Button variant="contained" onClick={() => handleFilterChange('all')} className='text-xs bg-[#6A1E9C]'>
                All Files
              </Button>
              <Button variant="contained" onClick={() => handleFilterChange('7days')} className='text-xs bg-[#6A1E9C]'>
                Added in 7 Days
              </Button>
              <Button variant="contained" onClick={() => handleFilterChange('week')} className='text-xs bg-[#6A1E9C]'>
                Added Last Week
              </Button>
              <Button variant="contained" onClick={() => handleFilterChange('month')} className='text-xs bg-[#6A1E9C]'>
                Added Last Month
              </Button>
            </div>
          </Box>
        )}

        {/* Layout Toggle */}
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

      {/* Loading State */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="400px">
          <Typography variant="h6"><Loading /></Typography>
        </Box>
      ) : (
        <>
          {/* Grid View Layout */}
          {layout === 'grid' ? (
            <Box display="flex" flexWrap="wrap" gap={2}>
              {paginatedFolders.map((folder) => (
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
                    onClick={() => handleFolderClick(folder.file_url)}
                  >
                    <Box
                      sx={{
                        backgroundColor: '#e0e0e0',
                        height: '150px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: '#e0e0e0',
                      }}
                    >
                      {/* Thumbnail placeholder */}
                    </Box>

                    <Box sx={{ p: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {folder.file_name}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        sx={{ display: 'block', marginTop: '4px' }}
                      >
                        Created: {new Date(folder.uploaded_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Card>
                </Box>
              ))}
            </Box>
          ) : (
            // List View Layout
            <Box>
              {paginatedFolders.map((folder) => (
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
                  onClick={() => handleFolderClick(folder.file_url)}
                >
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {folder.file_name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Uploaded by: {folder.uploaded_by}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Created: {new Date(folder.uploaded_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Card>
              ))}
            </Box>
          )}
        </>
      )}

      {/* Pagination Controls */}
      <Box display="flex" justifyContent="center" alignItems="center" mt={3}>
        <Button variant="contained" disabled ={currentPage === 1} onClick={handlePreviousPage} className='bg-[#6A1E9C] rounded-sm'>
          Previous
        </Button>
        <Typography variant="body1" mx={2}>
          Page {currentPage} of {Math.ceil(filteredFolders.length / itemsPerPage)}
        </Typography>
        <Button
          variant="contained"
          disabled={currentPage * itemsPerPage >= filteredFolders.length}
          onClick={handleNextPage}
          className='bg-[#6A1E9C] rounded-sm'
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default FolderList;