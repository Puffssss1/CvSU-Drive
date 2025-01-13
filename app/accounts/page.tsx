'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import AccountsTable from '../components/AccountsTable';
import Header from '@/components/Header';


function Accounts() {
  const router = useRouter();

  const handleRedirect = (): void => {
    router.push('/add-account'); 
  };

  return (
    <div>

      <div className='fixed top-0 left-0 w-full z-50 '>
        <Header/>
      </div>

      <div className='flex-grow pt-24 overflow-x-auto overflow-y-auto overflow-hidden'>
        <AccountsTable/>
      </div>

      <div className='fixed bottom-10 right-10 z-50 '>
        <button className='py-3 px-5 bg-[#6A1E9C] text-[#FFB000] rounded-3xl mt-4 hover:bg-purple-700'
          onClick={handleRedirect}
          >
            Add Account
        </button>
      </div>
      
    </div>
  );
}

export default Accounts;
