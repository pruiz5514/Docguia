'use client';

import React, { useId } from 'react';
import { Control, Controller, FieldError, FieldValues, Path } from 'react-hook-form';

interface Option {
  value: string | number | boolean;
  label: string;
}

interface SelectFormProps<T extends FieldValues> {
  label?: string;
  madatory: boolean
  name: Path<T>;
  control: Control<T>;
  error?: FieldError;
  options: Option[];
  id?: string;
  placeholder?: string;
  isSubmitted?: boolean;
  border?: string;
  height?: string;
  onChangeCustom?: (value: number | string | boolean) => void;
  vertical?: boolean;
  width?: string
}

const SelectForm = <T extends FieldValues>({
  label,
  madatory=false,
  name,
  control,
  error,
  options,
  id,
  placeholder = 'Selecciona una opción',
  isSubmitted,
  border = 'border border-[#E6E6E6]',
  height = 'h-[44px]',
  onChangeCustom,
  vertical = false,
  width = 'min-w-[150px]'
}: SelectFormProps<T>) => {
  const accessibleName = label ?? placeholder ?? String(name);
  const reactId = useId();
  const selectId = id ?? `${reactId}-${String(name)}`;
  return (
    <div className={`flex items-center ${vertical ? 'flex-col items-start gap-2' : 'flex gap-2'}`}>      
        <label htmlFor={selectId} className={`text-gray-600 font-medium text-sm ${width}`}>
          {label} {madatory && <span className='text-red-500'>*</span>}
        </label>
      <div className={`bg-white w-full rounded-lg ${height} px-3.5 ${border} flex items-center`}>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <select
              id={selectId}
              className="w-full bg-transparent text-[#001D96] text outline-none cursor-pointer"
              value={field.value !== undefined && field.value !== null ? field.value.toString() : ''}
              onChange={(e) => {
                const val = e.target.value;
                let parsed: string | number | boolean;
                if (val === 'true') {
                  parsed = true;
                } else if (val === 'false') {
                  parsed = false;
                } else if (!isNaN(Number(val))) {
                  parsed = Number(val);
                } else {
                  parsed = val;
                }
                field.onChange(parsed);
                onChangeCustom?.(parsed);
              }}
            >
              <option value="" disabled >{placeholder}</option>
              {options.map((option) => (
                <option key={option.value.toString()} value={option.value.toString()}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        />
      </div>
      {isSubmitted && error?.message && (
        <div className="mt-1.5">
          <p className="text-sm text-red-600 transition-opacity duration-300">{error.message}</p>
        </div>
      )}
    </div>
  );
};

export default SelectForm;
