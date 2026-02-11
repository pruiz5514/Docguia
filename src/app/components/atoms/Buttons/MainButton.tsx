import { ReactNode } from "react"

interface IMainButtonProps{
    children: ReactNode;
    onClick?: ()=> void;
    width?: string
    type?:"button" | "submit" | "reset"
}

const MainButton:React.FC<IMainButtonProps> = ({children, onClick, width="w-auto", type="button"}) => {
  return (
    <button type={type} className={`px-5 py-3 bg-primary rounded-2xl flex items-center justify-center gap-1 text-white font-semibold ${width}`} onClick={onClick}>
        {children}
    </button>
  )
}

export default MainButton