import Header from '@/components/Header'
import * as React from 'react'
import ApprovalTable from '../components/ApprovalTable'


function Approval() {
  return (
    <div>
        <div className="fixed top-0 z-50 w-full">
            <Header/>
        </div>

        <div className='flex-grow pt-24 overflow-x-auto overflow-y-auto overflow-y-hidden overflow-hidden'>
            <ApprovalTable/>
        </div>

    </div>
  )
}

export default Approval