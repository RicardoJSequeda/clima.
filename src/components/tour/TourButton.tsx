'use client'

import { Button } from '@/components/ui/button'
import { Play, HelpCircle, MapPin, Bell, Zap } from 'lucide-react'
import { useIntroTourContext } from './IntroTourProvider'
import { welcomeTour, advancedFeaturesTour, alertsTour } from '@/lib/tour-configs'

interface TourButtonProps {
  variant?: 'default' | 'welcome' | 'advanced' | 'alerts' | 'help'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children?: React.ReactNode
}

export function TourButton({ 
  variant = 'default', 
  size = 'md', 
  className = '',
  children 
}: TourButtonProps) {
  const { startTour } = useIntroTourContext()

  const getTourConfig = () => {
    switch (variant) {
      case 'welcome':
        return welcomeTour
      case 'advanced':
        return advancedFeaturesTour
      case 'alerts':
        return alertsTour
      default:
        return welcomeTour
    }
  }

  const getButtonContent = () => {
    if (children) return children

    switch (variant) {
      case 'welcome':
        return (
          <>
            <Play className="h-4 w-4 mr-2" />
            Tour de Bienvenida
          </>
        )
      case 'advanced':
        return (
          <>
            <Zap className="h-4 w-4 mr-2" />
            Funciones Avanzadas
          </>
        )
      case 'alerts':
        return (
          <>
            <Bell className="h-4 w-4 mr-2" />
            Sistema de Alertas
          </>
        )
      case 'help':
        return (
          <>
            <HelpCircle className="h-4 w-4 mr-2" />
            Ayuda
          </>
        )
      default:
        return (
          <>
            <Play className="h-4 w-4 mr-2" />
            Iniciar Tour
          </>
        )
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-8 px-3 text-xs'
      case 'lg':
        return 'h-12 px-6 text-base'
      default:
        return 'h-10 px-4 text-sm'
    }
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'welcome':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl'
      case 'advanced':
        return 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl'
      case 'alerts':
        return 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0 shadow-lg hover:shadow-xl'
      case 'help':
        return 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 shadow-lg hover:shadow-xl'
      default:
        return 'bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white border-0 shadow-lg hover:shadow-xl'
    }
  }

  const handleStartTour = () => {
    const config = getTourConfig()
    startTour(config)
  }

  return (
    <Button
      onClick={handleStartTour}
      className={`${getSizeClasses()} ${getVariantClasses()} ${className} transition-all duration-200 hover:scale-105 active:scale-95`}
      variant="default"
    >
      {getButtonContent()}
    </Button>
  )
}

// Componente específico para el botón de bienvenida en el header
export function WelcomeTourButton() {
  return (
    <TourButton 
      variant="welcome" 
      size="sm"
      className="hidden sm:flex"
    />
  )
}

// Componente para mostrar múltiples opciones de tour
export function TourMenu() {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <TourButton variant="welcome" size="sm" />
      <TourButton variant="advanced" size="sm" />
      <TourButton variant="alerts" size="sm" />
    </div>
  )
}
