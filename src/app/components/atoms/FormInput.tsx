'use client'

import { Control, Controller, FieldError, FieldValues, Path } from 'react-hook-form'
import Input from './Input'

interface IFormInputProps<T extends FieldValues> {
  label?: string
  mandatory:boolean;
  type: string
  name: Path<T>
  control: Control<T>
  error?: FieldError
  id?: string
  placeholder?: string
  icon?: React.ReactNode
  isSubmitted?: boolean
  minAfterToday?: boolean
  bg?: string
  height?: string
  border?: string
  borderColor?: string
  vertical?: boolean
  width?: string
}

const FormInput = <T extends FieldValues>({
  label,
  mandatory=false,
  type,
  name,
  control,
  error,
  id,
  placeholder,
  icon,
  isSubmitted,
  minAfterToday,
  bg = 'bg-white',
  height = 'h-[44px]',
  border = 'border',
  borderColor = 'border-[#E6E6E6]',
  vertical = false,
  width= 'w-full'
}: IFormInputProps<T>) => {
  const formatDateToLocalString = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const normalizeDateValue = (value: unknown): string => {
    if (!value) return ''

    if (typeof value === 'string') {
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
      const parsed = new Date(value)
      return Number.isNaN(parsed.getTime()) ? '' : formatDateToLocalString(parsed)
    }

    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? '' : formatDateToLocalString(value)
    }

    return ''
  }

  const today = formatDateToLocalString(new Date())
  const tomorrow = new Date()
  tomorrow.setDate(new Date().getDate() + 1)
  const tomorrowStr = formatDateToLocalString(tomorrow)

  const min =
    type === 'date' && minAfterToday === true
      ? tomorrowStr
      : undefined
  const max =
    type === 'date' && minAfterToday === false
      ? today
      : undefined

  return (
    <div className={`flex flex-col ${vertical ? 'flex-col items-start gap-2' : 'flex gap-2'} `}>
      {label && (
        <label className={`text-gray-600 font-medium text-sm ${width}`}>
          {label} {mandatory && <span className='text-red-500'>*</span>}
        </label>
      )}
      <div
        className={`
          w-full
          rounded-lg
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
          render={({ field }) => (
            <Input
              id={id}
              type={type}
              error={error?.message}
              placeholder={placeholder}
              color="text-[#001D96] font-medium"
              fontSize="text-base"
              isSubmitted={isSubmitted}
              min={min}
              max={max}
              value={
                type === 'date'
                  ? normalizeDateValue(field.value)
                  : field.value ?? ''
              }
              onChange={(e) => {
                const val = e.target.value
                if (type === 'date') {
                  field.onChange(val || '')
                } else {
                  field.onChange(val)
                }
              }}
            />
          )}
        />
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

export default FormInput
