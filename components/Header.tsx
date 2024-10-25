"use client"
import React from 'react'
import { HiOutlineUserCircle } from "react-icons/hi";
import SearchBar from '@/app/components/SearchBar';
import Sidebar from '@/app/components/Sidebar';
import LogoutBtn from '../app/components/LogoutBtn';
import { useSession } from 'next-auth/react';


function Header() {
  const {data:session} = useSession();

  return (
    <div className='w-full h-full bg-[#EEEDEB] pb-1 pt-1 px-3'>
        <div className='flex flex-row w-full justify-between gap-40 p-5 align-middle'>
            <Sidebar/>
            <h1 className="text-fontGreen text-center text-2xl">Welcome to CvSU Drive</h1>
            <div className='flex flex-row gap-1 align-middle'>
              <ul className='text-right text-sm w-24 m-0 p-0 gap-0'>
                  {session?.user ? (
                  <>
                    <li>{session.user.name},</li>
                    <li>{session?.role}</li>
                  </>
                ) : (
                  <li>User not logged in</li>
                )}
              </ul>
              <HiOutlineUserCircle className='size-10'></HiOutlineUserCircle>
              <LogoutBtn/>
            </div>
            
        </div>
    </div>
  )
}

export default Header