'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useWeatherStore } from '@/hooks/useWeather'
import dynamic from 'next/dynamic'

// Componente de mapa que se carga dinámicamente sin SSR
const DynamicMap = dynamic(() => import('@/components/weather/MapComponent'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[400px] bg-muted/20 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
        <p className="text-sm text-muted-foreground">Cargando mapa...</p>
      </div>
    </div>
  )
})

export function WeatherMap() {
  const { cities, selectedCity } = useWeatherStore()

  return (
    <Card className="h-[600px] overflow-hidden" data-tour="weather-map">
      <CardContent className="p-0 h-full relative z-0">
        <DynamicMap />
      </CardContent>
    </Card>
  )
}

