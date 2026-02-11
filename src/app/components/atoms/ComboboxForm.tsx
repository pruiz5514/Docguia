'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Control, Controller, FieldError, FieldValues, Path } from 'react-hook-form'

interface ComboboxOption {
  value: number
  label: string
}

interface IComboboxFormProps<T extends FieldValues> {
  label?: string
  madatory: boolean
  name: Path<T>
  control: Control<T>
  error?: FieldError
  id?: string
  placeholder?: string
  options: ComboboxOption[]
  isSubmitted?: boolean
  bg?: string
  height?: string
  border?: string
  borderColor?: string
  width?: string
}

const ComboboxForm = <T extends FieldValues>({
  label,
  madatory=false,
  name,
  control,
  error,
  id,
  placeholder,
  options,
  isSubmitted,
  bg = 'bg-white',
  height = 'h-[44px]',
  border = 'border',
  borderColor = 'border-border',
  width = 'w-full',
}: IComboboxFormProps<T>) => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Filtrar opciones 
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  )

  // Cierra dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="flex flex-col items-start gap-2">
      {label && (
        <label className={`block text-sm text-gray-600 font-medium ${width}`}>
          {label} {madatory && <span className='text-red-500'>*</span>}
        </label>
      )}
      <div className="w-full relative" ref={wrapperRef}>
        <div
          className={`
            w-full
            rounded-[14px]
            px-3.5 
            ${border}
            ${borderColor}
            flex
            items-center
            ${bg}
            ${height}
          `}
        >
          <Controller
            name={name}
            control={control}
            render={({ field }) => {
              const selectedOption = options.find((opt) => opt.value === field.value)
              const displayValue = isOpen ? search : (selectedOption?.label ?? '')

              return (
                <input
                  id={id}
                  type="text"
                  className="w-full bg-transparent outline-none text-[#001D96] font-medium text-base"
                  placeholder={placeholder}
                  value={displayValue}
                  onFocus={() => {
                    setIsOpen(true)
                    setSearch('')
                  }}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setIsOpen(true)
                  }}
                  autoComplete="off"
                />
              )
            }}
          />
        </div>

        {/* Dropdown */}
        {isOpen && filteredOptions.length > 0 && (
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <div className="absolute z-10 w-full mt-2 bg-white border border-[#E6E6E6] rounded-[14px] shadow-lg max-h-60 overflow-auto">
                {filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className="px-6 py-3 hover:bg-gray-100 cursor-pointer text-[#001D96] font-medium text-base"
                    onClick={() => {
                      field.onChange(option.value)
                      setSearch('')
                      setIsOpen(false)
                    }}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          />
        )}
      </div>

      {isSubmitted && error?.message && (
        <div className="mt-1.5">
          <p className="text-sm text-red-500 transition-opacity duration-300">
            {error.message}
          </p>
        </div>
      )}
    </div>
  )
}

export default ComboboxForm