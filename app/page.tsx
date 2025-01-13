import Header from '@/components/Header';
import SearchBar from '@/app/components/SearchBar';
import React from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import RecentFiles from '../app/components/RecentFiles';

export default async function Home() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login")
  }
  return (
    <div>
      <div className="sticky top-0 z-50">
        <Header/>
      </div>
      <div className='justify-items-center mt-3'>
        <div className='w-screen justify-items-center'>
          <SearchBar/>
        </div>
        <div>
          <RecentFiles />
        </div>
      </div>
    </div>
  );
}