/**
 * Almacenamiento Seguro para la Aplicación Meteorológica
 * Implementa encriptación básica y validación para localStorage
 */

import { sanitizeForStorage } from './security'

// Clave simple para encriptación básica (en producción usar una clave más segura)
const STORAGE_KEY = 'weather_app_secure'

/**
 * Encriptación básica usando btoa/atob (solo para datos no críticos)
 */
function simpleEncrypt(data: string): string {
  try {
    return btoa(encodeURIComponent(data))
  } catch {
    return data
  }
}

function simpleDecrypt(encryptedData: string): string {
  try {
    return decodeURIComponent(atob(encryptedData))
  } catch {
    return encryptedData
  }
}

/**
 * Almacenamiento seguro con validación
 */
export class SecureStorage {
  private static isAvailable(): boolean {
    if (typeof window === 'undefined') return false
    try {
      const test = '__storage_test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  }

  /**
   * Guardar datos de forma segura
   */
  static setItem(key: string, data: any): boolean {
    if (!this.isAvailable()) {
      console.warn('localStorage no disponible')
      return false
    }

    try {
      const sanitizedData = sanitizeForStorage(data)
      const encryptedData = simpleEncrypt(sanitizedData)
      localStorage.setItem(`${STORAGE_KEY}_${key}`, encryptedData)
      return true
    } catch (error) {
      console.warn('Error guardando datos:', error)
      return false
    }
  }

  /**
   * Recuperar datos de forma segura
   */
  static getItem<T>(key: string, defaultValue: T): T {
    if (!this.isAvailable()) {
      return defaultValue
    }

    try {
      const encryptedData = localStorage.getItem(`${STORAGE_KEY}_${key}`)
      if (!encryptedData) {
        return defaultValue
      }

      const decryptedData = simpleDecrypt(encryptedData)
      return JSON.parse(decryptedData)
    } catch (error) {
      console.warn('Error recuperando datos:', error)
      return defaultValue
    }
  }

  /**
   * Eliminar datos
   */
  static removeItem(key: string): boolean {
    if (!this.isAvailable()) {
      return false
    }

    try {
      localStorage.removeItem(`${STORAGE_KEY}_${key}`)
      return true
    } catch (error) {
      console.warn('Error eliminando datos:', error)
      return false
    }
  }

  /**
   * Limpiar todos los datos de la aplicación
   */
  static clear(): boolean {
    if (!this.isAvailable()) {
      return false
    }

    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith(STORAGE_KEY)) {
          localStorage.removeItem(key)
        }
      })
      return true
    } catch (error) {
      console.warn('Error limpiando datos:', error)
      return false
    }
  }

  /**
   * Obtener tamaño de almacenamiento usado
   */
  static getStorageSize(): number {
    if (!this.isAvailable()) {
      return 0
    }

    try {
      const keys = Object.keys(localStorage)
      let size = 0
      
      keys.forEach(key => {
        if (key.startsWith(STORAGE_KEY)) {
          const value = localStorage.getItem(key)
          if (value) {
            size += key.length + value.length
          }
        }
      })
      
      return size
    } catch {
      return 0
    }
  }
}

/**
 * Utilidades específicas para la aplicación meteorológica
 */
export const WeatherStorage = {
  // Historial de búsquedas
  searchHistory: {
    get: () => SecureStorage.getItem('search_history', []),
    set: (data: any[]) => SecureStorage.setItem('search_history', data),
    clear: () => SecureStorage.removeItem('search_history')
  },

  // Preferencias de usuario
  userPreferences: {
    get: () => SecureStorage.getItem('user_preferences', {}),
    set: (data: any) => SecureStorage.setItem('user_preferences', data),
    clear: () => SecureStorage.removeItem('user_preferences')
  },

  // Datos de clima en caché
  weatherCache: {
    get: () => SecureStorage.getItem('weather_cache', {}),
    set: (data: any) => SecureStorage.setItem('weather_cache', data),
    clear: () => SecureStorage.removeItem('weather_cache')
  },

  // Configuración de la aplicación
  appConfig: {
    get: () => SecureStorage.getItem('app_config', {}),
    set: (data: any) => SecureStorage.setItem('app_config', data),
    clear: () => SecureStorage.removeItem('app_config')
  }
}
