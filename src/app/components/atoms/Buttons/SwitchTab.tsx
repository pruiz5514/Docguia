import { ReactNode } from "react"

interface ISwitchTabProps{
    children:ReactNode;
    isActive:boolean
}

const SwitchTab:React.FC<ISwitchTabProps> = ({children, isActive}) => {
  return (
    <button className={`h-full px-5 ${isActive ? 'border border-border rounded-full bg-white text-purple-800' : 'text-[#6B7280]'}`}>
        {children}
    </button>
  )
}

export default SwitchTab