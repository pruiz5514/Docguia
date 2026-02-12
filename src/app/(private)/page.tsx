import React from 'react'
import { Suspense } from 'react'
import CalendarPageHeader from '../components/organisms/CalendarPageHeader'
import CalendarView from '../components/organisms/CalendarView/CalendarView'

const page = () => {
  return (
    <div className='w-full'>
      <Suspense fallback={null}>
        <CalendarPageHeader/>
      </Suspense>

      <Suspense fallback={null}>
        <CalendarView/>
      </Suspense>
    </div>
  )
}

export default page
