/**
 * Utilidades de Seguridad para la Aplicación Meteorológica
 * Implementa validación, sanitización y protección de datos
 */

// Configuración de seguridad
export const SECURITY_CONFIG = {
  MAX_INPUT_LENGTH: 100,
  MAX_SEARCH_RESULTS: 50,
  CACHE_TTL: 5 * 60 * 1000, // 5 minutos
  RATE_LIMIT_WINDOW: 60 * 1000, // 1 minuto
  RATE_LIMIT_MAX_REQUESTS: 10,
} as const

// Patrones de validación
export const VALIDATION_PATTERNS = {
  // Solo letras, números, espacios, guiones y comas
  CITY_NAME: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-,\.]+$/,
  // Coordenadas válidas
  LATITUDE: /^-?([1-8]?[0-9](\.[0-9]+)?|90(\.0+)?)$/,
  LONGITUDE: /^-?((1[0-7][0-9])|([1-9]?[0-9]))(\.[0-9]+)?$/,
  // IDs alfanuméricos
  ID: /^[a-zA-Z0-9_-]+$/,
} as const

/**
 * Sanitiza y valida entrada de texto
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return ''
  }

  // Limitar longitud
  const trimmed = input.trim().slice(0, SECURITY_CONFIG.MAX_INPUT_LENGTH)
  
  // Escapar caracteres HTML
  return trimmed
    .replace(/[<>]/g, '') // Remover < y >
    .replace(/javascript:/gi, '') // Remover javascript:
    .replace(/on\w+=/gi, '') // Remover event handlers
    .trim()
}

/**
 * Valida nombre de ciudad
 */
export function validateCityName(cityName: string): boolean {
  if (!cityName || typeof cityName !== 'string') {
    return false
  }

  const sanitized = sanitizeInput(cityName)
  return VALIDATION_PATTERNS.CITY_NAME.test(sanitized) && 
         sanitized.length >= 2 && 
         sanitized.length <= SECURITY_CONFIG.MAX_INPUT_LENGTH
}

/**
 * Valida coordenadas geográficas
 */
export function validateCoordinates(lat: number, lon: number): boolean {
  if (typeof lat !== 'number' || typeof lon !== 'number') {
    return false
  }

  return VALIDATION_PATTERNS.LATITUDE.test(lat.toString()) &&
         VALIDATION_PATTERNS.LONGITUDE.test(lon.toString()) &&
         lat >= -90 && lat <= 90 &&
         lon >= -180 && lon <= 180
}

/**
 * Valida ID de ciudad
 */
export function validateCityId(id: string): boolean {
  if (!id || typeof id !== 'string') {
    return false
  }

  return VALIDATION_PATTERNS.ID.test(id) && 
         id.length >= 1 && 
         id.length <= 50
}

/**
 * Sanitiza datos para localStorage
 */
export function sanitizeForStorage(data: any): string {
  try {
    // Remover propiedades sensibles
    const sanitized = JSON.parse(JSON.stringify(data, (key, value) => {
      // Remover propiedades que podrían contener datos sensibles
      if (key === 'apiKey' || key === 'token' || key === 'password') {
        return undefined
      }
      return value
    }))

    return JSON.stringify(sanitized)
  } catch (error) {
    console.warn('Error sanitizing data for storage:', error)
    return '{}'
  }
}

/**
 * Rate limiting simple
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map()

  isAllowed(key: string): boolean {
    const now = Date.now()
    const windowStart = now - SECURITY_CONFIG.RATE_LIMIT_WINDOW
    
    const userRequests = this.requests.get(key) || []
    const recentRequests = userRequests.filter(time => time > windowStart)
    
    if (recentRequests.length >= SECURITY_CONFIG.RATE_LIMIT_MAX_REQUESTS) {
      return false
    }
    
    recentRequests.push(now)
    this.requests.set(key, recentRequests)
    return true
  }

  reset(key: string): void {
    this.requests.delete(key)
  }
}

export const rateLimiter = new RateLimiter()

/**
 * Genera hash simple para datos sensibles
 */
export function simpleHash(input: string): string {
  let hash = 0
  if (input.length === 0) return hash.toString()
  
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convertir a 32-bit integer
  }
  
  return Math.abs(hash).toString(36)
}

/**
 * Valida URL externa
 */
export function validateExternalUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    const allowedDomains = [
      'api.open-meteo.com',
      'api.openweathermap.org',
      'nominatim.openstreetmap.org'
    ]
    
    return allowedDomains.includes(parsedUrl.hostname) &&
           (parsedUrl.protocol === 'https:' || parsedUrl.protocol === 'http:')
  } catch {
    return false
  }
}

/**
 * Sanitiza mensajes de error para no exponer información sensible
 */
export function sanitizeErrorMessage(error: any): string {
  if (!error) return 'Error desconocido'
  
  // Mensajes seguros para diferentes tipos de error
  if (error.message?.includes('API key')) {
    return 'Error de autenticación con el servicio meteorológico'
  }
  
  if (error.message?.includes('network') || error.message?.includes('fetch')) {
    return 'Error de conexión. Verifica tu conexión a internet'
  }
  
  if (error.message?.includes('timeout')) {
    return 'Tiempo de espera agotado. Intenta nuevamente'
  }
  
  // Error genérico para otros casos
  return 'Error interno. Intenta nuevamente más tarde'
}
