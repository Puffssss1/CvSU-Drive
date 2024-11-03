import React, { useState } from 'react'
import { useSession } from 'next-auth/react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import MessageIcon from '@mui/icons-material/Message';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

const Roles = {
  ADMIN: 'Admin',
  FACULTY: 'Faculty',
  CHAIRPERSON: 'Chairperson',
};

function Uploader(){
  const inputField = document.querySelector(".input-field") as HTMLInputElement ;
  if(inputField){
    inputField.click();
  }
}

function Sidebar() {
  const { data: session } = useSession(); // Fetch session
  const userRole = session?.role; // Get user role from session


  // Create File Modal State
  const [openOpenCreateModal, setOpenCreateModal] = useState(false);

  //Create New Handler
  const HandleOpenCreateModal = () => setOpenCreateModal(true);
  const HandleCloseCreateModal = () => setOpenCreateModal(false);

    const [state, setState] = React.useState({
        left: false,
    });

  // Upload Modal State
  const [openUploadModal, setOpenUploadModal] = useState(false);

  //Upload Modal Handler
  const handleUploadOpenModal = () => setOpenUploadModal(true);
  const handleUploadCloseModal = () => setOpenUploadModal(false);

  // New File Modal State
  const [openFileModal, setOpenFileModal] = useState(false);

  //Upload Modal Handler
  const handleFileOpenModal = () => setOpenFileModal(true);
  const handleFileCloseModal = () => setOpenFileModal(false);

  // new folder modal state
  const [openNewFolderModal, setOpenNewFolderModal] = useState(false);

  //new folder handler
  const handleOpenNewFolderModal = () => setOpenNewFolderModal(true);
  const handleCloseNewFolderModal = () => {
    setOpenNewFolderModal(false);
    setFolderName(""); // Reset folder name on close
  };
  // State to hold the folder name
  const [folderName, setFolderName] = useState("");

  const handleCreateNewFolder = () => {
    if (!folderName) return; // Exit if no name is provided

    fetch('/api/folder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ folderName }),
    })
    .then(response => {
        // Check if the response is okay (status in the range 200-299)
        if (!response.ok) {
            return response.json().then(data => {
                console.error('Error creating folder:', data.message);
                throw new Error(data.message); // Throw error for the catch block
            });
        }
        return response.json(); // Parse the JSON only if the response is ok
    })
    .then(data => {
        // Log the success message and folder details
        console.log('Folder created:', data);
        // Reset folder name and close modal
        setFolderName("");
        handleCloseNewFolderModal(); // Close the new folder modal
    })
    .catch(error => {
        console.error('Error creating folder:', error.message);
    });
};


    const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

    const list = (anchor: Anchor) => (
        <Box
          sx={{ 
            width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 200 }}
          role="presentation"
          onClick={toggleDrawer(anchor, false)}
          onKeyDown={toggleDrawer(anchor, false)}
        >
          <List sx={{ flexGrow: 1 }}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <HomeIcon/>
                </ListItemIcon>
                <ListItemText primary={"Home"}/>
              </ListItemButton>
            </ListItem>

            {userRole === Roles.ADMIN && (
              <>
                <ListItem disablePadding>
                  <a href='./log-history'>
                    <ListItemButton>
                      <ListItemIcon>
                        <WorkHistoryIcon/>
                      </ListItemIcon>
                      <ListItemText primary={"Log History"}/>
                        </ListItemButton>
                  </a>
                </ListItem>

                <ListItem disablePadding>
                  <a href='/accounts'>
                    <ListItemButton>
                      <ListItemIcon>
                        <AccountBoxIcon/>
                      </ListItemIcon>
                      <ListItemText primary={"Accounts"}/>
                    </ListItemButton>
                  </a>
                </ListItem>
              </>
            )}
            
            {userRole === Roles.CHAIRPERSON && (
              <>
                <ListItem disablePadding>
                  <a href='./profile'>
                    <ListItemButton>
                      <ListItemIcon>
                        <AccountBoxIcon/>
                      </ListItemIcon>
                      <ListItemText primary={"Faculty's Profile"}/>
                    </ListItemButton>
                  </a>
                </ListItem>
              </>
            )}

            <ListItem disablePadding>
              <a href='./messages'>
                <ListItemButton>
                  <ListItemIcon>
                    <MessageIcon/>
                  </ListItemIcon>
                  <ListItemText primary={"Messages"}/>
                </ListItemButton>
              </a>
            </ListItem>

            <ListItem disablePadding>
              <a href='/files'>
                <ListItemButton>
                  <ListItemIcon>
                    <BackupTableIcon/>
                  </ListItemIcon>
                  <ListItemText primary={"Files"}/>
                </ListItemButton>
              </a>
            </ListItem>
          </List>
          <Divider />
          
          {/* Upload */}
          <List sx={{ flexGrow: 1 }}>
            <ListItem disablePadding>
                <ListItemButton onClick={HandleOpenCreateModal}>
                  <ListItemIcon>
                    <AddCircleIcon/>
                  </ListItemIcon>
                  <ListItemText primary={"Create New"}/>
                </ListItemButton>
            </ListItem>
          </List>
        </Box>
      );

    // State to hold the selected file preview URL, file name, and file type
    const [isImage, setIsImage] = useState<boolean>(false);
    const [fileName, setFileName] = useState<string>("");
    const [filePreview, setFilePreview] = useState<string | null>(null);

    // function to handle file preview
    const handleFilePreview = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file =  event.target.files?.[0];
        if (file) {
          setFileName(file.name);
          //check if the file is an image
          const isImageFile = file.type.startsWith("image/");
          setIsImage(isImageFile);

          if (isImageFile){
            const imageURL = URL.createObjectURL(file);
            setFilePreview(imageURL);
          } else {
            setFilePreview(null)
          }
        }
    };
  return (
    <div>
        <React.Fragment>
            <MenuIcon className='size-10'
                onClick={
                    toggleDrawer("left", true)
                }
            />
            <Drawer
            anchor={"left"}
            open={state["left"]}
            onClose={toggleDrawer("left", false)}
            sx={{ "& .MuiDrawer-paper": { marginTop: '88px' } }}
            BackdropProps={{ invisible: true }}
            >
            {list("left")}
            </Drawer>
        </React.Fragment>

        {/* Create New Modal  */}
        <Modal
        open={openOpenCreateModal}
        onClose={HandleCloseCreateModal}
        aria-labelledby="modal-upload-title"
        aria-describedby="modal-upload-description"
        sx={{
          padding: 0
        }}
        >
          <Box
          sx={{
            // eslint-disable-next-line @typescript-eslint/prefer-as-const
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 250,
            bgcolor: 'background.paper',
            border: '',
            borderRadius:'5px',
            boxShadow: 24,
            p: 4,
            padding: 2
          }}
          >

            {/* Create New Content */}
            {/* Upload file */}
            <List sx={{ flexGrow: 1 }}>
              <ListItem disablePadding>
                <ListItemButton onClick={handleUploadOpenModal} sx={{ gap: 0 }}>
                  <ListItemIcon>
                    <CloudUploadIcon className='text-[#1475cf]'/>
                  </ListItemIcon>
                  <ListItemText primary={"Upload file"} sx={{ margin: 0 }}/>
                </ListItemButton>
              </ListItem>

              {/* New file */}
              <ListItem disablePadding>
                <ListItemButton onClick={handleFileOpenModal} sx={{ gap: 0 }}>
                  <ListItemIcon>
                    <NoteAddIcon className='text-[#1475cf]'/>
                  </ListItemIcon>
                  <ListItemText primary={"New file"} sx={{ margin: 0 }}/>
                </ListItemButton>
              </ListItem>

              {/* New folder */}
              <ListItem disablePadding>
                <ListItemButton onClick={handleOpenNewFolderModal} sx={{ gap: 0 }}>
                  <ListItemIcon>
                    <CreateNewFolderIcon className='text-[#1475cf]' />
                  </ListItemIcon>
                  <ListItemText primary={"New folder"} sx={{ margin: 0 }} />
                </ListItemButton>
              </ListItem>
            </List>

            {/* Close the Create New modal */}
            <Button variant="contained" onClick={HandleCloseCreateModal} className='text-[12]'>
              Close
            </Button>
          </Box>
        </Modal>

                        
       {/* Upload Modal */}
        <Modal
        open={openUploadModal}
        onClose={handleUploadCloseModal}
        aria-labelledby="modal-upload-title"
        aria-describedby="modal-upload-description"
        >
          <Box
          sx={{
            // eslint-disable-next-line @typescript-eslint/prefer-as-const
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '',
            borderRadius:'10px',
            boxShadow: 24,
            p: 4,
          }}
        >
           {/* Upload form content... */}
          <form action="" className='flex flex-col justify-center items-center self-center border-2 border-dashed border-blue-700 w-[300] h-[300px] cursor-pointer rounded-xl'
            onClick={Uploader}
          >
            <input type="file" className="input-field" hidden onChange={handleFilePreview}/>

            {filePreview && isImage ?(
              <img src={filePreview} width={60} height={60} alt={fileName} />
            ) : (
              fileName ? (
                <div className="text-center">
                  <p>{fileName}</p> {/* Display the file name if it's not an image */}
                </div>
              ) : (
                <><CloudUploadIcon className='size-16 text-[#1475cf]' /><p>Browse Files to Upload</p></>
              )
            )}
            
          </form>
            <div className='grid grid-flow-col gap-10 mt-3'>
              <Button variant="contained" onClick={handleUploadCloseModal}>
                Close
              </Button>
              <Button variant="contained" onClick={handleUploadCloseModal}>
                Upload
              </Button>
            </div>
          </Box>
        </Modal>

        {/* New File Modal */}
        <Modal
            open={openFileModal}
            onClose={handleFileCloseModal}
            aria-labelledby="modal-new-file-title"
            aria-describedby="modal-new-file-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 300,
                    bgcolor: 'background.paper',
                    border: '',
                    borderRadius: '5px',
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <h2>Create New File</h2>
                {/* Your form or inputs for creating a new file */}
                <Button variant="contained" onClick={handleFileCloseModal}>
                    Close
                </Button>
                <Button
                    variant="contained"
                    onClick={() => {
                        // Add your logic for creating the file here
                        handleFileCloseModal();
                    }}
                >
                    Create File
                </Button>
            </Box>
        </Modal>

        {/* New Folder Modal */}
        <Modal
            open={openNewFolderModal}
            onClose={handleCloseNewFolderModal}
            aria-labelledby="modal-create-folder-title"
            aria-describedby="modal-create-folder-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 300,
                    bgcolor: 'background.paper',
                    border: '',
                    borderRadius: '5px',
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <h2>Create New Folder</h2>
                <input
                    type="text"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)} // Update folder name
                    placeholder="Enter folder name"
                    style={{
                        width: '100%',
                        marginTop: '10px',
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                    }}
                />
                <Button variant="contained" onClick={handleCloseNewFolderModal}>
                    Close
                </Button>
                <Button
                    variant="contained"
                    onClick={() => {
                        // Add your logic for creating the folder here
                        handleCreateNewFolder();
                    }}
                >
                    Create Folder
                </Button>
            </Box>
        </Modal>
  </div>
  )
}

export default Sidebar