import Header from '@/components/Header'
import * as React from 'react'
import ApprovalTable from '../components/ApprovalTable'


function Approval() {
  return (
    <div>
        <div className="fixed top-0 z-50 w-full">
            <Header/>
        </div> 

        <div className='ml-52 mt-32 px-4 py-4 font-bold text-white text-2xl max-w-[1900px] bg-[#6A1E9C] rounded-sm'>
          Approval
        </div>

        <div className='flex-grow pt-4 overflow-x-auto overflow-y-auto overflow-hidden'>
            <ApprovalTable/>
        </div>

    </div>
  )
}

export default Approval