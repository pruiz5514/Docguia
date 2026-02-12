import { ReactNode } from "react"

interface IFilterButtonProps{
    children:ReactNode
}

const FilterButton:React.FC<IFilterButtonProps> = ({children}) => {
  return (
    <button className="h-10 flex items-center gap-3 px-5 border border-border rounded-xl bg-white text-gray-600 font-medium">{children}</button>
  )
}

export default FilterButton