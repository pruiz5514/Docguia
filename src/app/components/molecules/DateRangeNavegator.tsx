'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { addWeeks, subWeeks, format, startOfWeek, endOfWeek, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

const DateRangeNavegator = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const getCurrentDate = () => {
    const dateParam = searchParams.get('date')
    return dateParam ? parseISO(dateParam) : new Date()
  }

  const getDateRangeText = () => {
    const currentDate = getCurrentDate()
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 })
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 })
    
    const startDay = format(weekStart, 'd', { locale: es })
    const endDay = format(weekEnd, 'd', { locale: es })
    const month = format(weekEnd, 'MMM', { locale: es })
    const year = format(weekEnd, 'yyyy', { locale: es })
    
    return `${startDay} - ${endDay} ${month} ${year}`
  }

  const navigateToWeek = (date: Date) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('date', format(date, 'yyyy-MM-dd'))
    router.push(`?${params.toString()}`)
  }

  const handlePreviousWeek = () => {
    const currentDate = getCurrentDate()
    const previousWeek = subWeeks(currentDate, 1)
    navigateToWeek(previousWeek)
  }

  const handleNextWeek = () => {
    const currentDate = getCurrentDate()
    const nextWeek = addWeeks(currentDate, 1)
    navigateToWeek(nextWeek)
  }

  return (
    <div className='inline-flex items-center border border-border h-10 px-2.5 rounded-2xl'>
      <button 
        onClick={handlePreviousWeek}
        className='h-full pr-2 border-r border-border hover:bg-gray-50 transition-colors'
        aria-label="Semana anterior"
      >
        <ArrowLeft className='w-4.5 h-4.5'/>
      </button>
      
      <span className='px-5 font-semibold'>
        {getDateRangeText()}
      </span>
      
      <button 
        onClick={handleNextWeek}
        className='h-full pl-2 border-l border-border hover:bg-gray-50 transition-colors'
        aria-label="Semana siguiente"
      >
        <ArrowRight className='w-4.5 h-4.5'/>
      </button>
    </div>
  )
}

export default DateRangeNavegator