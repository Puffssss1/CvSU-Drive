'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import AccountsTable from '../components/AccountsTable';

function Accounts() {
  const router = useRouter();

  const handleRedirect = (): void => {
    router.push('/add-account'); 
  };

  return (
    <div>
      <AccountsTable />
      <div className='ml-52'>
      <button className='py-3 px-5 bg-[#004225] text-[#FFB000] rounded-3xl mt-4 '
        onClick={handleRedirect}
      >
        Add Account
      </button>
      </div>
      
    </div>
  );
}

export default Accounts;
