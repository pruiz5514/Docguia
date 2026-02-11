import { ICalendarEvent } from "../organisms/CalendarView/CalendarView"

interface CustomCalendarEventProps{
    event: ICalendarEvent
}

const CustomCalendarEvent:React.FC<CustomCalendarEventProps> = ({event}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }
  return (
    <div className="flex flex-col">
      <span className="font-semibold text-purple-800 text-sm">
        {event.title}
      </span>
      <span className="text-purple-800 text-sm">
        {formatTime(event.start)} - {formatTime(event.end)}
      </span>
    </div>
  )
}

export default CustomCalendarEvent