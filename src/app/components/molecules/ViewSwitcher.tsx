import React from 'react'
import SwitchTab from '../atoms/Buttons/SwitchTab'

const ViewSwitcher = () => {
  return (
    <div className='flex h-10 border border-border rounded-full bg-light-gray-bg'>
        <SwitchTab isActive>Semana</SwitchTab>
        <SwitchTab isActive={false}>Día</SwitchTab>
        <SwitchTab isActive={false}>Lista</SwitchTab>
    </div>
  )
}

export default ViewSwitcher