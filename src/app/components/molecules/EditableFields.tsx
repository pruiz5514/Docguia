import { Edit2 } from 'lucide-react'
import { EditableFieldType } from '../organisms/VoiceAppointmentModal'


export interface EditableFieldOption {
  label: string
  value: string
}

export interface EditableFieldProps {
  field: EditableFieldType
  label: string
  value: string
  type?: 'text' | 'date' | 'time' | 'number' | 'select'
  options?: EditableFieldOption[]
  isEditing: boolean
  actualValue: string | number
  onEditClick: (field: EditableFieldType) => void
  onFieldChange: (field: string, value: any) => void
  onFieldBlur: () => void
}

export const EditableField = ({
  field,
  label,
  value,
  type = 'text',
  options,
  isEditing,
  actualValue,
  onEditClick,
  onFieldChange,
  onFieldBlur
}: EditableFieldProps) => {
  if (isEditing) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg ">
        <p className="text-xs text-gray-600 mb-2">{label}</p>
        {type === 'select' ? (
          <select
            value={actualValue}
            onChange={(e) => onFieldChange(field!, e.target.value)}
            onBlur={onFieldBlur}
            className="w-full px-3 py-2 border border-border rounded-lg outline-none"
            autoFocus
          >
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={actualValue}
            onChange={(e) => onFieldChange(field!, e.target.value)}
            onBlur={onFieldBlur}
            className="w-full px-3 py-2 border border-border rounded-lg outline-none"
            autoFocus
          />
        )}
      </div>
    )
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg group relative">
      <p className="text-xs text-gray-600 mb-1">{label}</p>
      <p className="font-medium text-gray-900 text-sm capitalize">{value}</p>
      <button
        onClick={() => onEditClick(field)}
        className="absolute top-3 right-3 text-gray-400 hover:text-purple-600 transition-colors"
        title="Editar"
      >
        <Edit2 className="w-4 h-4" />
      </button>
    </div>
  )
}