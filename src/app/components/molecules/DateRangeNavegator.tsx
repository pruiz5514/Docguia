import { ArrowLeft, ArrowRight } from 'lucide-react'
import React from 'react'

const DateRangeNavegator = () => {
  return (
    <div className='inline-flex items-center border border-border h-10 px-2.5 rounded-2xl'>
        <button className='h-full pr-2 border-r border-border'><ArrowLeft className='w-4.5 h-4.5'/></button>
        <span className='px-5 font-semibold'> 8 - 14 Feb 2026 </span>
        <button className='h-full pl-2 border-l border-border'><ArrowRight className='w-4.5 h-4.5'/></button>
    </div>
  )
}

export default DateRangeNavegator