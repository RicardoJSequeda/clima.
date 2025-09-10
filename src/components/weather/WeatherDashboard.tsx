'use client'

import { useEffect } from 'react'
import { WeatherMap } from './WeatherMap'
import { WeatherDetail } from './WeatherDetail'
import { WeatherForecast } from './WeatherForecast'
import { WeatherNews } from './WeatherNews'
import { useWeatherStore } from '@/hooks/useWeather'
import { WeatherAPI } from '@/lib/weather-api'

export function WeatherDashboard() {
  const { cities, selectedCity, loadWeatherNews, startAutoUpdate } = useWeatherStore()

  // Cargar noticias al montar el componente
  useEffect(() => {
    const loadNews = async () => {
      try {
        await loadWeatherNews()
      } catch (error) {
        console.error('Error loading news:', error)
      }
    }

    loadNews()
  }, [loadWeatherNews])

  // Iniciar actualización automática en tiempo real
  useEffect(() => {
    if (cities.length > 0) {
      const cleanup = startAutoUpdate()
      return cleanup
    }
  }, [cities.length, startAutoUpdate])

  if (cities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-muted-foreground mb-2">
            Bienvenido a Clima Colombia
          </h2>
          <p className="text-muted-foreground mb-6">
            Agrega una ciudad para comenzar a ver el pronóstico meteorológico
          </p>
          <div className="text-6xl">🌤️</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Primera fila: Mapa y detalles del clima */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {/* Mapa - Ocupa 3 columnas en pantallas extra grandes */}
        <div className="xl:col-span-3">
          <WeatherMap />
        </div>

        {/* Panel de detalles - 1 columna */}
        <div className="xl:col-span-1">
          <WeatherDetail />
        </div>
      </div>

      {/* Segunda fila: Pronóstico del clima y noticias lado a lado */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Pronóstico del clima */}
        <div>
          <WeatherForecast />
        </div>

        {/* Noticias del clima */}
        <div>
          <WeatherNews />
        </div>
      </div>
    </div>
  )
}
