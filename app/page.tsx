"use client"
import React from 'react';
import { useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}
interface File {
  id: number;
  fileName: string;
  date: string;
  image: string;
}
export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [files, setFiles] = useState<File[]>([]);

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
    const fetchFiles = async () => {
      try {
        const res = await fetch('/api/files');
        const data = await res.json();
        setFiles(data);
      } catch (error) {
        console.error('Failed to fetch files:', error);
      }
    };

    fetchUsers();
    fetchFiles();
  }, []);

  return (
    <div>
      Home Page
      <h1>User List</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name}
            <li className='m-4'>{user.email}</li>
            <li className='m-4'>{user.role}</li>
          </li>
        ))}
      </ul>

      <br />
      <br />

      <h1>Files List</h1>
      <ul>
        {files.map(files => (
          <li key={files.id}>
            {files.fileName} 
            <li className='m-4'>{files.date}</li>
            <li className='m-4'><img src={files.image} alt="profile pic" /></li>
          </li>
        ))}
      </ul>
    </div>
  );
}