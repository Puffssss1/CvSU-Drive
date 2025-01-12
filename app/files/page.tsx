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

      <div className='justify-items-center mt-3'>
        <FolderCard />
      </div>
    
      <div className='fixed bottom-10 right-10 z-50s'>
        <UploadFile />
      </div>
    </div>
  )
}

export default Files