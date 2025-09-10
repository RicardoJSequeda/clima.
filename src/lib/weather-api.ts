import { WeatherData, WeatherResponse, CitySuggestion } from '@/types/weather'
import { validateExternalUrl, sanitizeErrorMessage, rateLimiter } from './security'

// Configuración de APIs con validación de seguridad
const OPEN_METEO_BASE = process.env.NEXT_PUBLIC_OPEN_METEO_BASE || 'https://api.open-meteo.com/v1/forecast'
const OPENWEATHER_BASE = process.env.NEXT_PUBLIC_OPENWEATHER_BASE || 'https://api.openweathermap.org/data/2.5'
const NOMINATIM_BASE = process.env.NEXT_PUBLIC_NOMINATIM_BASE || 'https://nominatim.openstreetmap.org'
const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || ''

// Validar URLs de APIs
if (!validateExternalUrl(OPEN_METEO_BASE) || !validateExternalUrl(OPENWEATHER_BASE) || !validateExternalUrl(NOMINATIM_BASE)) {
  throw new Error('URLs de API no válidas')
}

export class WeatherAPI {
  private static cache = new Map<string, { data: any; timestamp: number }>()
  private static CACHE_TTL = 1 * 60 * 1000 // 1 minuto para datos más actualizados

  private static getCachedData(key: string): any | null {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data
    }
    return null
  }

  private static setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  static async fetchWeather(lat: number, lon: number): Promise<WeatherResponse> {
    // Validar coordenadas
    if (!lat || !lon || typeof lat !== 'number' || typeof lon !== 'number') {
      throw new Error('Coordenadas inválidas')
    }

    // Rate limiting
    const rateLimitKey = `weather_${Math.floor(lat * 10)}_${Math.floor(lon * 10)}`
    if (!rateLimiter.isAllowed(rateLimitKey)) {
      throw new Error('Demasiadas solicitudes. Intenta nuevamente en un momento')
    }

    const cacheKey = `weather_${lat}_${lon}`
    const cached = this.getCachedData(cacheKey)
    if (cached) return cached

    try {
      // Usar Open-Meteo como fuente principal (datos completos y gratuitos)
      const openMeteoData = await this.fetchOpenMeteoData(lat, lon)
      const data = this.convertOpenMeteoToStandard(openMeteoData)
      
      this.setCachedData(cacheKey, data)
      return data
    } catch (error) {
      console.warn('Error fetching weather data from Open-Meteo:', sanitizeErrorMessage(error))
      
      // Fallback a OpenWeatherMap si Open-Meteo falla
      try {
        console.log('Trying OpenWeatherMap as fallback...')
        // Obtener clima actual y pronóstico desde OpenWeatherMap
        const [current, daily] = await Promise.all([
          this.fetchOpenWeatherData(lat, lon),
          this.fetchForecast(lat, lon)
        ])
        // Ensamblar en el formato estándar esperado por la app
        const data: any = {
          current_weather: current,
          daily: daily,
          timezone: 'America/Bogota',
          timezone_abbreviation: 'COT',
          utc_offset_seconds: -5 * 3600
        }
        
        this.setCachedData(cacheKey, data)
        return data
      } catch (fallbackError) {
        console.warn('Both APIs failed:', sanitizeErrorMessage(fallbackError))
        throw new Error('No se pudieron obtener los datos meteorológicos de ninguna fuente')
      }
    }
  }

  static async fetchOpenWeatherData(lat: number, lon: number): Promise<any> {
    const cacheKey = `current_${lat}_${lon}`
    const cached = this.getCachedData(cacheKey)
    if (cached) return cached

    try {
      const url = new URL(`${OPENWEATHER_BASE}/weather`)
      url.searchParams.set('lat', lat.toString())
      url.searchParams.set('lon', lon.toString())
      url.searchParams.set('appid', OPENWEATHER_API_KEY)
      url.searchParams.set('units', 'metric')
      url.searchParams.set('lang', 'es')

      const response = await fetch(url.toString())
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      // Convertir formato de OpenWeatherMap a formato compatible
      const currentWeather = {
        temperature: data.main.temp,
        windspeed: data.wind.speed * 3.6, // m/s a km/h
        winddirection: data.wind.deg,
        weathercode: this.getWeatherCode(data.weather[0].id),
        time: new Date(data.dt * 1000).toISOString(),
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        visibility: data.visibility / 1000, // m a km
        uv_index: data.uvi || 0,
        feels_like: data.main.feels_like,
        description: data.weather[0].description,
        icon: data.weather[0].icon
      }

      this.setCachedData(cacheKey, currentWeather)
      return currentWeather
    } catch (error) {
      console.error('Error fetching current weather:', error)
      throw error
    }
  }

  static async fetchOpenMeteoData(lat: number, lon: number): Promise<any> {
    // Validación defensiva para evitar 400 Bad Request
    if (lat === undefined || lon === undefined || lat === null || lon === null) {
      throw new Error('Coordenadas inválidas para Open-Meteo (lat/lon)')
    }
    const cacheKey = `openmeteo_${lat}_${lon}`
    const cached = this.getCachedData(cacheKey)
    if (cached) return cached

    try {
      const url = new URL(OPEN_METEO_BASE)
      url.searchParams.set('latitude', lat.toString())
      url.searchParams.set('longitude', lon.toString())
      url.searchParams.set('current_weather', 'true')
      // Notar: Open-Meteo no admite relativehumidity_2m ni pressure_msl como variables "daily".
      // Se solicitan por hourly. Aquí dejamos solo variables válidas de daily.
      url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,weathercode,uv_index_max,sunrise,sunset,precipitation_probability_max')
      url.searchParams.set('hourly', 'relativehumidity_2m,pressure_msl,uv_index,precipitation_probability,visibility,apparent_temperature,weathercode,temperature_2m,windspeed_10m')
      url.searchParams.set('timezone', 'America/Bogota')
      url.searchParams.set('temperature_unit', 'celsius')
      url.searchParams.set('windspeed_unit', 'kmh')
      url.searchParams.set('precipitation_unit', 'mm')

      const requestUrl = url.toString()
      // Log útil para depuración en consola si ocurre 400
      // console.debug('Open-Meteo URL =>', requestUrl)

      const response = await fetch(requestUrl)
      if (!response.ok) {
        const text = await response.text().catch(() => '')
        throw new Error(`Error ${response.status}: ${response.statusText}${text ? ` - ${text}` : ''}`)
      }

      const data = await response.json()
      this.setCachedData(cacheKey, data)
      return data
    } catch (error) {
      console.error('Error fetching Open-Meteo data:', error)
      throw error
    }
  }

  static async fetchForecast(lat: number, lon: number): Promise<any> {
    const cacheKey = `forecast_${lat}_${lon}`
    const cached = this.getCachedData(cacheKey)
    if (cached) return cached

    try {
      const url = new URL(`${OPENWEATHER_BASE}/forecast`)
      url.searchParams.set('lat', lat.toString())
      url.searchParams.set('lon', lon.toString())
      url.searchParams.set('appid', OPENWEATHER_API_KEY)
      url.searchParams.set('units', 'metric')
      url.searchParams.set('lang', 'es')
      url.searchParams.set('cnt', '40') // 5 días * 8 períodos de 3 horas

      const response = await fetch(url.toString())
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      // Procesar datos de pronóstico para formato diario
      const dailyData = this.processForecastData(data.list)
      
      this.setCachedData(cacheKey, dailyData)
      return dailyData
    } catch (error) {
      console.error('Error fetching forecast:', error)
      throw error
    }
  }

  private static getWeatherCode(openWeatherId: number): number {
    // Mapear códigos de OpenWeatherMap a códigos de Open-Meteo
    const codeMap: { [key: number]: number } = {
      200: 95, 201: 95, 202: 95, 210: 95, 211: 95, 212: 95, 221: 95, 230: 95, 231: 95, 232: 95,
      300: 51, 301: 51, 302: 53, 310: 51, 311: 53, 312: 55, 313: 55, 314: 55, 321: 55,
      500: 61, 501: 63, 502: 65, 503: 65, 504: 65, 511: 75, 520: 80, 521: 81, 522: 82, 531: 82,
      600: 71, 601: 73, 602: 75, 611: 77, 612: 77, 613: 77, 615: 77, 616: 77, 620: 71, 621: 73, 622: 75,
      701: 45, 711: 45, 721: 45, 731: 45, 741: 45, 751: 45, 761: 45, 762: 45, 771: 45, 781: 45,
      800: 0, 801: 1, 802: 2, 803: 3, 804: 3
    }
    return codeMap[openWeatherId] || 0
  }

  private static processForecastData(forecastList: any[]): any {
    const dailyData: any = {
      time: [],
      temperature_2m_max: [],
      temperature_2m_min: [],
      precipitation_sum: [],
      windspeed_10m_max: [],
      weathercode: [],
      humidity: [],
      pressure: [],
      uv_index: [],
      sunrise: [],
      sunset: []
    }

    // Agrupar por días
    const dailyGroups: { [key: string]: any[] } = {}
    
    forecastList.forEach(item => {
      const date = new Date(item.dt * 1000).toISOString().split('T')[0]
      if (!dailyGroups[date]) {
        dailyGroups[date] = []
      }
      dailyGroups[date].push(item)
    })

    // Procesar cada día
    Object.keys(dailyGroups).sort().forEach(date => {
      const dayData = dailyGroups[date]
      
      dailyData.time.push(date)
      dailyData.temperature_2m_max.push(Math.max(...dayData.map(d => d.main.temp_max)))
      dailyData.temperature_2m_min.push(Math.min(...dayData.map(d => d.main.temp_min)))
      dailyData.precipitation_sum.push(dayData.reduce((sum, d) => sum + (d.rain?.['3h'] || 0), 0))
      dailyData.windspeed_10m_max.push(Math.max(...dayData.map(d => d.wind.speed * 3.6)))
      dailyData.weathercode.push(this.getWeatherCode(dayData[0].weather[0].id))
      dailyData.humidity.push(Math.round(dayData.reduce((sum, d) => sum + d.main.humidity, 0) / dayData.length))
      dailyData.pressure.push(Math.round(dayData.reduce((sum, d) => sum + d.main.pressure, 0) / dayData.length))
      dailyData.uv_index.push(dayData[0].uvi || 0)
      
      // Calcular amanecer y atardecer (usar datos del primer elemento del día)
      const firstItem = dayData[0]
      // OpenWeather forecast/3h no siempre incluye sys.sunrise/sunset en cada item.
      // Si no existen, usamos null para evitar RangeError.
      const sr = firstItem?.sys?.sunrise ? new Date(firstItem.sys.sunrise * 1000).toISOString() : null
      const ss = firstItem?.sys?.sunset ? new Date(firstItem.sys.sunset * 1000).toISOString() : null
      dailyData.sunrise.push(sr)
      dailyData.sunset.push(ss)
    })

    return dailyData
  }

  private static combineWeatherData(openWeatherData: any, openMeteoData: any): any {
    // Si no hay datos de ninguna API, lanzar error
    if (!openWeatherData && !openMeteoData) {
      throw new Error('No se pudieron obtener datos de ninguna API')
    }

    // Usar OpenWeatherMap como base si está disponible
    if (openWeatherData) {
      const currentWeather = {
        temperature: openWeatherData.current_weather.temperature,
        windspeed: openWeatherData.current_weather.windspeed,
        winddirection: openWeatherData.current_weather.winddirection,
        weathercode: openWeatherData.current_weather.weathercode,
        time: openWeatherData.current_weather.time,
        humidity: openWeatherData.current_weather.humidity,
        pressure: openWeatherData.current_weather.pressure,
        visibility: openWeatherData.current_weather.visibility,
        uv_index: openWeatherData.current_weather.uv_index,
        feels_like: openWeatherData.current_weather.feels_like,
        description: openWeatherData.current_weather.description,
        icon: openWeatherData.current_weather.icon
      }

      const daily = {
        time: openWeatherData.daily.time,
        temperature_2m_max: openWeatherData.daily.temperature_2m_max,
        temperature_2m_min: openWeatherData.daily.temperature_2m_min,
        precipitation_sum: openWeatherData.daily.precipitation_sum,
        windspeed_10m_max: openWeatherData.daily.windspeed_10m_max,
        weathercode: openWeatherData.daily.weathercode,
        humidity: openWeatherData.daily.humidity,
        pressure: openWeatherData.daily.pressure,
        uv_index: openWeatherData.daily.uv_index,
        sunrise: openWeatherData.daily.sunrise,
        sunset: openWeatherData.daily.sunset
      }

      // Complementar con datos de Open-Meteo si están disponibles
      if (openMeteoData) {
        // Complementar humedad si no está disponible
        if (!currentWeather.humidity && openMeteoData.current_weather) {
          currentWeather.humidity = openMeteoData.current_weather.relativehumidity_2m
        }

        // Complementar presión si no está disponible
        if (!currentWeather.pressure && openMeteoData.current_weather) {
          currentWeather.pressure = openMeteoData.current_weather.pressure_msl
        }

        // Complementar UV si no está disponible
        if (!currentWeather.uv_index && openMeteoData.current_weather) {
          currentWeather.uv_index = openMeteoData.current_weather.uv_index
        }

        // Complementar datos diarios
        if (openMeteoData.daily) {
          if (!daily.humidity && openMeteoData.daily.relativehumidity_2m) {
            daily.humidity = openMeteoData.daily.relativehumidity_2m
          }
          if (!daily.pressure && openMeteoData.daily.pressure_msl) {
            daily.pressure = openMeteoData.daily.pressure_msl
          }
          if (!daily.uv_index && openMeteoData.daily.uv_index_max) {
            daily.uv_index = openMeteoData.daily.uv_index_max
          }
          if (!daily.sunrise && openMeteoData.daily.sunrise) {
            daily.sunrise = openMeteoData.daily.sunrise
          }
          if (!daily.sunset && openMeteoData.daily.sunset) {
            daily.sunset = openMeteoData.daily.sunset
          }
        }
      }

      return {
        current_weather: currentWeather,
        daily: daily
      }
    }

    // Si solo hay datos de Open-Meteo, usarlos
    if (openMeteoData) {
      const currentWeather = {
        temperature: openMeteoData.current_weather.temperature,
        windspeed: openMeteoData.current_weather.windspeed,
        winddirection: openMeteoData.current_weather.winddirection,
        weathercode: openMeteoData.current_weather.weathercode,
        time: openMeteoData.current_weather.time,
        humidity: openMeteoData.current_weather.relativehumidity_2m,
        pressure: openMeteoData.current_weather.pressure_msl,
        visibility: null,
        uv_index: openMeteoData.current_weather.uv_index,
        feels_like: null,
        description: null,
        icon: null
      }

      const daily = {
        time: openMeteoData.daily.time,
        temperature_2m_max: openMeteoData.daily.temperature_2m_max,
        temperature_2m_min: openMeteoData.daily.temperature_2m_min,
        precipitation_sum: openMeteoData.daily.precipitation_sum,
        windspeed_10m_max: openMeteoData.daily.windspeed_10m_max,
        weathercode: openMeteoData.daily.weathercode,
        humidity: openMeteoData.daily.relativehumidity_2m,
        pressure: openMeteoData.daily.pressure_msl,
        uv_index: openMeteoData.daily.uv_index_max,
        sunrise: openMeteoData.daily.sunrise,
        sunset: openMeteoData.daily.sunset
      }

      return {
        current_weather: currentWeather,
        daily: daily
      }
    }

    throw new Error('No se pudieron obtener datos de ninguna API')
  }

  private static hasCompleteData(openMeteoData: any): boolean {
    if (!openMeteoData || !openMeteoData.current_weather || !openMeteoData.daily) {
      return false
    }

    const current = openMeteoData.current_weather
    const daily = openMeteoData.daily

    // Verificar que tenemos los datos esenciales
    return (
      current.temperature !== undefined &&
      current.windspeed !== undefined &&
      current.winddirection !== undefined &&
      current.weathercode !== undefined &&
      daily.temperature_2m_max !== undefined &&
      daily.temperature_2m_min !== undefined &&
      daily.weathercode !== undefined
    )
  }

  private static convertOpenMeteoToStandard(openMeteoData: any): any {
    const current = openMeteoData.current_weather
    const daily = openMeteoData.daily
    const hourly = openMeteoData.hourly

    // Convertir datos actuales
    const currentWeather = {
      temperature: current.temperature,
      windspeed: current.windspeed,
      winddirection: current.winddirection,
      weathercode: current.weathercode,
      time: current.time,
      humidity: hourly?.relativehumidity_2m?.[0] || null,
      pressure: hourly?.pressure_msl?.[0] || null,
      visibility: hourly?.visibility?.[0] || null,
      uv_index: hourly?.uv_index?.[0] || null,
      feels_like: hourly?.apparent_temperature?.[0] || null,
      description: null,
      icon: null
    }

    // Convertir datos diarios
    const dailyData = {
      time: daily.time,
      temperature_2m_max: daily.temperature_2m_max,
      temperature_2m_min: daily.temperature_2m_min,
      precipitation_sum: daily.precipitation_sum,
      windspeed_10m_max: daily.windspeed_10m_max,
      weathercode: daily.weathercode,
      humidity: daily.relativehumidity_2m,
      pressure: daily.pressure_msl,
      uv_index: daily.uv_index_max,
      sunrise: daily.sunrise,
      sunset: daily.sunset
    }

    return {
      current_weather: currentWeather,
      daily: dailyData
    }
  }

  private static convertOpenWeatherToStandard(openWeatherData: any): any {
    const current = openWeatherData.current_weather
    const daily = openWeatherData.daily

    return {
      current_weather: {
        temperature: current.temperature,
        windspeed: current.windspeed,
        winddirection: current.winddirection,
        weathercode: current.weathercode,
        time: current.time,
        humidity: current.humidity,
        pressure: current.pressure,
        visibility: current.visibility,
        uv_index: current.uv_index,
        feels_like: current.feels_like,
        description: current.description,
        icon: current.icon
      },
      daily: {
        time: daily.time,
        temperature_2m_max: daily.temperature_2m_max,
        temperature_2m_min: daily.temperature_2m_min,
        precipitation_sum: daily.precipitation_sum,
        windspeed_10m_max: daily.windspeed_10m_max,
        weathercode: daily.weathercode,
        humidity: daily.humidity,
        pressure: daily.pressure,
        uv_index: daily.uv_index,
        sunrise: daily.sunrise,
        sunset: daily.sunset
      }
    }
  }

  static async searchCities(query: string): Promise<CitySuggestion[]> {
    if (!query.trim()) return []

    const cacheKey = `cities_${query}`
    const cached = this.getCachedData(cacheKey)
    if (cached) return cached

    try {
      const url = new URL(`${NOMINATIM_BASE}/search`)
      url.searchParams.set('format', 'json')
      url.searchParams.set('q', `${query}, Colombia`)
      url.searchParams.set('limit', '6')
      url.searchParams.set('addressdetails', '1')
      url.searchParams.set('countrycodes', 'co')

      const response = await fetch(url.toString(), {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'ClimaColombia/1.0'
        }
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      const suggestions = data.map((item: any) => ({
        display_name: item.display_name,
        lat: item.lat,
        lon: item.lon,
        place_id: item.place_id
      }))

      this.setCachedData(cacheKey, suggestions)
      return suggestions
    } catch (error) {
      console.error('Error searching cities:', error)
      return []
    }
  }

  static async reverseGeocode(lat: number, lon: number): Promise<CitySuggestion | null> {
    try {
      const url = new URL(`${NOMINATIM_BASE}/reverse`)
      url.searchParams.set('format', 'json')
      url.searchParams.set('lat', lat.toString())
      url.searchParams.set('lon', lon.toString())
      url.searchParams.set('addressdetails', '1')

      const response = await fetch(url.toString(), {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'ClimaColombia/1.0'
        }
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return {
        display_name: data.display_name,
        lat: data.lat,
        lon: data.lon,
        place_id: data.place_id
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error)
      return null
    }
  }

  static async fetchNews(): Promise<any[]> {
    // Simulación de noticias - en producción usarías una API real
    return [
      {
        id: '1',
        title: 'Pronóstico meteorológico para Colombia esta semana',
        url: '#',
        source: 'IDEAM',
        publishedAt: new Date().toISOString(),
        description: 'Tendencias climáticas para las principales ciudades del país'
      },
      {
        id: '2',
        title: 'Temporada de lluvias en la región Andina',
        url: '#',
        source: 'El Tiempo',
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        description: 'Precipitaciones intensas esperadas en los próximos días'
      },
      {
        id: '3',
        title: 'Alerta por vientos fuertes en la costa Caribe',
        url: '#',
        source: 'IDEAM',
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        description: 'Vientos de hasta 60 km/h en Barranquilla y Cartagena'
      }
    ]
  }

  static clearCache(): void {
    this.cache.clear()
  }

  // ======================
  // Alertas meteorológicas
  // ======================
  // Estrategia multi-fuente: primero intentamos con OpenWeather (si hay OneCall/alerts),
  // luego con Open-Meteo (derivadas a partir de umbrales), y como fallback generamos
  // alertas locales basadas en las métricas actuales.
  static async fetchAlerts(lat: number, lon: number): Promise<any[]> {
    const alerts: any[] = []

    try {
      // 1) Fuente OpenWeather OneCall Alerts (si la cuenta lo habilita)
      const url = new URL('https://api.openweathermap.org/data/3.0/onecall')
      url.searchParams.set('lat', String(lat))
      url.searchParams.set('lon', String(lon))
      url.searchParams.set('appid', OPENWEATHER_API_KEY)
      url.searchParams.set('units', 'metric')
      url.searchParams.set('lang', 'es')

      const res = await fetch(url.toString())
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data?.alerts)) {
          data.alerts.forEach((a: any, idx: number) => {
            alerts.push({
              id: `ow-${idx}-${a.start || Date.now()}`,
              type: 'storm',
              level: 'high',
              title: a.event || 'Alerta meteorológica',
              message: a.description || 'Alerta emitida por OpenWeather',
              source: 'openweather',
              startsAt: a.start ? new Date(a.start * 1000).toISOString() : undefined,
              endsAt: a.end ? new Date(a.end * 1000).toISOString() : undefined,
            })
          })
        }
      }
    } catch {}

    try {
      // 2) Derivar alertas desde Open-Meteo (umbrales simples)
      const meteo = await this.fetchOpenMeteoData(lat, lon)
      const current = meteo?.current_weather
      const hourly = meteo?.hourly
      if (current) {
        if (current.uv_index && current.uv_index >= 8) {
          alerts.push({
            id: `uv-${Date.now()}`,
            type: 'uv',
            level: 'high',
            title: 'UV muy alto',
            message: 'Protege tu piel, usa bloqueador y evita el sol directo al mediodía.',
            source: 'open-meteo'
          })
        }
        if (current.windspeed && current.windspeed >= 40) {
          alerts.push({
            id: `wind-${Date.now()}`,
            type: 'wind',
            level: 'medium',
            title: 'Vientos fuertes',
            message: 'Se esperan ráfagas importantes. Asegura objetos sueltos.',
            source: 'open-meteo'
          })
        }
        if (current.temperature && current.temperature >= 35) {
          alerts.push({
            id: `heat-${Date.now()}`,
            type: 'heat',
            level: 'high',
            title: 'Ola de calor',
            message: 'Temperaturas muy altas. Hidrátate y evita exposición prolongada.',
            source: 'open-meteo'
          })
        }
      }
      if (hourly?.precipitation_probability?.[0] >= 70) {
        alerts.push({
          id: `rain-${Date.now()}`,
          type: 'rain',
          level: 'medium',
          title: 'Alta probabilidad de lluvia',
          message: 'Lleva paraguas. Podrían presentarse chubascos en las próximas horas.',
          source: 'open-meteo'
        })
      }
      if (hourly?.windspeed_10m?.[0] && hourly.windspeed_10m[0] >= 60) {
        alerts.push({
          id: `wind-high-${Date.now()}`,
          type: 'wind',
          level: 'high',
          title: 'Ráfagas intensas',
          message: 'Rachas de viento muy fuertes. Precaución en carretera.',
          source: 'open-meteo'
        })
      }
      if (hourly?.temperature_2m?.[0] && hourly.temperature_2m[0] <= 5) {
        alerts.push({
          id: `cold-${Date.now()}`,
          type: 'cold',
          level: 'medium',
          title: 'Baja temperatura',
          message: 'Ambiente frío. Abrígate adecuadamente.',
          source: 'open-meteo'
        })
      }
    } catch {}

    // 3) Fallback: si no hay ninguna alerta, generamos una preventiva leve
    if (alerts.length === 0) {
      alerts.push({
        id: `info-${Date.now()}`,
        type: 'heat',
        level: 'low',
        title: 'Sin alertas relevantes',
        message: 'Clima estable. Mantente atento a cambios repentinos.',
        source: 'engine'
      })
    }

    return alerts
  }
}
