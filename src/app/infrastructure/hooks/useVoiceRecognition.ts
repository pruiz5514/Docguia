import { useState, useRef, useCallback } from 'react'

// Hook para reconocimiento de voz continuo en español
export function useVoiceRecognition() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [finalTranscript, setFinalTranscript] = useState('')
  const recognitionRef = useRef<any>(null)

  // Inicia la escucha continua del micrófono
  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || 
                              (window as any).webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      setError('Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'es'
    recognition.continuous = true
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setIsListening(true)
      setTranscript('')
      setFinalTranscript('')
      setError(null)
    }

    // Procesa los resultados de voz, separando texto provisional del final
    recognition.onresult = (event: any) => {
      let interimTranscript = ''
      let currentFinal = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          currentFinal += transcriptPiece + ' '
        } else {
          interimTranscript += transcriptPiece
        }
      }

      if (currentFinal) {
        setFinalTranscript(prev => prev + currentFinal)
      }
      
      setTranscript(currentFinal || interimTranscript)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.onerror = (event: any) => {
      console.error('Error de reconocimiento:', event.error)
      setError('Error al procesar el audio. Intenta de nuevo.')
      setIsListening(false)
    }

    recognitionRef.current = recognition
    recognition.start()
  }, [])

  // Detiene la escucha del micrófono
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }, [])

  // Limpia todos los transcripts y errores
  const resetTranscript = useCallback(() => {
    setTranscript('')
    setFinalTranscript('')
    setError(null)
  }, [])

  return {
    isListening,
    transcript,
    finalTranscript,
    error,
    startListening,
    stopListening,
    resetTranscript
  }
}