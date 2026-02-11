import { isToday } from 'date-fns'

export function CustomDayHeader({ date, label }: { date: Date; label: string }) {
  const today = isToday(date)
  const [dayName, dayNumber] = label.split(' ')

  return (
    <div className={`flex items-center justify-center h-full ${today && 'gap-1'}`}>
      <span className="text-sm font-medium leading-none">{dayName}</span>
      <span
        className={`flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium leading-none
          ${today ? 'bg-purple-500 text-white' : 'text-purple-800'}`}
      >
        {dayNumber}
      </span>
    </div>
  )
}