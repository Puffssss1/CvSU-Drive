'use client';

import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { CardMedia } from '@mui/material';

function FolderList() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [folders, setFolders] = useState<{ id: string; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Function to fetch folders
  const fetchFolders = async () => {
    try {
      const response = await fetch('/api/folder'); // Adjust the path if necessary
      if (!response.ok) {
        throw new Error('Failed to fetch folders');
      }
      const data = await response.json();
      setFolders(data); // Store the retrieved folders in state
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message); // Set error message if an error occurs
      }
    }
  };

  // Fetch folders on component mount
  useEffect(() => {
    fetchFolders();
  }, []);

  return (
    <Box display="flex" flexDirection="row" alignItems="center">
      {error && <Typography color="error">{error}</Typography>}
      {folders.map((folder) => (
        <Box key={folder.id} width={'300px'} mb={2}> 
          <Card className='transform transition-all hover:-translate-y-2'
            variant="outlined"
            sx={{
              height: '250px',
              mx: '18px',
              marginTop: '48px',
              borderWidth: '9px',
              borderStyle: 'solid',
              borderRadius: '16px',
              position: 'relative',
              paddingTop: '25px',
              '::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '25px',
                bgcolor: '#e1e1e0',
                zIndex: 1,
              },
            }}
          >
            <Box
              sx={{
                
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '25px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 10px',
                zIndex: 2,
              }}
            >
              <Typography variant="body2">{folder.name}</Typography> {/* Display the folder name */}
              <IconButton
                aria-label="settings"
                sx={{
                  color: 'grey.600',
                  padding: 0,
                }}
                onClick={handleClick}
              >
                <MoreVertIcon />
              </IconButton>
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleClose}>Rename Folder</MenuItem>
              <MenuItem onClick={handleClose}>Download</MenuItem>
            </Menu>

            <CardContent className=''>
              <CardMedia
                component="img"
                height="250"
                
                image="./assets/free-folder-icon-1485-thumb.png"
                alt=""
                sx={{ borderRadius: '8px' }}
              />
            </CardContent>
          </Card>
        </Box>
      ))}
    </Box>
  );
}

export default FolderList;
