import * as chrono from 'chrono-node'
import { PATIENT_OPTIONS, SERVICE_OPTIONS } from '@/app/data/options'

export interface ParsedAppointment {
  patient: string
  date: string
  time: string
  duration: number
  services: string
  office: number
  ambiguities: Array<{
    field: string
    message: string
    options?: Array<{ label: string; value: any }>
  }>
}

// Obtiene la fecha actual con año, mes, día y día de la semana
function getTodayLocalDate(): { year: number; month: number; day: number; dayOfWeek: number } {
  const now = new Date()
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    dayOfWeek: now.getDay()
  }
}

// Suma días a una fecha y devuelve la nueva fecha
function addDaysToDate(year: number, month: number, day: number, daysToAdd: number): { year: number; month: number; day: number } {
  const date = new Date(year, month - 1, day)
  date.setDate(date.getDate() + daysToAdd)
  
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate()
  }
}

// Formatea una fecha a formato ISO (YYYY-MM-DD)
function formatDate(year: number, month: number, day: number): string {
  const y = String(year)
  const m = String(month).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// Formatea una fecha en español legible (ej: "lunes 15 de marzo")
function formatDateSpanish(year: number, month: number, day: number): string {
  const date = new Date(year, month - 1, day)
  const dayNames = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
  const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
  
  return `${dayNames[date.getDay()]} ${day} de ${monthNames[month - 1]}`
}

// Detecta días de la semana en texto y calcula la fecha del próximo día mencionado
function parseDayOfWeek(text: string): { year: number; month: number; day: number } | null {
  const lowerText = text.toLowerCase()
  const today = getTodayLocalDate()
  
  const daysMap: { [key: string]: number } = {
    'domingo': 0,
    'lunes': 1,
    'martes': 2,
    'miércoles': 3,
    'miercoles': 3,
    'jueves': 4,
    'viernes': 5,
    'sábado': 6,
    'sabado': 6
  }
  
  for (const [dayName, targetDayOfWeek] of Object.entries(daysMap)) {
    if (lowerText.includes(dayName)) {
      let daysToAdd = targetDayOfWeek - today.dayOfWeek
      
      if (daysToAdd <= 0) {
        daysToAdd += 7
      }
      
      const result = addDaysToDate(today.year, today.month, today.day, daysToAdd)
      
      return result
    }
  }
  
  return null
}

// Detecta expresiones temporales en español (hoy, mañana, próximo lunes, etc.) y las convierte a fecha
function parseTemporalExpression(text: string): { year: number; month: number; day: number } | null {
  const lowerText = text.toLowerCase()
  const today = getTodayLocalDate()
  
  if (lowerText.includes('hoy')) {
    return { year: today.year, month: today.month, day: today.day }
  }
  
  if (lowerText.match(/\bmañana\b/) && !lowerText.match(/mañana\s+(en\s+la|por\s+la)/)) {
    return addDaysToDate(today.year, today.month, today.day, 1)
  }
  
  if (lowerText.includes('pasado mañana') || lowerText.includes('pasado manana')) {
    return addDaysToDate(today.year, today.month, today.day, 2)
  }
  
  const withinDaysMatch = lowerText.match(/dentro\s+de\s+(\d+)\s+d[ií]as?/)
  if (withinDaysMatch) {
    const days = parseInt(withinDaysMatch[1])
    return addDaysToDate(today.year, today.month, today.day, days)
  }
  
  const inDaysMatch = lowerText.match(/en\s+(\d+)\s+d[ií]as?/)
  if (inDaysMatch) {
    const days = parseInt(inDaysMatch[1])
    return addDaysToDate(today.year, today.month, today.day, days)
  }
  
  const nextDayMatch = lowerText.match(/(?:próximo|proximo|siguiente)\s+(lunes|martes|mi[ée]rcoles|jueves|viernes|s[áa]bado|domingo)/)
  if (nextDayMatch) {
    const dayText = `próximo ${nextDayMatch[1]}`
    return parseDayOfWeek(dayText)
  }
  
  if (lowerText.includes('esta semana')) {
    return addDaysToDate(today.year, today.month, today.day, 2)
  }
  
  if (lowerText.includes('próxima semana') || lowerText.includes('proxima semana') || lowerText.includes('la semana que viene')) {
    return addDaysToDate(today.year, today.month, today.day, 7)
  }
  
  return null
}

// Extrae la duración en minutos desde el texto (ej: "30 minutos", "una hora")
function parseDuration(text: string): number | null {
  const lowerText = text.toLowerCase()
  
  if (/media\s+hora/i.test(lowerText)) return 30
  if (/(?:una|1)\s+hora/i.test(lowerText)) return 60
  if (/(?:una|1)?\s*hora\s+y\s+media/i.test(lowerText)) return 90
  if (/(?:dos|2)\s+horas/i.test(lowerText)) return 120
  
  const numericMatch = lowerText.match(/(\d+)\s*(?:minutos?|mins?|min\b)/i)
  if (numericMatch) {
    const minutes = parseInt(numericMatch[1])
    if (minutes > 0 && minutes <= 480) return minutes
  }
  
  return null
}

// Busca coincidencias aproximadas de nombres de pacientes en el texto
function fuzzyMatchPatient(text: string): string | null {
  const lowerText = text.toLowerCase()
  
  for (const option of PATIENT_OPTIONS) {
    const lowerName = option.label.toLowerCase()
    if (lowerName.includes(lowerText) || lowerText.includes(lowerName)) {
      return option.value
    }
  }
  
  const words = lowerText.split(' ')
  for (const word of words) {
    if (word.length < 3) continue
    for (const option of PATIENT_OPTIONS) {
      if (option.label.toLowerCase().includes(word)) {
        return option.value
      }
    }
  }
  
  return null
}

// Busca coincidencias aproximadas de servicios en el texto
function fuzzyMatchService(text: string): string | null {
  const lowerText = text.toLowerCase()
  
  for (const option of SERVICE_OPTIONS) {
    const lowerLabel = option.label.toLowerCase()
    if (lowerText.includes(option.value) || lowerText.includes(lowerLabel) || lowerLabel.includes(lowerText)) {
      return option.value
    }
  }
  
  return null
}

// Procesa texto en lenguaje natural y extrae toda la información de una cita médica

export function parseAppointmentFromText(text: string): ParsedAppointment {
  const ambiguities: ParsedAppointment['ambiguities'] = []
  const lowerText = text.toLowerCase()

  let patient = ''

  // Regex flexible para detectar nombres propios en español (con soporte de acentos)
  const patientPatterns = [
    /(?:con|para|a)\s+([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*)/,
    /([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)+)/
  ]
  
  let potentialPatient = ''
  for (const pattern of patientPatterns) {
    const match = text.match(pattern)
    if (match) {
      potentialPatient = match[1].trim()
      break
    }
  }

  if (potentialPatient) {
    const matchedPatient = fuzzyMatchPatient(potentialPatient)
    
    if (matchedPatient) {
      patient = matchedPatient
    } else {
      // Si el nombre no coincide, asigna uno por defecto y genera ambigüedad
      patient = PATIENT_OPTIONS[0].value
      ambiguities.push({
        field: 'patient',
        message: `No reconocí a "${potentialPatient}". Selecciona el paciente:`,
        options: PATIENT_OPTIONS.map(p => ({ label: p.label, value: p.value }))
      })
    }
  } else {
    patient = PATIENT_OPTIONS[0].value
    ambiguities.push({
      field: 'patient',
      message: 'No identifiqué el nombre del paciente. Selecciona uno:',
      options: PATIENT_OPTIONS.map(p => ({ label: p.label, value: p.value }))
    })
  }

  const today = getTodayLocalDate()
  let dateData = { year: today.year, month: today.month, day: today.day }
  let date = formatDate(today.year, today.month, today.day)
  let time = '09:00'
  let dateFound = false

  // Parser propio para expresiones relativas como "mañana", etc.
  const temporalDate = parseTemporalExpression(text)
  if (temporalDate) {
    dateData = temporalDate
    date = formatDate(temporalDate.year, temporalDate.month, temporalDate.day)
    dateFound = true
  } else {
    // Parser específico para días de la semana (ej: "el lunes")
    const dayOfWeekDate = parseDayOfWeek(text)
    if (dayOfWeekDate) {
      dateData = dayOfWeekDate
      date = formatDate(dayOfWeekDate.year, dayOfWeekDate.month, dayOfWeekDate.day)
      dateFound = true
    }
  }

  if (!dateFound) {
    // Uso de chrono para parsing avanzado con forwardDate (evita fechas pasadas)
    const chronoParsed = chrono.es.parse(text, new Date(), { forwardDate: true })
    
    if (chronoParsed.length > 0) {
      const parsedDate = chronoParsed[0].start.date()
      dateData = {
        year: parsedDate.getFullYear(),
        month: parsedDate.getMonth() + 1,
        day: parsedDate.getDate()
      }
      date = formatDate(dateData.year, dateData.month, dateData.day)
      dateFound = true

      // Extrae hora si chrono la detectó explícitamente
      if (chronoParsed[0].start.get('hour') !== undefined) {
        const hour = chronoParsed[0].start.get('hour')!
        const minute = chronoParsed[0].start.get('minute') || 0
        time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
      }
    }
  }

  if (!dateFound) {
    // Fallback automático: agenda para mañana si no hay fecha detectada
    dateData = addDaysToDate(today.year, today.month, today.day, 1)
    date = formatDate(dateData.year, dateData.month, dateData.day)
    ambiguities.push({
      field: 'date',
      message: 'No se identificó fecha, se asignó para mañana'
    })
  }

  const hourMatch = lowerText.match(/(?:a\s+las?|a)\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm|a\.?m\.?|p\.?m\.?)?/)
  
  if (hourMatch) {
    let hour = parseInt(hourMatch[1])
    const minute = hourMatch[2] ? parseInt(hourMatch[2]) : 0
    const meridiem = hourMatch[3]?.toLowerCase().replace(/\./g, '')

    // Si no especifica AM/PM, genera ambigüedad y propone ambas opciones
    if (!meridiem && hour >= 1 && hour <= 12) {
      const amTime = hour === 12 ? '00:00' : `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
      const pmTime = `${String(hour === 12 ? 12 : hour + 12).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
      
      ambiguities.push({
        field: 'time',
        message: `¿La cita es a las ${hour}${minute ? ':' + String(minute).padStart(2, '0') : ''} AM o PM?`,
        options: [
          { label: `${hour}:${String(minute).padStart(2, '0')} AM (mañana)`, value: amTime },
          { label: `${hour}:${String(minute).padStart(2, '0')} PM (tarde)`, value: pmTime }
        ]
      })
      
      // Heurística: asume PM si es muy temprano (1–6), si no AM
      time = hour >= 1 && hour <= 6 ? pmTime : amTime
    } else {
      if (meridiem === 'pm' && hour < 12) hour += 12
      if (meridiem === 'am' && hour === 12) hour = 0
      
      time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
    }
  }

  const APPOINTMENTS_KEY = 'appointments'
  const existingAppointments = typeof window !== 'undefined' ? localStorage.getItem(APPOINTMENTS_KEY) : null

  if (existingAppointments) {
    const appointments = JSON.parse(existingAppointments)

    // Detecta conflicto exacto de fecha + hora
    const hasConflict = appointments.some((apt: any) => apt.date === date && apt.time === time)

    if (hasConflict) {
      let nextDate = addDaysToDate(dateData.year, dateData.month, dateData.day, 1)
      let foundAvailable = false
      const maxDaysToCheck = 7 // Busca disponibilidad hasta 7 días adelante
      
      for (let i = 0; i < maxDaysToCheck; i++) {
        const checkDate = formatDate(nextDate.year, nextDate.month, nextDate.day)
        const hasConflictOnDay = appointments.some((apt: any) => apt.date === checkDate && apt.time === time)
        
        if (!hasConflictOnDay) {
          foundAvailable = true
          ambiguities.push({
            field: 'date',
            message: `Ya hay una cita el ${formatDateSpanish(dateData.year, dateData.month, dateData.day)} a las ${time}. ¿Quieres agendarla en otro día?`,
            options: [
              { 
                label: `${formatDateSpanish(nextDate.year, nextDate.month, nextDate.day)} a las ${time}`, 
                value: checkDate 
              },
              { 
                label: `Mantener fecha original (${formatDateSpanish(dateData.year, dateData.month, dateData.day)})`, 
                value: date 
              }
            ]
          })
          break
        }
        nextDate = addDaysToDate(nextDate.year, nextDate.month, nextDate.day, 1)
      }

      if (!foundAvailable) {
        ambiguities.push({
          field: 'date',
          message: `Ya hay una cita el ${formatDateSpanish(dateData.year, dateData.month, dateData.day)} a las ${time}.`
        })
      }
    }
  }

  let duration = 30
  const parsedDuration = parseDuration(text)
  if (parsedDuration) duration = parsedDuration

  let services = 'consulta'
  const matchedService = fuzzyMatchService(text)
  
  if (matchedService) {
    services = matchedService
  }

  const office = 1

  return {
    patient,
    date,
    time,
    duration,
    services,
    office,
    ambiguities
  }
}