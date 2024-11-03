import Header from '@/components/Header';
import SearchBar from '@/app/components/SearchBar';
import React from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import FolderCard from '../app/components/FolderCard';

export default async function Home() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login")
  }
  return (
    <div>
      <Header></Header>
      <div className='justify-items-center mt-3'>
        <SearchBar/>
        <div>
          <FolderCard />
        </div>
      </div>
    </div>
  );
}