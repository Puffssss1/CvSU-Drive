'use client';
import React from 'react';
import { Paper, Typography, Grid, Avatar } from '@mui/material';
import Header from '@/components/Header';
import Sidebar from '../components/Sidebar';

const ProfileView = () => {
  
  const profileData = {
    name: "Denzel Sanchez",
    department: "Software Development",
    email: "denzel.sanchez@example.com",
    sex: "Male",
    civilStatus: "Single",
    religion: "Christianity",
    contact: "+63908264578",
    birthday: "05/09/1995",
  };

  return (
    <div>
      <Header/>

      <div className='flex items-center justify-center'>
        <Paper
          elevation={3}
          style={{
            padding: '20px',
            maxWidth: '800px', 
            margin: '20px',
          }}
        >
          <Grid container spacing={2} alignItems="center">
            {/* Profile Picture Section */}
            <Grid item xs={12} sm={4} md={3}>
              <Avatar 
                alt="Profile Picture" 
                src="/path/to/profile-pic.jpg" 
                style={{
                  width: '100%',
                  height: 'auto',
                  maxWidth: '150px',
                  margin: 'auto',
                }}
              />
            </Grid>

            
            <Grid item xs={12} sm={8} md={9}>
              <Grid container spacing={2}>
                {['name', 'department', 'email', 'sex'].map((key) => (
                  <React.Fragment key={key}>
                    <Grid item xs={6} sm={4}>
                      <Typography variant="subtitle1" color="textSecondary">
                        {key.charAt(0).toUpperCase() + key.slice(1)}:
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={8}>
                      <Typography variant="body1">{profileData[key]}</Typography>
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>
            </Grid>

            
            {Object.entries(profileData).map(([label, value]) => (
              ['name', 'department', 'email', 'sex'].includes(label) ? null : (
                <React.Fragment key={label}>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="subtitle1" color="textSecondary">
                      {label.charAt(0).toUpperCase() + label.slice(1)}:
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={8}>
                    <Typography variant="body1">{value}</Typography>
                  </Grid>
                </React.Fragment>
              )
            ))}
          </Grid>
        </Paper>
      </div>
    </div>
  );
};

export default ProfileView;
