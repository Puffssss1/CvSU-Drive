"use client"
import React from 'react'
import { SlList } from 'react-icons/sl' 
import { useEffect, useState } from 'react';
import { HiOutlineUserCircle } from "react-icons/hi";
import SearchBar from '@/app/components/SearchBar';
import Sidebar from '@/app/components/Sidebar';


interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

function Header() {
  const [users, setUsers] = useState<User[]>([]);

    // HOW TO FETCH DATA FROM THE API
  useEffect(() => {
    // Fetch data from the API route
    const fetchUsers = async () => {
    try {
        const res = await fetch('/api/users');
        const data = await res.json();
        setUsers(data);
    } catch (error) {
        console.error('Failed to fetch users:', error);
    }
    };
    
    fetchUsers();
  }, []);

  return (
    <div className='w-full h-full p-10 bg-[#EEEDEB] pb-0'>
        <h1 className="text-fontGreen text-center text-2xl">Welcome to CvSU Drive</h1>
        <div className='flex flex-row w-full justify-center gap-40 p-5 align-middle'>
            <Sidebar/>
            <SearchBar/>
            <div className='flex flex-row gap-1 align-middle'>
              <ul className='text-right text-sm m-0 p-0'>
                {users.filter(user => user.id === 1).map(user => (
                    <li key={user.id}>
                    {user.name}
                    <li>{user.role}</li>
                    </li>
                ))}
              </ul>
              <HiOutlineUserCircle className='size-10'></HiOutlineUserCircle>
            </div>
            
        </div>
    </div>
  )
}

export default Header