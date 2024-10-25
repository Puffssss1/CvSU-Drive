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

  // Upload Modal State
  const [openModal, setOpenModal] = useState(false);

  //Upload Modal Handler
  const HandleOpenModal = () => setOpenModal(true);
  const HandleCloseModal = () => setOpenModal(false);

    const [state, setState] = React.useState({
        left: false,
    });

  

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
            width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
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
                <ListItemButton onClick={HandleOpenModal}>
                  <ListItemIcon>
                    <AddCircleIcon/>
                  </ListItemIcon>
                  <ListItemText primary={"Upload"}/>
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
            sx={{ "& .MuiDrawer-paper": { marginTop: '168px' } }}
            BackdropProps={{ invisible: true }}
            >
            {list("left")}
            </Drawer>
        </React.Fragment>
        
        <Modal
        open={openModal}
        onClose={HandleCloseModal}
        aria-labelledby="modal-upload-title"
        aria-describedby="modal-upload-description"
        >
          <Box
          sx={{
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
          <Button variant="contained" onClick={HandleCloseModal}>
            Close
          </Button>
          <Button variant="contained" onClick={HandleCloseModal}>
            Upload
          </Button>
          </div>
        </Box>
        </Modal>
  </div>
  )
}

export default Sidebar