import { ReactNode } from "react"

interface IMainButtonProps{
    children: ReactNode
}

const MainButton:React.FC<IMainButtonProps> = ({children}) => {
  return (
    <button className="px-5 py-3 bg-primary rounded-2xl flex items-center justify-center gap-1 text-white font-semibold">
        {children}
    </button>
  )
}

export default MainButton