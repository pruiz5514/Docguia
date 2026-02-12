"use client"

import { Info, Mic, PanelRightClose, Plus } from 'lucide-react'
import React, { useState } from 'react'
import MainButton from '../atoms/Buttons/MainButton'
import AppointmentFormAside from '../organisms/AppointmentFormAside';
import TrasnparentButton from '../atoms/Buttons/TransparentButton';

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
            <div className='flex gap-3'>
              <TrasnparentButton>Agendar cita por voz <Mic /></TrasnparentButton>
              <MainButton onClick={()=>setOpenAppointmentForm(true)}>Agendar Cita <Plus /></MainButton>
            </div>
            
        </section>

        {openAppointmentForm && <AppointmentFormAside closeAside={()=>setOpenAppointmentForm(false)}/>}
    </>

  )
}

export default FirstCalendarPageHeaderSection