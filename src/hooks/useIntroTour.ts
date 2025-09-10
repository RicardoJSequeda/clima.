'use client'

import { useEffect, useRef } from 'react'

export interface TourStep {
  element: string
  intro: string
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto'
  tooltipClass?: string
  highlightClass?: string
  hidePrev?: boolean
  hideNext?: boolean
  showStepNumbers?: boolean
  showBullets?: boolean
  showProgress?: boolean
  scrollToElement?: boolean
  disableInteraction?: boolean
}

export interface TourConfig {
  steps: TourStep[]
  showProgress?: boolean
  showBullets?: boolean
  showStepNumbers?: boolean
  nextLabel?: string
  prevLabel?: string
  skipLabel?: string
  doneLabel?: string
  hidePrev?: boolean
  hideNext?: boolean
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right' | 'auto'
  tooltipClass?: string
  highlightClass?: string
  exitOnEsc?: boolean
  exitOnOverlayClick?: boolean
  keyboardNavigation?: boolean
  scrollToElement?: boolean
  scrollPadding?: number
  hintPosition?: 'top' | 'bottom' | 'left' | 'right' | 'middle-left' | 'middle-right' | 'middle-top' | 'middle-bottom'
  hintButtonLabel?: string
  hintAnimation?: boolean
  buttonClass?: string
  prevButtonClass?: string
  nextButtonClass?: string
  skipButtonClass?: string
  doneButtonClass?: string
  hideTooltip?: boolean
  tooltipTarget?: string
  positionPrecedence?: string[]
  disableInteraction?: boolean
}

export function useIntroTour() {
  const introInstance = useRef<any>(null)

  useEffect(() => {
    // Solo inicializar Intro.js en el cliente
    if (typeof window !== 'undefined') {
      // Importación dinámica de intro.js
      import('intro.js').then((introJs) => {
        // Inicializar Intro.js
        introInstance.current = introJs.default()
        
        // Configuración por defecto
        introInstance.current.setOptions({
          showProgress: true,
          showBullets: true,
          showStepNumbers: true,
          nextLabel: 'Siguiente',
          prevLabel: 'Anterior',
          skipLabel: 'Saltar',
          doneLabel: 'Finalizar',
          tooltipPosition: 'auto',
          exitOnEsc: true,
          exitOnOverlayClick: false,
          keyboardNavigation: true,
          scrollToElement: true,
          scrollPadding: 20,
          disableInteraction: false,
          buttonClass: 'introjs-button',
          prevButtonClass: 'introjs-prevbutton',
          nextButtonClass: 'introjs-nextbutton',
          skipButtonClass: 'introjs-skipbutton',
          doneButtonClass: 'introjs-donebutton',
          tooltipClass: 'introjs-tooltip',
          highlightClass: 'introjs-helperLayer',
          hideTooltip: false,
          positionPrecedence: ['bottom', 'top', 'right', 'left']
        })
      }).catch((error) => {
        console.warn('Error loading intro.js:', error)
      })
    }

    return () => {
      if (introInstance.current) {
        introInstance.current.exit()
      }
    }
  }, [])

  const startTour = (config?: TourConfig) => {
    if (!introInstance.current) return

    if (config) {
      introInstance.current.setOptions(config)
    }

    introInstance.current.start()
  }

  const exitTour = () => {
    if (introInstance.current) {
      introInstance.current.exit()
    }
  }

  const goToStep = (step: number) => {
    if (introInstance.current) {
      introInstance.current.goToStep(step)
    }
  }

  const nextStep = () => {
    if (introInstance.current) {
      introInstance.current.nextStep()
    }
  }

  const previousStep = () => {
    if (introInstance.current) {
      introInstance.current.previousStep()
    }
  }

  const refresh = () => {
    if (introInstance.current) {
      introInstance.current.refresh()
    }
  }

  const addHints = (hints: any[]) => {
    if (introInstance.current && introInstance.current.addHints) {
      introInstance.current.addHints(hints)
    }
  }

  const showHints = () => {
    if (introInstance.current && introInstance.current.showHints) {
      introInstance.current.showHints()
    }
  }

  const hideHints = () => {
    if (introInstance.current && introInstance.current.hideHints) {
      introInstance.current.hideHints()
    }
  }

  const onComplete = (callback: () => void) => {
    if (introInstance.current) {
      introInstance.current.oncomplete(callback)
    }
  }

  const onExit = (callback: () => void) => {
    if (introInstance.current) {
      introInstance.current.onexit(callback)
    }
  }

  const onChange = (callback: (targetElement: Element) => void) => {
    if (introInstance.current) {
      introInstance.current.onchange(callback)
    }
  }

  const onBeforeChange = (callback: (targetElement: Element) => void) => {
    if (introInstance.current) {
      introInstance.current.onbeforechange(callback)
    }
  }

  const onAfterChange = (callback: (targetElement: Element) => void) => {
    if (introInstance.current) {
      introInstance.current.onafterchange(callback)
    }
  }

  return {
    startTour,
    exitTour,
    goToStep,
    nextStep,
    previousStep,
    refresh,
    addHints,
    showHints,
    hideHints,
    onComplete,
    onExit,
    onChange,
    onBeforeChange,
    onAfterChange,
    introInstance: introInstance.current
  }
}
