import React from 'react'
import CalendarPageHeader from '../components/organisms/CalendarPageHeader'
import CalendarView from '../components/organisms/CalendarView/CalendarView'

const page = () => {
  return (
    <div className='w-full'>
      <CalendarPageHeader/>

      <CalendarView/>
    </div>
  )
}

export default page