'use client'

import './CaledarView.css'
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { CustomDayHeader } from '../../atoms/CustomDayHeader'

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales: { es },
})

export default function CalendarView() {
  return (
    <div className="h-[calc(100vh-160px)]">
      <Calendar
        localizer={localizer}
        culture="es"
        defaultView={Views.WEEK}
        views={[Views.WEEK]}
        events={[]}
        step={60}
        timeslots={1}
        toolbar={false}
        components={{
          header: CustomDayHeader,
        }}
        formats={{
        dayFormat: (date, culture, localizer) => {
            const formattedDay = localizer!.format(date, 'EEE d', culture)
            const capitalizedDay =
              formattedDay.charAt(0).toUpperCase() + formattedDay.slice(1)

            return capitalizedDay
          },
        timeGutterFormat: (date, culture, localizer) => localizer!.format(date, 'h:mm a', culture),
        }}
      />
    </div>
  )
}