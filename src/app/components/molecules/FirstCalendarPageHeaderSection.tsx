"use client"

import { Info, PanelRightClose, Plus } from 'lucide-react'
import React, { useState } from 'react'
import MainButton from '../atoms/Buttons/MainButton'
import AppointmentFormAside from '../organisms/AppointmentFormAside';

const FirstCalendarPageHeaderSection = () => {
  const [openAppointmentForm, setOpenAppointmentForm] = useState(false);

  return (
    <>
        <section className='w-full flex justify-between items-center'>
            <div className='flex items-center gap-3'>
                <button className='text-gray-400'><PanelRightClose /></button>
                <h1 className='text-xl text-gray-600 font-semibold'>Calendario</h1>
                <span className='flex items-center gap-1 text-base text-purple-800 cursor-pointer'><Info className="w-4 h-4"/> ¿Cómo funciona?</span>
            </div>
            <MainButton onClick={()=>setOpenAppointmentForm(true)}>Agendar Cita <Plus /></MainButton>
        </section>

        {openAppointmentForm && <AppointmentFormAside closeAside={()=>setOpenAppointmentForm(false)}/>}
    </>

  )
}

export default FirstCalendarPageHeaderSection