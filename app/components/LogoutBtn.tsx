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
    await signOut({ redirect: true });
    router.push('/login');
  };


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

  return null;
}

export default LogoutBtn;
