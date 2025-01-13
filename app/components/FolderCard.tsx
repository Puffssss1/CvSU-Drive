'use client';

import React, { useState } from 'react';
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
Button,
} from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface Folder {
  id: string;
  name: string;
  createdDate: string;
  modifiedBy: string;
  owner: string;
}

function FolderList() {
  const [anchorEl, setAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({});
  const [folders, setFolders] = useState<Folder[]>([
    { id: '1', name: 'Folder 1', createdDate: '2023-01-01', modifiedBy: 'User A', owner: 'User A' },
    { id: '2', name: 'Folder 2', createdDate: '2023-02-15', modifiedBy: 'User B', owner: 'User B' },
    { id: '3', name: 'Folder 3', createdDate: '2023-03-10', modifiedBy: 'User C', owner: 'User C' },
    { id: '4', name: 'Folder 4', createdDate: '2023-03-10', modifiedBy: 'User D', owner: 'User D' },

  ]);
  const [layout, setLayout] = useState<'list' | 'grid'>('grid');
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameFolderId, setRenameFolderId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, folderId: string) => {
    setAnchorEl((prev) => ({ ...prev, [folderId]: event.currentTarget }));
  };

  const handleClose = (folderId: string) => {
    setAnchorEl((prev) => ({ ...prev, [folderId]: null }));
  };

  const handleLayoutChange = (
    event: React.MouseEvent<HTMLElement>,
    newLayout: 'list' | 'grid' | null
  ) => {
    if (newLayout) setLayout(newLayout);
  };

  const openRenameDialog = (folderId: string, currentName: string) => {
    setRenameFolderId(folderId);
    setNewFolderName(currentName);
    setRenameDialogOpen(true);
  };

  const handleRename = () => {
    if (renameFolderId && newFolderName.trim()) {
      setFolders((prevFolders) =>
        prevFolders.map((folder) =>
          folder.id === renameFolderId ? { ...folder, name: newFolderName } : folder
        )
      );
      setRenameDialogOpen(false);
      setRenameFolderId(null);
      setNewFolderName('');
    }
  };

  const handleRenameDialogClose = () => {
    setRenameDialogOpen(false);
    setRenameFolderId(null);
    setNewFolderName('');
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5"></Typography>
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
        <Card className='bg-zinc-100'
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

          {/* Thumbnail Section */}
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
              src={`https://via.placeholder.com/150?text=${folder.name}`}
              alt={`${folder.name} Thumbnail`}
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
          </Box>

          {/* Name and Date Section */}
          <div className=''>
          <Box sx={{ p: 2 }}>
            
            <Typography className='' variant="subtitle2" sx={{ fontWeight: 600 }}>
              {folder.name}
            </Typography>
            <Typography className=''
              variant="caption"
              color="textSecondary"
              sx={{ display: 'block', marginTop: '4px'}}
            >
              Created: {new Date(folder.createdDate).toLocaleDateString()}
            </Typography>
            
            
          </Box>
          </div>
        </Card>
      </Box>
    ))}
  </Box>
      </div>
  
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
        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', paddingX: 16 }}>Modified By</TableCell>
        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', paddingX: 16 }}>Owner</TableCell>
        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {folders.map((folder) => (
        <TableRow
          key={folder.id}
          onClick={() => console.log(`Clicked on folder: ${folder.name}`)}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#f0f0f0',
            },
            transition: 'background-color 0.3s ease',
          }}
        >
          <TableCell sx={{ fontWeight: 'medium', fontSize: '0.9rem', paddingX: 16}}>{folder.name}</TableCell>
          <TableCell sx={{ fontWeight: 'medium', fontSize: '0.9rem', paddingX: 16}}>{folder.createdDate}</TableCell>
          <TableCell sx={{ fontWeight: 'medium', fontSize: '0.9rem', paddingX: 16}}>{folder.modifiedBy}</TableCell>
          <TableCell sx={{ fontWeight: 'medium', fontSize: '0.9rem', paddingX: 16}}>{folder.owner}</TableCell>
          <TableCell align="right">
            <IconButton onClick={(e) => handleClick(e, folder.id)}>
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
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>


      )}

      {/* Rename Folder */}
      <Dialog open={renameDialogOpen} onClose={handleRenameDialogClose}>
        <DialogTitle>Rename Folder</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Enter new folder name"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRenameDialogClose}>Cancel</Button>
          <Button onClick={handleRename} variant="contained" disabled={!newFolderName.trim()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default FolderList;
