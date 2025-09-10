'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useIntroTour, TourConfig } from '@/hooks/useIntroTour'

interface IntroTourContextType {
  startTour: (config?: TourConfig) => void
  exitTour: () => void
  goToStep: (step: number) => void
  nextStep: () => void
  previousStep: () => void
  refresh: () => void
  addHints: (hints: any[]) => void
  showHints: () => void
  hideHints: () => void
  onComplete: (callback: () => void) => void
  onExit: (callback: () => void) => void
  onChange: (callback: (targetElement: Element) => void) => void
  onBeforeChange: (callback: (targetElement: Element) => void) => void
  onAfterChange: (callback: (targetElement: Element) => void) => void
}

const IntroTourContext = createContext<IntroTourContextType | undefined>(undefined)

export function IntroTourProvider({ children }: { children: ReactNode }) {
  const tour = useIntroTour()

  return (
    <IntroTourContext.Provider value={tour}>
      {children}
    </IntroTourContext.Provider>
  )
}

export function useIntroTourContext() {
  const context = useContext(IntroTourContext)
  if (context === undefined) {
    throw new Error('useIntroTourContext must be used within an IntroTourProvider')
  }
  return context
}
