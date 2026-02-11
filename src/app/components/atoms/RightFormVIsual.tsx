import { X } from 'lucide-react'
import { ReactNode, useEffect } from 'react'

interface IRightFormVIsualProps {
  children: ReactNode
  closeAside: () => void
}

const RightFormVIsual: React.FC<IRightFormVIsualProps> = ({ children, closeAside }) => {
  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [])

  return (
    <div className="fixed inset-0 z-1000 bg-black/50 backdrop-blur-md flex justify-end">
      <div className="w-125 h-full bg-white shadow-2xl relative">
        <button className="absolute top-6 right-6 text-gray-500" onClick={closeAside}>
          <X />
        </button>

        {children}
      </div>
    </div>
  )
}

export default RightFormVIsual