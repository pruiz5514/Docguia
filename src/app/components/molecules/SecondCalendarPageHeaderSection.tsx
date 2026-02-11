import React from 'react'
import DateRangeNavegator from './DateRangeNavegator'
import ViewSwitcher from './ViewSwitcher'

const SecondCalendarPageHeaderSection = () => {
  return (
    <section className="grid grid-cols-3 items-center w-full">
      
      <div className="flex items-center text-gray-600 gap-3">
        <div className="inline-flex items-center h-10 px-3.5 border border-border rounded-2xl font-medium">
          Hoy
        </div>
        <DateRangeNavegator/>
      </div>

      <div className="flex justify-center">
        <ViewSwitcher/>
      </div>

      <div className="flex justify-end">
        filtros
      </div>

    </section>
  )
}

export default SecondCalendarPageHeaderSection