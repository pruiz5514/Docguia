import { ChevronsUpDown } from 'lucide-react'
import React from 'react'

const ProfileSection = () => {
  return (
    <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
            <div className='w-11 h-11 bg-[#bfb5fe] flex justify-center items-center rounded-xl text-white font-bold'>
                C
            </div>
            <span className='text-black font-semibold text-[13px]'>Dr. Carlos Parra</span>
        </div>

        <button className='text-gray-600'><ChevronsUpDown/></button>
    </div>
  )
}

export default ProfileSection