import { ReactNode } from "react"

interface ITrasnparentButtonProps{
    children: ReactNode;
    onClick?: ()=> void
    width?:string
    type?:"button" | "submit" | "reset"
}

const TrasnparentButton:React.FC<ITrasnparentButtonProps> = ({children, onClick, width='w-auto', type="button"}) => {
  return (
    <button type={type} className={`px-5 py-3 bg-transparent border border-border rounded-2xl flex items-center justify-center gap-1 text-purple-800 font-semibold ${width}`} onClick={onClick}>
        {children}
    </button>
  )
}

export default TrasnparentButton