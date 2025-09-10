'use client'

import ReactAnimatedWeather from 'react-animated-weather'
import { motion } from 'framer-motion'

interface AnimatedWeatherIconProps {
  condition: string
  size?: number
  className?: string
  animate?: boolean
}

export function AnimatedWeatherIcon({ 
  condition, 
  size = 24, 
  className = '',
  animate = true 
}: AnimatedWeatherIconProps) {
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'soleado':
        return 'CLEAR_DAY'
      case 'parcialmente nublado':
        return 'PARTLY_CLOUDY_DAY'
      case 'nublado':
        return 'CLOUDY'
      case 'lluvia ligera':
        return 'RAIN'
      case 'lluvia moderada':
        return 'RAIN'
      case 'tormenta':
        // La librería no tiene THUNDERSTORM, usamos RAIN como aproximación
        return 'RAIN'
      case 'niebla':
        return 'FOG'
      case 'nieve':
        return 'SNOW'
      case 'viento':
        return 'WIND'
      case 'tornado':
        // No soportado; aproximamos con WIND
        return 'WIND'
      case 'huracán':
        // No soportado; aproximamos con WIND
        return 'WIND'
      default:
        return 'CLEAR_DAY'
    }
  }

  const getWeatherColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'soleado':
        return '#FFA726'
      case 'parcialmente nublado':
        return '#90CAF9'
      case 'nublado':
        return '#9E9E9E'
      case 'lluvia ligera':
      case 'lluvia moderada':
        return '#42A5F5'
      case 'tormenta':
        return '#7E57C2'
      case 'niebla':
        return '#BDBDBD'
      case 'nieve':
        return '#E1F5FE'
      case 'viento':
        return '#81C784'
      case 'tornado':
        return '#E57373'
      case 'huracán':
        return '#F44336'
      default:
        return '#FFA726'
    }
  }

  // Validar contra el set permitido para evitar warnings de PropTypes
  const validIcons = [
    'CLEAR_DAY', 'CLEAR_NIGHT', 'PARTLY_CLOUDY_DAY', 'PARTLY_CLOUDY_NIGHT',
    'CLOUDY', 'RAIN', 'SLEET', 'SNOW', 'WIND', 'FOG'
  ] as const

  let resolvedIcon = getWeatherIcon(condition)
  if (!validIcons.includes(resolvedIcon as any)) {
    // Fallback adicional de seguridad
    resolvedIcon = 'CLEAR_DAY'
  }

  return (
    <motion.div
      className={className}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: [1, 1.05, 1],
        opacity: 1
      }}
      transition={{ 
        scale: { 
          duration: 2, 
          repeat: Infinity, 
          ease: "easeInOut" 
        },
        opacity: { duration: 0.3, ease: "easeOut" }
      }}
      whileHover={{ 
        scale: 1.15,
        rotate: [0, 5, -5, 0]
      }}
    >
      <ReactAnimatedWeather
        icon={resolvedIcon as any}
        color={getWeatherColor(condition)}
        size={size}
        animate={animate}
      />
    </motion.div>
  )
}
