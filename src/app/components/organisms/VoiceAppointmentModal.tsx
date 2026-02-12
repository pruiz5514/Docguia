'use client'

import { useState, useEffect } from 'react'
import { Mic, MicOff, Check, X, AlertCircle, Loader2, Edit2 } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { parseAppointmentFromText, ParsedAppointment } from '@/app/infrastructure/utils/appoinmentParser'
import { useVoiceRecognition } from '@/app/infrastructure/hooks/useVoiceRecognition'
import { PATIENT_OPTIONS, SERVICE_OPTIONS } from '@/app/data/options'
import TrasnparentButton from '../atoms/Buttons/TransparentButton'
import MainButton from '../atoms/Buttons/MainButton'
import { EditableField } from '../molecules/EditableFields'

interface VoiceAppointmentModalProps {
  onClose: () => void
  onConfirm: (appointment: Omit<ParsedAppointment, 'ambiguities'>) => void
}

export type EditableFieldType = 'patient' | 'date' | 'time' | 'duration' | 'services' | null

export default function VoiceAppointmentModal({ onClose, onConfirm }: VoiceAppointmentModalProps) {
  const { isListening, transcript, finalTranscript, error, startListening, stopListening, resetTranscript } = useVoiceRecognition()
  const [parsedData, setParsedData] = useState<ParsedAppointment | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [wasListening, setWasListening] = useState(false)
  const [editingField, setEditingField] = useState<EditableFieldType>(null)

  // Detectar cuando se detiene la grabación y procesar automáticamente
  useEffect(() => {
    if (wasListening && !isListening) {
      const textToProcess = finalTranscript.trim() || transcript.trim()
      
      if (textToProcess) {
        setIsProcessing(true)
        setTimeout(() => {
          const parsed = parseAppointmentFromText(textToProcess)
          setParsedData(parsed)
          setShowConfirmation(true)
          setIsProcessing(false)
        }, 800)
      }
    }
    setWasListening(isListening)
  }, [isListening, transcript, finalTranscript, wasListening])

  const handleMicClick = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const handleConfirm = () => {
    if (parsedData) {
      const { ambiguities, ...appointmentData } = parsedData
      onConfirm(appointmentData)
      onClose()
    }
  }

  const handleRetry = () => {
    resetTranscript()
    setParsedData(null)
    setShowConfirmation(false)
    setIsProcessing(false)
    startListening()
  }

  const handleAmbiguityChange = (field: string, value: any) => {
    if (parsedData) {
      setParsedData({
        ...parsedData,
        [field]: value,
        ambiguities: parsedData.ambiguities.filter(amb => amb.field !== field)
      })
    }
  }

  const handleEditClick = (field: EditableFieldType) => {
    setEditingField(field)
  }

  const handleFieldChange = (field: string, value: any) => {
    if (!parsedData) return

    let finalValue: any = value

    // Conversiones según el tipo de campo
    if (field === 'duration') {
      finalValue = parseInt(value) || 30
    }

    setParsedData({
      ...parsedData,
      [field]: finalValue
    })
  }

  const handleFieldBlur = () => {
    setEditingField(null)
  }

  const parseLocalDateString = (dateStr: string): Date | null => {
    const [year, month, day] = dateStr.split('-').map(Number)
    if (!year || !month || !day) return null
    return new Date(year, month - 1, day)
  }

  const formatDate = (dateStr: string) => {
    try {
      const localDate = parseLocalDateString(dateStr)
      if (!localDate) return dateStr
      return format(localDate, "EEEE, d 'de' MMMM", { locale: es })
    } catch {
      return dateStr
    }
  }

  const displayTranscript = finalTranscript + (transcript && !transcript.includes(finalTranscript) ? transcript : '')

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Estado: Grabando/Inicial */}
        {!showConfirmation && !isProcessing && (
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Crear cita por voz</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <button
              onClick={handleMicClick}
              disabled={isProcessing}
              className={`w-full flex items-center justify-center gap-3 p-8 rounded-2xl transition-all font-medium text-lg
                ${isListening 
                  ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30' 
                  : 'bg-purple-600 text-white shadow-lg hover:shadow-xl'
                }
              `}
            >
              {isListening ? (
                <>
                  <MicOff className="w-7 h-7" />
                  Detener grabación
                </>
              ) : (
                <>
                  <Mic className="w-7 h-7" />
                  Presiona para hablar
                </>
              )}
            </button>

            {displayTranscript && (
              <div className="p-4 bg-gray-50 border-2 border-purple-200 rounded-lg">
                <p className="text-xs text-gray-600 font-medium mb-2">
                  {isListening ? 'Escuchando...' : 'Escuché:'}
                </p>
                <p className="text-gray-900">{displayTranscript}</p>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-900">{error}</p>
                </div>
              </div>
            )}

            <button onClick={onClose} className="w-full text-sm text-gray-600 hover:text-gray-900 py-2">
              Cancelar
            </button>
          </div>
        )}

        {/* Estado: Procesando */}
        {isProcessing && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
              <p className="text-lg font-medium text-gray-900">Procesando...</p>
              <p className="text-sm text-gray-600 mt-2">Interpretando tu cita</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Dijiste:</p>
              <p className="text-sm text-gray-900">{finalTranscript || transcript}</p>
            </div>
          </div>
        )}

        {/* Estado: Confirmación */}
        {showConfirmation && parsedData && (
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Confirmar cita</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>


            <div className="space-y-3">
            <EditableField
                field="patient"
                label="Paciente"
                value={PATIENT_OPTIONS.find(p => p.value === parsedData.patient)?.label || parsedData.patient}
                type="select"
                options={PATIENT_OPTIONS.map(p => ({ label: p.label, value: p.value }))}
                isEditing={editingField === 'patient'}
                actualValue={parsedData.patient}
                onEditClick={handleEditClick}
                onFieldChange={handleFieldChange}
                onFieldBlur={handleFieldBlur}
            />

            <div className="grid grid-cols-2 gap-3">
                <EditableField
                field="date"
                label="Fecha"
                value={formatDate(parsedData.date)}
                type="date"
                isEditing={editingField === 'date'}
                actualValue={parsedData.date}
                onEditClick={handleEditClick}
                onFieldChange={handleFieldChange}
                onFieldBlur={handleFieldBlur}
                />
                <EditableField
                field="time"
                label="Hora"
                value={parsedData.time}
                type="time"
                isEditing={editingField === 'time'}
                actualValue={parsedData.time}
                onEditClick={handleEditClick}
                onFieldChange={handleFieldChange}
                onFieldBlur={handleFieldBlur}
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <EditableField
                field="duration"
                label="Duración"
                value={`${parsedData.duration} min`}
                type="number"
                isEditing={editingField === 'duration'}
                actualValue={parsedData.duration}
                onEditClick={handleEditClick}
                onFieldChange={handleFieldChange}
                onFieldBlur={handleFieldBlur}
                />
                <EditableField
                field="services"
                label="Servicio"
                value={SERVICE_OPTIONS.find(s => s.value === parsedData.services)?.label || parsedData.services}
                type="select"
                options={SERVICE_OPTIONS.map(s => ({ label: s.label, value: s.value }))}
                isEditing={editingField === 'services'}
                actualValue={parsedData.services}
                onEditClick={handleEditClick}
                onFieldChange={handleFieldChange}
                onFieldBlur={handleFieldBlur}
                />
            </div>
            </div>

            {/* Ambigüedades con opciones */}
            {parsedData.ambiguities.filter(amb => amb.options).map((amb, i) => (
              <div key={i} className="p-4 bg-amber-50 border-2 border-amber-300 rounded-lg">
                <div className="flex gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <p className="text-sm font-medium text-amber-900">{amb.message}</p>
                </div>
                <div className="space-y-2">
                  {amb.options!.map((option, optIdx) => (
                    <label
                      key={optIdx}
                      className="flex items-center gap-3 p-3 bg-white border-2 border-amber-200 rounded-lg cursor-pointer hover:border-amber-400 transition-colors"
                    >
                      <input
                        type="radio"
                        name={`ambiguity-${amb.field}-${i}`}
                        defaultChecked={optIdx === 0}
                        onChange={() => handleAmbiguityChange(amb.field, option.value)}
                        className="w-4 h-4 text-purple-600"
                      />
                      <span className="text-sm font-medium text-gray-900">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="w-full flex gap-3 pt-2">
              <TrasnparentButton onClick={handleRetry} width='w-full'>Reintentar</TrasnparentButton>
              <MainButton onClick={handleConfirm} width='w-full'>Confirmar </MainButton>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
