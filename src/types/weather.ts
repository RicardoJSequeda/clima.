export interface WeatherData {
  id: string
  name: string
  display_name: string
  lat: number
  lon: number
  lastFetched: string | null
  weather: WeatherResponse | null
}

export interface WeatherResponse {
  current_weather: CurrentWeather
  daily: DailyWeather
  timezone: string
  timezone_abbreviation: string
  utc_offset_seconds: number
}

export interface CurrentWeather {
  temperature: number
  windspeed: number
  winddirection: number
  weathercode: number
  time: string
  humidity?: number
  pressure?: number
  visibility?: number
  uv_index?: number
  feels_like?: number
  description?: string
  icon?: string
}

export interface DailyWeather {
  time: string[]
  temperature_2m_max: number[]
  temperature_2m_min: number[]
  precipitation_sum: number[]
  windspeed_10m_max: number[]
  weathercode: number[]
  humidity?: number[]
  pressure?: number[]
  uv_index?: number[]
  sunrise?: string[]
  sunset?: string[]
}


// Alertas meteorológicas generadas/consumidas por la app
export interface WeatherAlert {
  id: string
  type: 'heat' | 'rain' | 'wind' | 'storm' | 'uv' | 'fog' | 'cold'
  level: 'low' | 'medium' | 'high' | 'critical'
  title: string
  message: string
  source: 'engine' | 'open-meteo' | 'openweather' | 'ideam'
  startsAt?: string
  endsAt?: string
}


export interface NewsItem {
  id: string
  title: string
  url: string
  source: string
  publishedAt: string
  description?: string
  category?: 'rain' | 'wind' | 'flood' | 'storm' | 'damage' | 'alert' | 'general'
  severity?: 'low' | 'medium' | 'high' | 'critical'
  location?: string
  department?: string
  imageUrl?: string
  tags?: string[]
}

export interface CitySuggestion {
  display_name: string
  lat: string
  lon: string
  place_id: string
}

export interface WeatherState {
  cities: WeatherData[]
  selectedCity: string | null
  news: NewsItem[]
  isLoading: boolean
  error: string | null
}

export interface WeatherActions {
  addCity: (city: Omit<WeatherData, 'id' | 'weather' | 'lastFetched'>) => Promise<void>
  removeCity: (id: string) => void
  selectCity: (id: string) => void
  updateCity: (id: string) => Promise<void>
  updateAllCities: () => Promise<void>
  startAutoUpdate: () => () => void
  clearCities: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setNews: (news: NewsItem[]) => void
  loadWeatherNews: () => Promise<NewsItem[]>
  loadNewsByCategory: (category: string) => Promise<NewsItem[]>
  loadNewsByDepartment: (department: string) => Promise<NewsItem[]>
}

export type WeatherStore = WeatherState & WeatherActions

// Códigos de clima de OpenWeatherMap
export const WEATHER_CODES: Record<number, { description: string; icon: string }> = {
  0: { description: 'Despejado', icon: '☀️' },
  1: { description: 'Principalmente despejado', icon: '🌤️' },
  2: { description: 'Parcialmente nublado', icon: '⛅' },
  3: { description: 'Nublado', icon: '☁️' },
  45: { description: 'Niebla', icon: '🌫️' },
  48: { description: 'Niebla con escarcha', icon: '🌫️' },
  51: { description: 'Llovizna ligera', icon: '🌦️' },
  53: { description: 'Llovizna moderada', icon: '🌦️' },
  55: { description: 'Llovizna intensa', icon: '🌧️' },
  61: { description: 'Lluvia ligera', icon: '🌦️' },
  63: { description: 'Lluvia moderada', icon: '🌧️' },
  65: { description: 'Lluvia intensa', icon: '🌧️' },
  71: { description: 'Nieve ligera', icon: '🌨️' },
  73: { description: 'Nieve moderada', icon: '🌨️' },
  75: { description: 'Nieve intensa', icon: '❄️' },
  80: { description: 'Chubascos ligeros', icon: '🌦️' },
  81: { description: 'Chubascos', icon: '🌧️' },
  82: { description: 'Chubascos fuertes', icon: '⛈️' },
  95: { description: 'Tormenta', icon: '⛈️' },
  96: { description: 'Tormenta con granizo', icon: '⛈️' },
  99: { description: 'Tormenta severa', icon: '⛈️' },
}

// Ciudades principales de Colombia
export const COLOMBIA_CITIES = [
  { name: 'Bogotá', lat: 4.6097, lon: -74.0817, department: 'Cundinamarca' },
  { name: 'Medellín', lat: 6.2442, lon: -75.5812, department: 'Antioquia' },
  { name: 'Cali', lat: 3.4516, lon: -76.5320, department: 'Valle del Cauca' },
  { name: 'Barranquilla', lat: 10.9685, lon: -74.7813, department: 'Atlántico' },
  { name: 'Cartagena', lat: 10.3910, lon: -75.4794, department: 'Bolívar' },
  { name: 'Bucaramanga', lat: 7.1193, lon: -73.1227, department: 'Santander' },
  { name: 'Pereira', lat: 4.8133, lon: -75.6961, department: 'Risaralda' },
  { name: 'Santa Marta', lat: 11.2408, lon: -74.2110, department: 'Magdalena' },
  { name: 'Ibagué', lat: 4.4372, lon: -75.2006, department: 'Tolima' },
  { name: 'Manizales', lat: 5.0689, lon: -75.5174, department: 'Caldas' },
]
