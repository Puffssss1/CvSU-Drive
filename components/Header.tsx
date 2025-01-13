"use client"
import React from 'react'
import { HiOutlineUserCircle } from "react-icons/hi";
import Sidebar from '@/app/components/Sidebar';
import LogoutBtn from '../app/components/LogoutBtn';
import { useSession } from 'next-auth/react';


function Header() {
  const {data:session} = useSession();

  return (
    <div className='w-full h-full bg-[#6A1E9C] pb-1 pt-1 px-3'>
        <div className='flex flex-row w-full justify-between gap-40 p-5 items-center sm:gap-8'>
            <div className='flex-shrink-0'>
            <Sidebar/>
            </div>
            {/* <div>
            <img 
                            src="/images/CVSU LOGO.png" 
              
                            alt="CvSU Logo" 
                            className="w-10 h-auto" 
                        />
            </div> */}
            <div className='mt-3 sm:mt-0'>
                {/* Small screen only */}
                <div className="flex items-center gap-2 sm:hidden">
                  <a href="/profile">
                    <HiOutlineUserCircle className="text-3xl text-[#FFB000]" />
                  </a>
                  <LogoutBtn />
                </div>
                
                {/* Larger Screens: Full Profile Info */}
                <div className='hidden sm:flex items-center gap-0'>
                  <div className='hover:bg-slate-400 hover:bg-opacity-20 p-1 rounded-lg'>
                  <a href="/profile" className="text-right text-xs sm:text-base flex items-center gap-2 text-[#FFCF9D] text-opacity-80">
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
                    <HiOutlineUserCircle className='text-4xl text-[#FFB000]' />
                  </a>
                  </div>
                  
                  <LogoutBtn />
                </div>
            </div>
            
        </div>
    </div>
  )
}

export default Header