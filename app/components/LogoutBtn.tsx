'use client';

import React from 'react';
import Button from '@mui/material/Button';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

function LogoutBtn() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: true }); // Do not redirect automatically
    router.push('/login'); // Redirect to login page after logging out
  };

  // Only show the button if the user is logged in (session exists)
  if (status === 'authenticated' && session) {
    return (
      <div>
        <Button 
          variant="text" 
          onClick={handleLogout}>
          Logout
        </Button>
      </div>
    );
  }

  // Otherwise, return null or empty fragment when user is not logged in
  return null;
}

export default LogoutBtn;
