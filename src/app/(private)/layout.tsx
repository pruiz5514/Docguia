import React from 'react'
import Aside from '../components/organisms/Aside'

function layout({ children }: { children: React.ReactNode}) {
  return (
    <div className='w-full flex'>
        <Aside/>
       <div className='w-full'>
            {children}
       </div>
    </div>
  )
}

export default layout