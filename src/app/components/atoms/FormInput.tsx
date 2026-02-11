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
  const today = new Date().toISOString().split('T')[0]
  const tomorrow = new Date()
  tomorrow.setDate(new Date().getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split('T')[0]

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
                  ? field.value
                    ? new Date(field.value).toISOString().split('T')[0]
                    : ''
                  : field.value ?? ''
              }
              onChange={(e) => {
                const val = e.target.value
                if (type === 'date') {
                  field.onChange(val ? new Date(val) : undefined)
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
