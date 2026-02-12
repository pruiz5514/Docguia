'use client'

import './CaledarView.css'
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { format, parse, startOfWeek, getDay, addMinutes } from 'date-fns'
import { es } from 'date-fns/locale'
import { CustomDayHeader } from '../../atoms/CustomDayHeader'
import { useEffect, useState } from 'react'
import CustomCalendarEvent from '../../atoms/CustomCalendarEvent'

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales: { es },
})

export interface ICalendarEvent {
  id: number
  title: string
  start: Date
  end: Date
}

const APPOINTMENTS_KEY = 'appointments'

export default function CalendarView() {
  const [events, setEvents] = useState<ICalendarEvent[]>([])

  useEffect(() => {
    const loadEvents = () => {
      const storedAppointments = localStorage.getItem(APPOINTMENTS_KEY)
      if (!storedAppointments) return

      const appointments = JSON.parse(storedAppointments)
      
      const calendarEvents: ICalendarEvent[] = appointments.map((apt: any) => {
        const [year, month, day] = apt.date.split('-').map(Number)
        const [hours, minutes] = apt.time.split(':').map(Number)
         
        const startDate = new Date(year, month - 1, day, hours, minutes, 0)
        const endDate = addMinutes(startDate, apt.duration)

        return {
          id: apt.id,
          title: `${apt.patient}`, 
          start: startDate,
          end: endDate,
        }
      })

      setEvents(calendarEvents)
    }
    
    loadEvents()

    const handleStorageChange = () => {
      loadEvents()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('appointmentCreated', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('appointmentCreated', handleStorageChange)
    }
  }, [])

  return (
    <div className="h-[calc(100vh-160px)]">
      <Calendar
        localizer={localizer}
        culture="es"
        defaultView={Views.WEEK}
        views={[Views.WEEK]}
        events={events}
        step={60}
        timeslots={1}
        toolbar={false}
        components={{
          header: CustomDayHeader,
          event: CustomCalendarEvent,
        }}
        formats={{
          dayFormat: (date, culture, localizer) => {
            const formattedDay = localizer!.format(date, 'EEE d', culture)
            const capitalizedDay =
              formattedDay.charAt(0).toUpperCase() + formattedDay.slice(1)

            return capitalizedDay
          },
          timeGutterFormat: (date, culture, localizer) => 
            localizer!.format(date, 'h:mm a', culture),
        }}
      />
    </div>
  )
}