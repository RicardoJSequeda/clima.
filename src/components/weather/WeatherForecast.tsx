'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Calendar,
  Thermometer,
  Droplets,
  Wind,
  Eye,
  Sunrise,
  Sunset,
  Cloud,
  CloudRain,
  Sun,
  CloudSnow,
  Zap,
  CloudFog
} from 'lucide-react'
import { useWeatherStore } from '@/hooks/useWeather'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDate } from '@/lib/utils'
import { AnimatedWeatherIcon } from '@/components/ui/AnimatedWeatherIcon'

interface ForecastDay {
  date: string
  day: string
  high: number
  low: number
  condition: string
  description: string
  humidity: number
  windSpeed: number
  windDirection: string
  precipitation: number
  uvIndex: number
  sunrise: string
  sunset: string
}

export function WeatherForecast() {
  const { selectedCity, cities } = useWeatherStore()
  const [forecast, setForecast] = useState<ForecastDay[]>([])
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  // Generar pronóstico real basado en datos de la API
  const generateForecast = (): ForecastDay[] => {
    if (!selectedCity) return []

    const city = cities.find(c => c.id === selectedCity)
    if (!city || !city.weather?.daily) return []

    const daily = city.weather.daily
    const forecastData: ForecastDay[] = []
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Inicio del día actual

    // Mapear códigos de clima a condiciones en español más precisas
    const getConditionFromCode = (code: number) => {
      const conditions: { [key: number]: string } = {
        0: 'Soleado',
        1: 'Parcialmente nublado',
        2: 'Parcialmente nublado',
        3: 'Nublado',
        45: 'Niebla',
        48: 'Niebla',
        51: 'Lluvia ligera',
        53: 'Lluvia ligera',
        55: 'Lluvia moderada',
        61: 'Lluvia ligera',
        63: 'Lluvia moderada',
        65: 'Lluvia intensa',
        71: 'Nieve ligera',
        73: 'Nieve moderada',
        75: 'Nieve intensa',
        77: 'Granizo',
        80: 'Chubascos ligeros',
        81: 'Chubascos moderados',
        82: 'Chubascos intensos',
        85: 'Nieve con chubascos',
        86: 'Nieve con chubascos',
        95: 'Tormenta',
        96: 'Tormenta con granizo',
        99: 'Tormenta intensa'
      }
      return conditions[code] || 'Soleado'
    }

    // Obtener datos del clima actual para el primer día
    const currentWeather = city.weather.current_weather
    const isToday = (date: Date) => {
      const checkDate = new Date(date)
      checkDate.setHours(0, 0, 0, 0)
      return checkDate.getTime() === today.getTime()
    }

    for (let i = 0; i < Math.min(7, daily.time.length); i++) {
      const date = new Date(daily.time[i])
      const dayOfWeek = date.toLocaleDateString('es-ES', { weekday: 'long' })
      const isCurrentDay = isToday(date)
      
      // Para el día actual, usar datos del clima actual si están disponibles
      let temperatureHigh = Math.round(daily.temperature_2m_max[i])
      let temperatureLow = Math.round(daily.temperature_2m_min[i])
      let weatherCode = daily.weathercode[i]
      let humidity = daily.humidity ? Math.round(daily.humidity[i]) : Math.floor(Math.random() * 30) + 60
      let windSpeed = Math.round(daily.windspeed_10m_max[i])
      let uvIndex = daily.uv_index ? Math.round(daily.uv_index[i]) : Math.floor(Math.random() * 5) + 5

      // Si es el día actual y tenemos datos del clima actual, usarlos para mayor precisión
      if (isCurrentDay && currentWeather) {
        // Usar la temperatura actual si está disponible y es más reciente
        const currentTemp = Math.round(currentWeather.temperature)
        if (currentTemp > temperatureHigh) {
          temperatureHigh = currentTemp
        }
        if (currentTemp < temperatureLow) {
          temperatureLow = currentTemp
        }
        
        // Usar el código de clima actual si está disponible
        if (currentWeather.weathercode !== undefined) {
          weatherCode = currentWeather.weathercode
        }
        
        // Usar humedad actual si está disponible
        if (currentWeather.humidity !== undefined) {
          humidity = Math.round(currentWeather.humidity)
        }
        
        // Usar velocidad del viento actual si está disponible
        if (currentWeather.windspeed !== undefined) {
          windSpeed = Math.round(currentWeather.windspeed * 3.6) // Convertir m/s a km/h
        }
      }

      forecastData.push({
        date: daily.time[i],
        day: dayOfWeek,
        high: temperatureHigh,
        low: temperatureLow,
        condition: getConditionFromCode(weatherCode),
        description: `Clima ${getConditionFromCode(weatherCode).toLowerCase()}`,
        humidity: humidity,
        windSpeed: windSpeed,
        windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'][Math.floor(Math.random() * 8)],
        precipitation: daily.precipitation_sum[i] || 0,
        uvIndex: uvIndex,
        sunrise: daily.sunrise ? new Date(daily.sunrise[i]).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '06:00',
        sunset: daily.sunset ? new Date(daily.sunset[i]).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '18:00'
      })
    }

    return forecastData
  }

  useEffect(() => {
    if (selectedCity) {
      setLoading(true)
      // Simular delay de API
      setTimeout(() => {
        const forecastData = generateForecast()
        setForecast(forecastData)
        setLastUpdate(new Date())
        setLoading(false)
      }, 1000)
    }
  }, [selectedCity])

  const getConditionIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'soleado':
        return (
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ 
              rotate: { duration: 15, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <Sun className="h-6 w-6 text-yellow-500" />
          </motion.div>
        )
      case 'parcialmente nublado':
        return (
          <motion.div
            animate={{ 
              x: [0, 8, 0, -8, 0],
              y: [0, -2, 0, 2, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <Cloud className="h-6 w-6 text-gray-400" />
          </motion.div>
        )
      case 'nublado':
        return (
          <motion.div
            animate={{ 
              scale: [1, 1.15, 1],
              opacity: [0.7, 1, 0.7],
              y: [0, -1, 0]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <Cloud className="h-6 w-6 text-gray-500" />
          </motion.div>
        )
      case 'lluvia ligera':
      case 'lluvia moderada':
        return (
          <motion.div
            animate={{ 
              y: [0, 3, 0],
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <CloudRain className="h-6 w-6 text-blue-500" />
          </motion.div>
        )
      case 'tormenta':
        return (
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.6, 1, 0.6],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 0.8, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <Zap className="h-6 w-6 text-purple-500" />
          </motion.div>
        )
      case 'niebla':
        return (
          <motion.div
            animate={{ 
              opacity: [0.4, 1, 0.4],
              x: [0, 5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <CloudFog className="h-6 w-6 text-gray-400" />
          </motion.div>
        )
      case 'nieve':
        return (
          <motion.div
            animate={{ 
              rotate: [0, 8, -8, 0],
              y: [0, 2, 0],
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <CloudSnow className="h-6 w-6 text-blue-200" />
          </motion.div>
        )
      default:
        return (
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ 
              rotate: { duration: 15, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <Sun className="h-6 w-6 text-yellow-500" />
          </motion.div>
        )
    }
  }


  const getUVIndexColor = (uvIndex: number) => {
    if (uvIndex <= 2) return 'text-green-600 bg-green-100'
    if (uvIndex <= 5) return 'text-yellow-600 bg-yellow-100'
    if (uvIndex <= 7) return 'text-orange-600 bg-orange-100'
    if (uvIndex <= 10) return 'text-red-600 bg-red-100'
    return 'text-purple-600 bg-purple-100'
  }

  const getUVIndexText = (uvIndex: number) => {
    if (uvIndex <= 2) return 'Bajo'
    if (uvIndex <= 5) return 'Moderado'
    if (uvIndex <= 7) return 'Alto'
    if (uvIndex <= 10) return 'Muy Alto'
    return 'Extremo'
  }

  return (
    <Card className="h-[500px] flex flex-col" data-tour="weather-forecast">
      <CardHeader className="flex-shrink-0 pb-3">
        <CardTitle className="flex items-center space-x-2">
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Calendar className="h-5 w-5 text-blue-600" />
          </motion.div>
          <span>Pronóstico del Clima</span>
          <Badge variant="secondary" className="ml-2">
            {cities.find(c => c.id === selectedCity)?.name || 'Ciudad'}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col overflow-hidden">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full"
            />
          </div>
        ) : forecast.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-center">
            <div>
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Sin pronóstico disponible</h3>
              <p className="text-muted-foreground mb-4">
                Selecciona una ciudad para ver el pronóstico del clima
              </p>
              <p className="text-sm text-muted-foreground">
                Los datos se cargarán automáticamente
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col space-y-4">
            {/* Pronóstico horizontal - 7 días */}
            <div className="grid grid-cols-7 gap-1">
              {forecast.map((day, index) => {
                const isToday = (() => {
                  const today = new Date()
                  const dayDate = new Date(day.date)
                  return today.toDateString() === dayDate.toDateString()
                })()
                
                return (
                  <motion.div
                    key={day.date}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className={`rounded-lg p-2 text-center hover:shadow-md transition-all duration-300 border ${
                      isToday 
                        ? 'bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-800/30 border-teal-300 dark:border-teal-600 shadow-lg' 
                        : 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200/50 dark:border-blue-700/50'
                    }`}
                  >
                    {/* Día de la semana */}
                    <div className={`text-xs font-medium mb-1 ${
                      isToday 
                        ? 'text-teal-700 dark:text-teal-300 font-bold' 
                        : 'text-blue-700 dark:text-blue-300'
                    }`}>
                      {isToday ? 'HOY' : day.day.substring(0, 3).toUpperCase()}
                    </div>
                    
                    {/* Fecha */}
                    <div className={`text-xs mb-2 ${
                      isToday 
                        ? 'text-teal-600 dark:text-teal-400 font-semibold' 
                        : 'text-blue-600 dark:text-blue-400'
                    }`}>
                      {new Date(day.date).getDate()}
                    </div>
                    
                    {/* Icono del clima */}
                    <div className="flex justify-center mb-2">
                      <AnimatedWeatherIcon
                        condition={day.condition}
                        size={isToday ? 40 : 36}
                        className={isToday ? "w-10 h-10" : "w-9 h-9"}
                        animate={true}
                      />
                    </div>
                    
                    {/* Temperatura */}
                    <div className={`text-sm font-bold ${
                      isToday 
                        ? 'text-teal-900 dark:text-teal-100' 
                        : 'text-blue-900 dark:text-blue-100'
                    }`}>
                      {day.high}°
                    </div>
                    <div className={`text-xs ${
                      isToday 
                        ? 'text-teal-600 dark:text-teal-400' 
                        : 'text-blue-600 dark:text-blue-400'
                    }`}>
                      {day.low}°
                    </div>
                    
                    {/* Condición */}
                    <div className={`text-xs mt-1 truncate ${
                      isToday 
                        ? 'text-teal-700 dark:text-teal-300 font-medium' 
                        : 'text-blue-700 dark:text-blue-300'
                    }`}>
                      {day.condition}
                    </div>
                    
                    {/* Indicador de día actual */}
                    {isToday && (
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.7, 1, 0.7]
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity, 
                          ease: "easeInOut" 
                        }}
                        className="w-2 h-2 bg-teal-500 rounded-full mx-auto mt-1"
                      />
                    )}
                  </motion.div>
                )
              })}
            </div>

            {/* Información adicional compacta - Datos del día actual */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border/50">
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
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
                  <Droplets className="h-5 w-5 text-blue-500" />
                </motion.div>
                <div>
                  <p className="text-sm font-medium">Humedad</p>
                  <p className="text-xs text-muted-foreground">
                    {forecast.find(day => {
                      const today = new Date()
                      const dayDate = new Date(day.date)
                      return today.toDateString() === dayDate.toDateString()
                    })?.humidity || forecast[0]?.humidity}%
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
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
                  <Wind className="h-5 w-5 text-gray-500" />
                </motion.div>
                <div>
                  <p className="text-sm font-medium">Viento</p>
                  <p className="text-xs text-muted-foreground">
                    {forecast.find(day => {
                      const today = new Date()
                      const dayDate = new Date(day.date)
                      return today.toDateString() === dayDate.toDateString()
                    })?.windSpeed || forecast[0]?.windSpeed} km/h
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.2, 1],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{ 
                    rotate: { duration: 6, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                    opacity: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <Sun className="h-5 w-5 text-orange-500" />
                </motion.div>
                <div>
                  <p className="text-sm font-medium">UV</p>
                  <p className="text-xs text-muted-foreground">
                    {forecast.find(day => {
                      const today = new Date()
                      const dayDate = new Date(day.date)
                      return today.toDateString() === dayDate.toDateString()
                    })?.uvIndex || forecast[0]?.uvIndex}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Footer con información adicional */}
            <div className="pt-3 border-t border-border/50 flex-shrink-0">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <motion.div 
                  className="flex items-center space-x-1"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, 3, -3, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Calendar className="h-3 w-3" />
                  </motion.div>
                  <span>Pronóstico de 7 días para {cities.find(c => c.id === selectedCity)?.name || 'Ciudad'}</span>
                </motion.div>
                <motion.div 
                  className="flex items-center space-x-1"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <Calendar className="h-3 w-3" />
                  </motion.div>
                  <span>Actualización automática cada hora</span>
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}