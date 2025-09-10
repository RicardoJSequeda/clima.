'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Search, MapPin, Plus, X, Clock, Star, MapPinIcon, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useWeatherStore } from '@/hooks/useWeather'
import { WeatherAPI } from '@/lib/weather-api'
import { generateId } from '@/lib/utils'
import { CitySuggestion } from '@/types/weather'
import { COLOMBIA_CITIES } from '@/types/weather'
import { 
  sanitizeInput, 
  validateCityName, 
  sanitizeForStorage,
  rateLimiter 
} from '@/lib/security'

interface SearchHistory {
  id: string
  query: string
  timestamp: number
  result?: CitySuggestion
}

export function CitySearch() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([])
  const [recentSearches, setRecentSearches] = useState<SearchHistory[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const locationWatchId = useRef<number | null>(null)
  
  const { addCity, cities } = useWeatherStore()

  // Cargar historial de búsquedas al montar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedHistory = localStorage.getItem('search-history')
      if (savedHistory) {
        try {
          const history = JSON.parse(savedHistory)
          setSearchHistory(history)
          setRecentSearches(history.slice(0, 5))
        } catch (error) {
          console.error('Error loading search history:', error)
        }
      }
    }
  }, [])

  // Función de búsqueda mejorada sin debouncing problemático
  const searchCities = useCallback(async (searchQuery: string) => {
    // Sanitizar y validar entrada
    const sanitizedQuery = sanitizeInput(searchQuery)
    if (!sanitizedQuery.trim() || !validateCityName(sanitizedQuery)) {
      setSuggestions([])
      setIsOpen(false)
      setHasSearched(false)
      return
    }

    // Rate limiting
    if (!rateLimiter.isAllowed('search')) {
      console.warn('Rate limit exceeded for search')
      return
    }

    // Mostrar panel inmediatamente si hay query
    if (!isOpen) {
      setIsOpen(true)
    }

    // Limpiar timeout anterior
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Mostrar loading después de un pequeño delay
    searchTimeoutRef.current = setTimeout(async () => {
      setIsLoading(true)
      try {
        let results: CitySuggestion[] = []

        // Búsqueda en ciudades principales de Colombia primero
        const localResults = COLOMBIA_CITIES
          .filter(city => 
            city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            city.department.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map(city => ({
            display_name: `${city.name}, ${city.department}, Colombia`,
            lat: city.lat.toString(),
            lon: city.lon.toString(),
            place_id: `local_${city.name.toLowerCase().replace(/\s+/g, '_')}`
          }))

        // Búsqueda en API externa solo si hay menos de 3 resultados locales
        if (localResults.length < 3) {
          try {
            const apiResults = await WeatherAPI.searchCities(searchQuery)
            results = [...localResults, ...apiResults.filter(api => 
              !localResults.some(local => local.place_id === api.place_id)
            )]
          } catch (error) {
            console.error('Error with API search:', error)
            results = localResults
          }
        } else {
          results = localResults
        }

        // Limitar a 6 resultados para mejor UX
        results = results.slice(0, 6)

        setSuggestions(results)
        setIsOpen(true)
        setSelectedIndex(-1)
        setHasSearched(true)
      } catch (error) {
        console.error('Error searching cities:', error)
        setSuggestions([])
        setIsOpen(false)
      } finally {
        setIsLoading(false)
      }
    }, 200) // Delay reducido para mejor UX
  }, [])

  // Efecto para manejar cambios en query
  useEffect(() => {
    searchCities(query)
    
    // Cleanup timeout al desmontar
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [query, searchCities])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    const totalItems = suggestions.length + (recentSearches.length && !query ? recentSearches.length : 0)

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < totalItems - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : totalItems - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          if (selectedIndex < suggestions.length) {
            handleSelectSuggestion(suggestions[selectedIndex])
          } else {
            const historyIndex = selectedIndex - suggestions.length
            if (recentSearches[historyIndex]) {
              handleSelectHistory(recentSearches[historyIndex])
            }
          }
        } else if (query.trim()) {
          handleAddCity()
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        break
    }
  }

  const handleSelectSuggestion = async (suggestion: CitySuggestion) => {
    try {
      await addCity({
        name: suggestion.display_name.split(',')[0],
        display_name: suggestion.display_name,
        lat: parseFloat(suggestion.lat),
        lon: parseFloat(suggestion.lon)
      })
      
      // Agregar al historial
      addToHistory(query, suggestion)
      
      setQuery('')
      setIsOpen(false)
      setSuggestions([])
      setSelectedIndex(-1)
    } catch (error) {
      console.error('Error adding city:', error)
    }
  }

  const handleSelectHistory = async (historyItem: SearchHistory) => {
    if (historyItem.result) {
      await handleSelectSuggestion(historyItem.result)
    } else {
      setQuery(historyItem.query)
      inputRef.current?.focus()
    }
  }

  const addToHistory = (searchQuery: string, result?: CitySuggestion) => {
    const newHistoryItem: SearchHistory = {
      id: generateId(),
      query: searchQuery,
      timestamp: Date.now(),
      result
    }

    const updatedHistory = [
      newHistoryItem,
      ...searchHistory.filter(item => item.query !== searchQuery)
    ].slice(0, 10) // Mantener solo 10 búsquedas recientes

    setSearchHistory(updatedHistory)
    setRecentSearches(updatedHistory.slice(0, 5))
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('search-history', sanitizeForStorage(updatedHistory))
    }
  }

  const clearHistory = () => {
    setSearchHistory([])
    setRecentSearches([])
    if (typeof window !== 'undefined') {
      localStorage.removeItem('search-history')
    }
  }

  const clearQuery = () => {
    setQuery('')
    setIsOpen(false)
    setSuggestions([])
    setSelectedIndex(-1)
    inputRef.current?.focus()
  }

  const handleAddCity = async () => {
    if (!query.trim()) return

    try {
      const results = await WeatherAPI.searchCities(query)
      if (results.length > 0) {
        await handleSelectSuggestion(results[0])
      }
    } catch (error) {
      console.error('Error adding city:', error)
    }
  }


  const handleUseLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocalización no soportada en este navegador')
      return
    }

    setIsGettingLocation(true)
    setLocationError(null)

    try {
      // Configuración optimizada para mejor precisión
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 30000
          }
        )
      })

      const { latitude, longitude, accuracy } = position.coords
      
      // Verificar precisión de la ubicación
      if (accuracy > 100) {
        setLocationError(`Precisión baja (${Math.round(accuracy)}m). Intenta en un lugar con mejor señal GPS.`)
        setIsGettingLocation(false)
        return
      }

      // Obtener información de la ubicación
      const suggestion = await WeatherAPI.reverseGeocode(latitude, longitude)
      
      if (suggestion) {
        await addCity({
          name: suggestion.display_name.split(',')[0],
          display_name: suggestion.display_name,
          lat: parseFloat(suggestion.lat),
          lon: parseFloat(suggestion.lon)
        })
        
        addToHistory('Mi ubicación', suggestion)
        
        // Cerrar panel de búsqueda
        setIsOpen(false)
        setQuery('')
        
        // Mostrar mensaje de éxito
        setLocationError(null)
      } else {
        setLocationError('No se pudo obtener información de la ubicación')
      }
    } catch (error: any) {
      let errorMessage = 'No se pudo obtener la ubicación'
      
      switch (error.code) {
        case 1: // PERMISSION_DENIED
          errorMessage = 'Permiso de ubicación denegado. Habilita la ubicación en tu navegador.'
          console.warn('📍 Ubicación denegada por el usuario')
          break
        case 2: // POSITION_UNAVAILABLE
          errorMessage = 'Ubicación no disponible. Verifica tu conexión GPS.'
          console.warn('📍 Ubicación no disponible')
          break
        case 3: // TIMEOUT
          errorMessage = 'Tiempo de espera agotado. Intenta nuevamente.'
          console.warn('📍 Timeout de ubicación')
          break
        default:
          console.error('Error getting location:', error)
      }
      
      setLocationError(errorMessage)
    } finally {
      setIsGettingLocation(false)
    }
  }

  // Función para obtener ubicación en tiempo real (opcional)
  const startLocationTracking = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocalización no soportada en este navegador')
      return
    }

    setIsGettingLocation(true)
    setLocationError(null)

    // Limpiar watch anterior si existe
    if (locationWatchId.current) {
      navigator.geolocation.clearWatch(locationWatchId.current)
    }

    locationWatchId.current = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords
        
        // Solo procesar si la precisión es buena
        if (accuracy <= 50) {
          try {
            const suggestion = await WeatherAPI.reverseGeocode(latitude, longitude)
            
            if (suggestion) {
              await addCity({
                name: suggestion.display_name.split(',')[0],
                display_name: suggestion.display_name,
                lat: parseFloat(suggestion.lat),
                lon: parseFloat(suggestion.lon)
              })
              
              addToHistory('Ubicación en tiempo real', suggestion)
              
              // Cerrar panel y limpiar watch
              setIsOpen(false)
              setQuery('')
              setIsGettingLocation(false)
              
              if (locationWatchId.current) {
                navigator.geolocation.clearWatch(locationWatchId.current)
                locationWatchId.current = null
              }
            }
          } catch (error) {
            console.error('Error processing location:', error)
          }
        }
      },
      (error) => {
        let errorMessage = 'Error en el seguimiento de ubicación'
        
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            errorMessage = 'Permiso de ubicación denegado. Habilita la ubicación en tu navegador.'
            console.warn('📍 Seguimiento denegado por el usuario')
            break
          case 2: // POSITION_UNAVAILABLE
            errorMessage = 'Ubicación no disponible. Verifica tu conexión GPS.'
            console.warn('📍 Seguimiento: ubicación no disponible')
            break
          case 3: // TIMEOUT
            errorMessage = 'Tiempo de espera agotado. Intenta nuevamente.'
            console.warn('📍 Seguimiento: timeout')
            break
          default:
            console.error('Error watching location:', error)
        }
        
        setLocationError(errorMessage)
        setIsGettingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000
      }
    )
  }

  // Limpiar watch de ubicación al desmontar
  useEffect(() => {
    return () => {
      if (locationWatchId.current) {
        navigator.geolocation.clearWatch(locationWatchId.current)
      }
    }
  }, [])

  // Limpiar error de ubicación automáticamente después de 5 segundos
  useEffect(() => {
    if (locationError) {
      const timer = setTimeout(() => {
        setLocationError(null)
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [locationError])

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const selectedItem = listRef.current.children[selectedIndex] as HTMLElement
      if (selectedItem) {
        selectedItem.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex])

  return (
    <div className="relative w-full max-w-md" data-tour="search-bar">
      {/* Barra de búsqueda principal */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Buscar ciudad en Colombia..."
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
           className="pl-10 pr-24 h-11"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
          {query && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearQuery}
              className="h-7 w-7"
              title="Limpiar búsqueda"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
           <div className="flex items-center space-x-1">
             <Button
               variant="ghost"
               size="icon"
               onClick={handleUseLocation}
               disabled={isGettingLocation}
               className={`h-7 w-7 ${isGettingLocation ? 'animate-pulse' : ''}`}
               title={isGettingLocation ? 'Obteniendo ubicación...' : 'Usar mi ubicación'}
             >
               {isGettingLocation ? (
                 <div className="animate-spin rounded-full h-3 w-3 border-b border-primary"></div>
               ) : (
                 <MapPin className="h-3 w-3" />
               )}
             </Button>
             
             <Button
               variant="ghost"
               size="icon"
               onClick={startLocationTracking}
               disabled={isGettingLocation}
               className={`h-7 w-7 ${isGettingLocation ? 'animate-pulse' : ''}`}
               title={isGettingLocation ? 'Seguimiento activo...' : 'Seguimiento en tiempo real'}
               data-tour="location-button"
             >
               {isGettingLocation ? (
                 <div className="animate-spin rounded-full h-3 w-3 border-b border-primary"></div>
               ) : (
                 <Navigation className="h-3 w-3" />
               )}
             </Button>
           </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleAddCity}
            disabled={!query.trim() || isLoading}
            className="h-7 w-7"
            title="Agregar ciudad"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Mensaje de error de ubicación */}
      {locationError && (
        <Card className="absolute top-full z-50 mt-1 w-full p-3 border-destructive/20 bg-destructive/5">
          <div className="flex items-center space-x-2">
            <div className="text-destructive">⚠️</div>
            <div className="flex-1">
              <p className="text-sm font-medium text-destructive">Error de ubicación</p>
              <p className="text-xs text-destructive/80">{locationError}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocationError(null)}
              className="h-6 w-6 text-destructive hover:text-destructive/80"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </Card>
      )}

      {/* Panel de resultados */}
      {isOpen && (
        <Card className="absolute top-full z-50 mt-1 w-full max-h-72 overflow-y-auto shadow-lg border">
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Buscando ciudades...</p>
            </div>
          ) : (
            <div ref={listRef} className="py-1">
              {/* Resultados de búsqueda */}
              {suggestions.length > 0 && (
                <div>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={suggestion.place_id}
                      className={`w-full px-3 py-3 text-left hover:bg-muted/50 transition-colors border-b border-border/50 last:border-b-0 ${
                        index === selectedIndex ? 'bg-muted' : ''
                      }`}
                      onClick={() => handleSelectSuggestion(suggestion)}
                    >
                      <div className="flex items-center space-x-3">
                        <MapPinIcon className="h-4 w-4 text-primary flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            {suggestion.display_name.split(',')[0]}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {suggestion.display_name.split(',').slice(1).join(',').trim()}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Agregar
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Búsquedas recientes - solo cuando no hay query */}
              {recentSearches.length > 0 && !query && (
                <div>
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground border-b border-border/50 flex items-center justify-between bg-muted/20">
                    <span>Búsquedas recientes</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearHistory}
                      className="h-5 px-2 text-xs"
                    >
                      Limpiar
                    </Button>
                  </div>
                  {recentSearches.map((historyItem, index) => (
                    <button
                      key={historyItem.id}
                      className={`w-full px-3 py-3 text-left hover:bg-muted/50 transition-colors border-b border-border/50 last:border-b-0 ${
                        index + suggestions.length === selectedIndex ? 'bg-muted' : ''
                      }`}
                      onClick={() => handleSelectHistory(historyItem)}
                    >
                      <div className="flex items-center space-x-3">
                        <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            {historyItem.query}
                          </div>
                          {historyItem.result && (
                            <div className="text-xs text-muted-foreground truncate">
                              {historyItem.result.display_name}
                            </div>
                          )}
                        </div>
                        {historyItem.result && (
                          <Star className="h-3 w-3 text-yellow-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Mensaje cuando no hay resultados */}
              {suggestions.length === 0 && query.trim() && !isLoading && hasSearched && (
                <div className="p-4 text-center">
                  <div className="text-4xl mb-2">🔍</div>
                  <p className="text-sm text-muted-foreground mb-1">
                    No se encontraron ciudades
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Intenta con otro término de búsqueda
                  </p>
                </div>
              )}

              {/* Mensaje inicial */}
              {!query && suggestions.length === 0 && recentSearches.length === 0 && (
                <div className="p-4 text-center">
                  <div className="text-4xl mb-2">🌤️</div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Busca una ciudad en Colombia
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Escribe el nombre de la ciudad o usa tu ubicación
                  </p>
                </div>
              )}
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
