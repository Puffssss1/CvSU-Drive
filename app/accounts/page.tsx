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
      <button
        onClick={handleRedirect}
        style={{
          padding: '10px 20px',
          background: '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          zIndex: 10,
        }}
      >
        Go to Target Page
      </button>
    </div>
  );
}

export default Accounts;
