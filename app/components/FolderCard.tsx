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
  TextField, 
  Button 
} from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useRouter } from 'next/compat/router';
import { createClient } from '@supabase/supabase-js';
import { useSession } from 'next-auth/react';

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
  uploaded_by: string; // Assuming this is a string representing the user or uploader
}

function FolderList() {
  const { data: session } = useSession(); // Accessing logged-in user session
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({});
  const [folders, setFolders] = useState<Folder[]>([]);
  const [layout, setLayout] = useState<'list' | 'grid'>('grid');
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameFolderId, setRenameFolderId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchFolders = async () => {
      // Fetch folders with the uploader's information
      const { data, error } = await supabase
        .from('file_metadata')
        .select('id, file_name, Category, file_url, uploaded_at, uploaded_by') // Getting uploaded_by directly
        .order('uploaded_at', { ascending: false });

      if (error) {
        console.error('Error fetching folders:', error);
      } else {
        setFolders(data);
      }
    };

    fetchFolders();
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, folderId: string) => {
    setAnchorEl((prev) => ({ ...prev, [folderId]: event.currentTarget }));
  };

  const handleClose = (folderId: string) => {
    setAnchorEl((prev) => ({ ...prev, [folderId]: null }));
  };

  const handleLayoutChange = (event: React.MouseEvent<HTMLElement>, newLayout: 'list' | 'grid' | null) => {
    if (newLayout) setLayout(newLayout);
  };

  const openRenameDialog = (folderId: string, currentName: string) => {
    setRenameFolderId(folderId);
    setNewFolderName(currentName);
    setRenameDialogOpen(true);
  };

  const handleRename = async () => {
    if (renameFolderId && newFolderName.trim()) {
      const { data, error } = await supabase
        .from('file_metadata')
        .update({ file_name: newFolderName })
        .eq('id', renameFolderId);

      if (error) {
        console.error('Error renaming folder:', error);
      } else {
        setFolders((prevFolders) =>
          prevFolders.map((folder) =>
            folder.id === renameFolderId ? { ...folder, file_name: newFolderName } : folder
          )
        );
        setRenameDialogOpen(false);
        setRenameFolderId(null);
        setNewFolderName('');
      }
    }
  };

  const handleRenameDialogClose = () => {
    setRenameDialogOpen(false);
    setRenameFolderId(null);
    setNewFolderName('');
  };

  const handleFolderClick = (folderId: string) => {
    window.open(folderId, '_blank')
    // const pushToHere = router?.push(`/${folderId}`);
    // console.log(pushToHere);
  };

  if (!isMounted) {
    return null;
  }
  

  // Filter the folders based on the logged-in user session (uploaded_by matches session.user.email or session.user.id)
  const filteredFolders = folders.filter(folder => folder.uploaded_by === session?.user?.name);

  return (
    <div className='ml-[220px]'>
      <Box sx={{ padding: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Folders</Typography>
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
      <div className='ml-56'>
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
        >
          {/* Three-dotted menu in the upper-right corner */}
          <IconButton
              onClick={(e) => handleClick(e, folder.id)}
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
            <MenuItem onClick={() => openRenameDialog(folder.id, folder.name)}>
              Rename Folder
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
                  >
                    <img
                      src={`https://via.placeholder.com/150?text=${folder.file_name}`}
                      alt={`${folder.file_name} Thumbnail`}
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />
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
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', paddingX: 16 }}>Folder Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', paddingX: 16 }}>Date Created</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', paddingX: 16 }}>Uploaded By</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', paddingX: 16 }}>Owner</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredFolders.map((folder) => (
                  <TableRow
                    key={folder.id}
                    onClick={() => handleFolderClick(folder.id)}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '#f0f0f0',
                      },
                      transition: 'background-color 0.3s ease',
                    }}
                  >
                    <TableCell sx={{ fontWeight: 'medium', fontSize: '0.9rem', paddingX: 16 }}>
                      {folder.file_name}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'medium', fontSize: '0.9rem', paddingX: 16 }}>
                      {new Date(folder.uploaded_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'medium', fontSize: '0.9rem', paddingX: 16 }}>
                      {folder.uploaded_by} {/* Displaying uploaded_by directly */}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'medium', fontSize: '0.9rem', paddingX: 16 }}>
                      Owner Name
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={(e) => handleClick(e, folder.id)}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      <Dialog open={renameDialogOpen} onClose={handleRenameDialogClose}>
        <DialogTitle>Rename Folder</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="newFolderName"
            label="New Folder Name"
            type="text"
            fullWidth
            variant="standard"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRenameDialogClose}>Cancel</Button>
          <Button onClick={handleRename}>Rename</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default FolderList;