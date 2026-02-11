import React from 'react'
import FirstCalendarPageHeaderSection from '../molecules/FirstCalendarPageHeaderSection'
import SecondCalendarPageHeaderSection from '../molecules/SecondCalendarPageHeaderSection'

const CalendarPageHeader = () => {
  return (
    <header className='w-full p-6 flex flex-col gap-8'>
        <FirstCalendarPageHeaderSection/>
        <SecondCalendarPageHeaderSection/>
    </header>
  )
}

export default CalendarPageHeader