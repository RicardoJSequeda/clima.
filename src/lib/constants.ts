// Constantes de la aplicación
export const APP_CONFIG = {
  name: 'Clima Colombia',
  description: 'Pronóstico meteorológico profesional para Colombia',
  version: '1.0.0',
  author: 'Clima Colombia Team',
  timezone: 'America/Bogota',
  refreshInterval: 5 * 60 * 1000, // 5 minutos
  cacheTTL: 2 * 60 * 1000, // 2 minutos
  maxCities: 10,
  defaultCities: [
    { name: 'Bogotá', lat: 4.6097, lon: -74.0817 },
    { name: 'Medellín', lat: 6.2442, lon: -75.5812 },
    { name: 'Cali', lat: 3.4516, lon: -76.5320 }
  ]
}

export const WEATHER_THRESHOLDS = {
  highWind: 60, // km/h
  heavyPrecipitation: 20, // mm
  highTemperature: 35, // °C
  lowTemperature: 0, // °C
  stormWind: 80 // km/h
}

export const API_ENDPOINTS = {
  openMeteo: 'https://api.open-meteo.com/v1/forecast',
  nominatim: 'https://nominatim.openstreetmap.org',
  news: 'https://newsapi.org/v2/everything' // Requiere API key
}

export const STORAGE_KEYS = {
  weatherData: 'weather-storage',
  userPreferences: 'user-preferences',
  cache: 'weather-cache'
}
