import { ReactNode } from "react"

interface IMainButtonProps{
    children: ReactNode;
    onClick?: ()=> void
}

const MainButton:React.FC<IMainButtonProps> = ({children, onClick}) => {
  return (
    <button className="px-5 py-3 bg-primary rounded-2xl flex items-center justify-center gap-1 text-white font-semibold" onClick={onClick}>
        {children}
    </button>
  )
}

export default MainButton