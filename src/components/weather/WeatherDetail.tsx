'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Share, Wind, Thermometer, Droplets, Eye, Sun } from 'lucide-react'
import { useWeatherStore } from '@/hooks/useWeather'
import { WEATHER_CODES } from '@/types/weather'
import { formatTemperature, formatWindSpeed, formatWindDirection, formatDate, getWeatherIcon, getTemperatureColor, getWindSpeedColor } from '@/lib/utils'
import { AnimatedWeatherIcon } from '@/components/ui/AnimatedWeatherIcon'
import { motion } from 'framer-motion'

export function WeatherDetail() {
  const { cities, selectedCity } = useWeatherStore()
  
  const city = cities.find(c => c.id === selectedCity)
  
  if (!city) {
    return (
      <Card className="h-[500px] bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900/20 border-slate-200/50 dark:border-slate-700/50">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center text-muted-foreground">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-6xl mb-4"
            >
              🌤️
            </motion.div>
            <p className="text-lg">Selecciona una ciudad para ver los detalles</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!city.weather?.current_weather) {
    return (
      <Card className="h-[500px] bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900/20 border-slate-200/50 dark:border-slate-700/50">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center text-muted-foreground">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-6xl mb-4"
            >
              ⏳
            </motion.div>
            <p className="text-lg">Cargando datos meteorológicos...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { current_weather, daily } = city.weather
  const weatherInfo = WEATHER_CODES[current_weather.weathercode] || WEATHER_CODES[0]
  const timeOfDay = new Date().getHours() >= 18 || new Date().getHours() <= 6 ? 'night' : 'day'

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Clima en ${city.name}`,
          text: `Temperatura: ${Math.round(current_weather.temperature)}°C - ${weatherInfo.description}`,
          url: window.location.href
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      // Fallback: copiar al portapapeles
      navigator.clipboard.writeText(
        `Clima en ${city.name}: ${Math.round(current_weather.temperature)}°C - ${weatherInfo.description}`
      )
    }
  }

  // Función para obtener la condición del clima en español
  const getWeatherCondition = (weathercode: number) => {
    const conditions: { [key: number]: string } = {
      0: 'soleado',
      1: 'parcialmente nublado',
      2: 'parcialmente nublado',
      3: 'nublado',
      45: 'niebla',
      48: 'niebla',
      51: 'lluvia ligera',
      53: 'lluvia ligera',
      55: 'lluvia moderada',
      61: 'lluvia ligera',
      63: 'lluvia moderada',
      65: 'lluvia moderada',
      71: 'nieve',
      73: 'nieve',
      75: 'nieve',
      77: 'nieve',
      80: 'lluvia ligera',
      81: 'lluvia moderada',
      82: 'lluvia moderada',
      85: 'nieve',
      86: 'nieve',
      95: 'tormenta',
      96: 'tormenta',
      99: 'tormenta'
    }
    return conditions[weathercode] || 'soleado'
  }

    return (
      <Card className="h-[600px] bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900/20 border-slate-200/50 dark:border-slate-700/50 flex flex-col" data-tour="current-weather">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              {city.name}
            </CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              {city.display_name}
            </p>
            {city.lastFetched && (
              <div className="flex items-center space-x-2">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="w-2 h-2 bg-green-500 rounded-full"
                />
                <p className="text-sm text-slate-500 dark:text-slate-500">
                  Actualizado: {formatDate(city.lastFetched)}
                </p>
              </div>
            )}
          </div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="h-8 w-8"
            >
              <Share className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col justify-between space-y-3 overflow-hidden">
        {/* Clima actual destacado */}
        <div className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-3 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10">
                <AnimatedWeatherIcon
                  condition={getWeatherCondition(current_weather.weathercode)}
                  size={40}
                  className="w-full h-full"
                  animate={true}
                />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 leading-none">
                  {Math.round(current_weather.temperature)}°C
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  {weatherInfo.description}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-[11px] text-slate-500 dark:text-slate-500">Sensación</div>
              <div className="text-lg font-semibold text-slate-900 dark:text-slate-100 leading-none">
                {current_weather.feels_like ? Math.round(current_weather.feels_like) : Math.round(current_weather.temperature)}°C
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-500">
                {current_weather.feels_like ? 'Datos reales' : 'Estimado'}
              </div>
            </div>
          </div>
        </div>

        {/* Métricas del clima actual */}
        <div className="grid grid-cols-2 gap-2">
          <motion.div 
            className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-2.5 shadow-sm border border-slate-200/50 dark:border-slate-700/50"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ 
                  rotate: [0, 15, -15, 0],
                  x: [0, 3, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2.5, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                <Wind className="h-3.5 w-3.5 text-green-500" />
              </motion.div>
              <div>
                <div className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Viento</div>
                <div className="text-xs font-bold text-green-600 leading-none">
                  {formatWindSpeed(current_weather.windspeed)}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-500">
                  {formatWindDirection(current_weather.winddirection)}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-2.5 shadow-sm border border-slate-200/50 dark:border-slate-700/50"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ 
                  y: [0, -3, 0],
                  opacity: [0.6, 1, 0.6],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                <Droplets className="h-3.5 w-3.5 text-blue-500" />
              </motion.div>
              <div>
                <div className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Humedad</div>
                <div className="text-xs font-bold text-blue-600 leading-none">
                  {current_weather.humidity ? Math.round(current_weather.humidity) : 'N/A'}%
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-500">
                  Relativa
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-2.5 shadow-sm border border-slate-200/50 dark:border-slate-700/50"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                <Eye className="h-3.5 w-3.5 text-purple-500" />
              </motion.div>
              <div>
                <div className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Presión</div>
                <div className="text-xs font-bold text-purple-600 leading-none">
                  {current_weather.pressure ? Math.round(current_weather.pressure) : 'N/A'} hPa
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-500">
                  Atmosférica
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-2.5 shadow-sm border border-slate-200/50 dark:border-slate-700/50"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{ 
                  rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                  opacity: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <Sun className="h-3.5 w-3.5 text-orange-500" />
              </motion.div>
              <div>
                <div className="text-[11px] font-medium text-slate-600 dark:text-slate-400">UV</div>
                <div className="text-xs font-bold text-orange-600 leading-none">
                  {current_weather.uv_index ? Math.round(current_weather.uv_index) : 'N/A'}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-500">
                  Índice
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Visibilidad - solo mostrar si está disponible */}
        {current_weather.visibility && (
          <motion.div 
            className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-2.5 shadow-sm border border-slate-200/50 dark:border-slate-700/50"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                <Eye className="h-3.5 w-3.5 text-indigo-500" />
              </motion.div>
              <div>
                <div className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Visibilidad</div>
                <div className="text-xs font-bold text-indigo-600 leading-none">
                  {Math.round(current_weather.visibility)} km
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-500">
                  Condiciones de conducción
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Pronóstico de hoy */}
        <div>
          <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-2">
            Pronóstico de hoy
          </h4>
          <div className="grid grid-cols-3 gap-2">
            <motion.div 
              className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-2.5 shadow-sm border border-slate-200/50 dark:border-slate-700/50 text-center"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Máx</div>
              <div className="text-base font-bold text-red-500 leading-none">
                {daily ? Math.round(daily.temperature_2m_max[0]) : Math.round(current_weather.temperature + 5)}°C
              </div>
            </motion.div>

            <motion.div 
              className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-2.5 shadow-sm border border-slate-200/50 dark:border-slate-700/50 text-center"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Mín</div>
              <div className="text-base font-bold text-blue-500 leading-none">
                {daily ? Math.round(daily.temperature_2m_min[0]) : Math.round(current_weather.temperature - 5)}°C
              </div>
            </motion.div>

            <motion.div 
              className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-2.5 shadow-sm border border-slate-200/50 dark:border-slate-700/50 text-center"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Lluvia</div>
              <div className="text-base font-bold text-blue-600 leading-none">
                {daily ? (daily.precipitation_sum[0] || 0).toFixed(1) : '0.0'}mm
              </div>
            </motion.div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
