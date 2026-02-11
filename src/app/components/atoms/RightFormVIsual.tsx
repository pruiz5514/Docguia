import { X } from 'lucide-react'
import { ReactNode, useEffect, useState } from 'react'

interface IRightFormVIsualProps {
  children: ReactNode
  closeAside: () => void
}

const RightFormVIsual: React.FC<IRightFormVIsualProps> = ({ children, closeAside }) => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    setTimeout(() => setShow(true), 15)

    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [])

  return (
    <div
      className={`fixed inset-0 z-1000 backdrop-blur-md flex justify-end transition-all duration-300 ${
        show ? 'bg-black/50 opacity-100' : 'bg-black/0 opacity-0'
      }`}
    >
      <div
        className={`w-125 h-full bg-white shadow-2xl relative transform transition-transform duration-300 ${
          show ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          className="absolute top-6 right-6 text-gray-500 hover:text-black transition"
          onClick={closeAside}
        >
          <X />
        </button>

        {children}
      </div>
    </div>
  )
}

export default RightFormVIsual