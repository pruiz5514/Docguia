import React from 'react'
import CalendarPageHeader from '../components/organisms/CalendarPageHeader'
import CalendarView from '../components/organisms/CalendarView/CalendarView'
import RightFormVIsual from '../components/atoms/RightFormVIsual'
import AppointmentFormAside from '../components/organisms/AppointmentFormAside'

const page = () => {
  return (
    <div className='w-full'>
      <CalendarPageHeader/>

      <CalendarView/>
    </div>
  )
}

export default page