'use client'

import Image from "next/image"
import AsideButton from "../atoms/Buttons/AsideButton"
import { Bell, Building2, Calendar, CreditCard, DollarSign, Gift, House, Puzzle, Sparkle, Users } from "lucide-react"
import ProfileSection from "../molecules/ProfileSection"



const Aside: React.FC= () => {
  return (
    <aside className='w-67.5 min-h-screen bg-surface-muted px-5 py-6 flex flex-col border-r-2 border-border'>
        <div className='mb-10'>
            <Image src='/images/logo.avif' alt='logo' width={130} height={100}/>
        </div>
        <nav>
            <ul className='flex flex-col gap-2'>
                <li><AsideButton active={false}><House/> Inicio</AsideButton></li>
                <li><AsideButton active={true}><Calendar /> Calendario</AsideButton></li>
                <li><AsideButton active={false}><Users /> Pacientes</AsideButton></li>
                <li><AsideButton active={false}><CreditCard /> Cobros</AsideButton></li>

                <li className="text-[12px] text-gray-600 font-semibold">GESTIÓN</li>

                <li><AsideButton active={false}><Bell /> Recordatorios</AsideButton></li>
                <li><AsideButton active={false}><Gift /> Cobros</AsideButton></li>

                <li className="text-[12px] text-gray-600 font-semibold">CONFIGURACIÓN</li>

                <li><AsideButton active={false}><Building2 /> Consultorios</AsideButton></li>
                <li><AsideButton active={false}><DollarSign /> Servicios</AsideButton></li>
                <li><AsideButton active={false}><Puzzle /> Plantillas</AsideButton></li>
            </ul>
        </nav>

        <div className="mt-auto">
            <div className="w-full bg-primary-100 py-4 flex flex-col items-center gap-1 text-[14px] text-purple-800 rounded-2xl mb-5">
                <span className="flex items-center gap-2 font-bold"><Sparkle className="w-4.5 h-4.5" /> Cuenta Demo</span>
                <span className="font-medium">Acceso ilimitado</span>
            </div>
            <ProfileSection/>
        </div>
    </aside>

  )
}

export default Aside