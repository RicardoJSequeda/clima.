'use client'

import { useEffect } from 'react'
import { useIntroTourContext } from './IntroTourProvider'
import { welcomeTour } from '@/lib/tour-configs'

export function AutoTour() {
  const { startTour } = useIntroTourContext()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Verificar si es la primera visita del usuario
      const hasSeenTour = localStorage.getItem('hasSeenWelcomeTour')
      
      if (!hasSeenTour) {
        // Esperar un poco para que la página se cargue completamente
        const timer = setTimeout(() => {
          startTour(welcomeTour)
          // Marcar que el usuario ya vio el tour
          localStorage.setItem('hasSeenWelcomeTour', 'true')
        }, 2000) // 2 segundos de delay

        return () => clearTimeout(timer)
      }
    }
  }, [startTour])

  return null // Este componente no renderiza nada
}

// Hook para resetear el tour (útil para testing o para permitir que el usuario vea el tour nuevamente)
export function useResetTour() {
  const resetTour = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('hasSeenWelcomeTour')
    }
    window.location.reload()
  }

  return resetTour
}

// Componente para mostrar un botón que permite ver el tour nuevamente
export function ResetTourButton() {
  const resetTour = useResetTour()

  return (
    <button
      onClick={resetTour}
      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
      title="Ver tour de bienvenida nuevamente"
    >
      Ver tour nuevamente
    </button>
  )
}
