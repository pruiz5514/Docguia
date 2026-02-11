import React from 'react'

interface IAsideButton{
    children: React.ReactNode
    active: boolean
}

const AsideButton: React.FC<IAsideButton> = ({children, active}) => {
  return (
    <button
      className={`
        w-full h-10 cursor-pointer rounded-10 px-[15px] rounded-lg
        flex  items-center justify-start text-base gap-3
        ${active ? 'bg-primary-100 text-purple-800 ' : 'text-gray-600 bg-transparent'}
      `}
    >
      {children}
    </button>


  )
}

export default AsideButton