"use client"
import React from 'react'
import { HiOutlineUserCircle } from "react-icons/hi";
import Sidebar from '@/app/components/Sidebar';
import LogoutBtn from '../app/components/LogoutBtn';
import { useSession } from 'next-auth/react';


function Header() {
  const {data:session} = useSession();

  return (
    <div className='w-full h-full bg-[#9ABF80] pb-1 pt-1 px-3'>
        <div className='flex flex-row w-full justify-between gap-40 p-5 items-center sm:gap-8 p-5'>
            <div className='flex-shrink-0'>
            <Sidebar/>
            </div>
            <h1 className="text-[#1C325B] font-light text-center text-sm sm:text-2xl mt-3 sm:mt-0 max-w-[250px] sm:max-w-full mx-auto break-words">Welcome to CvSU Drive</h1>
            <div className='mt-3 sm:mt-0'>
                {/* Small screen only */}
                <div className="flex items-center gap-2 sm:hidden">
                  <a href="/profile">
                    <HiOutlineUserCircle className="text-3xl text-[#1C325B]" />
                  </a>
                  <LogoutBtn />
                </div>
                
                {/* Larger Screens: Full Profile Info */}
                <div className='hidden sm:flex items-center gap-0'>
                  <a href="/profile" className="text-right text-xs sm:text-base flex items-center gap-2">
                    <ul className='m-0 p-0'>
                      {session?.user ? (
                        <>
                          <li>{session.user.name},</li>
                          <li>{session?.role}</li>
                        </>
                      ) : (
                        <li>User not logged in</li>
                      )}
                    </ul>
                    <HiOutlineUserCircle className='text-4xl text-[#1C325B]' />
                  </a>
                  <LogoutBtn />
                </div>
            </div>
            
        </div>
    </div>
  )
}

export default Header