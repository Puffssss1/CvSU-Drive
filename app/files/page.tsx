import React from 'react'
import FolderCard from '../components/FolderCard'
import Header from '@/components/Header'

function Files() {
  return (
    <div>
      <div className="sticky top-0 z-50">
        <Header/>
      </div>
      <FolderCard />
    </div>
  )
}

export default Files