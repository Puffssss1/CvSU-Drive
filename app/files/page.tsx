import React from 'react'
import FolderCard from '../components/FolderCard'
import Header from '@/components/Header'
import UploadFile from '../components/UploadFile';

function Files() {
  return (
    <div>
      <div className="sticky top-0 z-50">
        <Header/>
      </div>
      <FolderCard />

      <div className='ml-56 mb-12'>
        <UploadFile />
      </div>
    </div>
  )
}

export default Files