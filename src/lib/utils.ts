import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTemperature(temp: number): string {
  return `${Math.round(temp)}°C`
}

export function formatWindSpeed(speed: number): string {
  return `${Math.round(speed)} km/h`
}

export function formatWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO']
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('es-CO', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function formatDateShort(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('es-CO', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  })
}

export function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours()
  if (hour >= 6 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 18) return 'afternoon'
  if (hour >= 18 && hour < 22) return 'evening'
  return 'night'
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function getWeatherIcon(weatherCode: number, timeOfDay: string = 'day'): string {
  const icons: Record<number, { day: string; night: string }> = {
    0: { day: '☀️', night: '🌙' },
    1: { day: '🌤️', night: '🌙' },
    2: { day: '⛅', night: '☁️' },
    3: { day: '☁️', night: '☁️' },
    45: { day: '🌫️', night: '🌫️' },
    48: { day: '🌫️', night: '🌫️' },
    51: { day: '🌦️', night: '🌧️' },
    53: { day: '🌦️', night: '🌧️' },
    55: { day: '🌧️', night: '🌧️' },
    61: { day: '🌦️', night: '🌧️' },
    63: { day: '🌧️', night: '🌧️' },
    65: { day: '🌧️', night: '🌧️' },
    71: { day: '🌨️', night: '🌨️' },
    73: { day: '🌨️', night: '🌨️' },
    75: { day: '❄️', night: '❄️' },
    80: { day: '🌦️', night: '🌧️' },
    81: { day: '🌧️', night: '🌧️' },
    82: { day: '⛈️', night: '⛈️' },
    95: { day: '⛈️', night: '⛈️' },
    96: { day: '⛈️', night: '⛈️' },
    99: { day: '⛈️', night: '⛈️' },
  }
  
  const iconSet = icons[weatherCode] || icons[0]
  return timeOfDay === 'night' ? iconSet.night : iconSet.day
}

export function getTemperatureColor(temp: number): string {
  if (temp < 0) return 'text-blue-600'
  if (temp < 10) return 'text-blue-500'
  if (temp < 20) return 'text-green-500'
  if (temp < 30) return 'text-yellow-500'
  if (temp < 35) return 'text-orange-500'
  return 'text-red-500'
}

export function getWindSpeedColor(speed: number): string {
  if (speed < 20) return 'text-green-500'
  if (speed < 40) return 'text-yellow-500'
  if (speed < 60) return 'text-orange-500'
  return 'text-red-500'
}
