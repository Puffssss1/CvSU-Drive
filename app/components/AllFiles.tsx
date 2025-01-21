'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  Typography, 
  IconButton, 
  Menu, 
  MenuItem, 
  ToggleButtonGroup, 
  ToggleButton, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button 
} from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import UploadFile from '@/app/components/UploadFile';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

interface Folder {
  id: string;
  file_name: string;
  Category: string;
  file_url: string;
  uploaded_at: string;
  uploaded_by: string;
}

function FolderList() {
  const { data: session } = useSession();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({});
  const [folders, setFolders] = useState<Folder[]>([]);
  const [layout, setLayout] = useState<'list' | 'grid'>('grid');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteFolderId, setDeleteFolderId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [category, setCategory] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const lastTwoSegments = segments[segments.length - 2];

  useEffect(() => {
    const fetchCategoryAndFolders = async () => {
      const pathId = lastTwoSegments;
      if (!pathId) return;
      let catName: string | null = null;

      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id, name')
        .eq('id', pathId);

      if (categoryData && categoryData.length > 0) {
        catName = categoryData[0]?.name;
      } else {
        console.log('No category found or error occurred:', categoryError);
      }
      setCategory(catName);

      const { data: folderData, error: folderError } = await supabase
        .from('file_metadata')
        .select('id, file_name, Category, file_url, uploaded_at, uploaded_by');

      if (folderError) {
        console.error('Error fetching folders:', folderError);
      } else {
        const filtered = folderData.filter(
          (folder) => folder.Category === catName
        );
        setFolders(filtered);
      }
    };

    fetchCategoryAndFolders();
  }, [pathname]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, folderId: string) => {
    event.stopPropagation(); // Prevent the event from propagating to the Card
    setAnchorEl((prev) => ({ ...prev, [folderId]: event.currentTarget }));
  };

  const handleClose = (folderId: string) => {
    setAnchorEl((prev) => ({ ...prev, [folderId]: null }));
  };

  const handleLayoutChange = (event: React.MouseEvent<HTMLElement>, newLayout: 'list' | 'grid' | null) => {
    if (newLayout) setLayout(newLayout);
  };

  const openDeleteDialog = (folderId: string) => {
    setDeleteFolderId(folderId);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (deleteFolderId) {
      const { error } = await supabase
        .from('file_metadata')
        .delete()
        .eq('id', deleteFolderId);

      if (error) {
        console.error('Error deleting folder:', error);
      } else {
        setFolders((prevFolders) => prevFolders.filter((folder) => folder.id !== deleteFolderId));
        setDeleteDialogOpen(false);
        setDeleteFolderId(null);
      }
    }
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setDeleteFolderId(null);
  };

  const handleFolderClick = (folderUrl: string) => {
    window.open(folderUrl, '_blank');
  };

  if (!isMounted) {
    return null;
  }

  const filteredFolders = folders.filter(folder => folder.uploaded_by === session?.user?.name);

  return (
    <>
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <div className='ml-[220px]'>
        <Box sx={{ padding: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">Files</Typography>
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

          {filteredFolders.length === 0 ? (
            <Typography variant="h6" color="textSecondary" align="center">
              No files available
            </Typography>
          ) : layout === 'grid' ? (
            <Box display="flex" flexWrap="wrap" gap={2}>
              {filteredFolders.map((folder) => (
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
                    onClick={() => handleFolderClick(folder.file_url)} // Open file on card click
                  >
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent click from propagating to the parent
                        handleClick(e, folder.id);
                      }}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl[folder.id]}
                      open={Boolean(anchorEl[folder.id])}
                      onClose={() => handleClose(folder.id)}
                    >
                      <MenuItem 
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent click from propagating to the card
                          openDeleteDialog(folder.id);
                        }}
                      >
                        Delete Folder
                      </MenuItem>
                      <MenuItem onClick={() => handleClose(folder.id)}>Download</MenuItem>
                    </Menu>

                    <Box
                      sx={{
                        backgroundColor: '#e0e0e0',
                        height: '150px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: '#e0e0e0',
                      }}
                    />

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
            <TableContainer
              component={Paper}
              sx={{
                height: '100%',
                maxHeight: 'calc(100vh - 150px)',
                overflowY: 'auto',
                position: 'flex',
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', paddingX: 16 }}>File Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', paddingX: 16 }}>Date Created</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', paddingX: 16 }}>Uploaded By</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1rem', paddingX: 16 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredFolders.map((folder) => (
                    <TableRow
                      key={folder.id}
                      sx={{
                        '&:hover': {
                          backgroundColor: '#f5f5f5',
                          cursor: 'pointer',
                        },
                      }}
                      onClick={() => handleFolderClick(folder.file_url)} // Open file on row click
                    >
                      <TableCell sx={{ paddingX: 16 }}>{folder.file_name}</TableCell>
                      <TableCell sx={{ paddingX: 16 }}>
                        {new Date(folder.uploaded_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell sx={{ paddingX: 16 }}>{folder.uploaded_by}</TableCell>
                      <TableCell align="right" sx={{ paddingX: 16 }}>
                        <IconButton onClick={(e) => handleClick(e, folder.id)}>
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl[folder.id]}
                          open={Boolean(anchorEl[folder.id])}
                          onClose={() => handleClose(folder.id)}
                        >
                          <MenuItem 
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent click from propagating to the row
                              openDeleteDialog(folder.id);
                            }}
                          >
                            Delete Folder
                          </MenuItem>
                          <MenuItem onClick={() => handleClose(folder.id)}>Download</MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>

        <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
          <DialogTitle>Delete Folder</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this folder?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteDialogClose}>Cancel</Button>
            <Button onClick={handleDelete} color="error">Delete</Button>
          </DialogActions>
        </Dialog>

        <div className='fixed bottom-10 right-10 z-50'>
          <UploadFile />
        </div>
      </div>
    </>
  );
}

export default FolderList;