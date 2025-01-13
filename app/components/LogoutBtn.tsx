'use client';

import React from 'react';
import Button from '@mui/material/Button';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

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
            <div className=' rounded-lg hover:bg-slate-400 hover:bg-opacity-15 p-2'>
            <LogoutRoundedIcon className='text-[#FFB000]'/>
            </div>
          
        </Button>
      </div>
    );
  }

  return null;
}

export default LogoutBtn;
