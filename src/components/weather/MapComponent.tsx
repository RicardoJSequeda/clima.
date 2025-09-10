'use client'

import { useEffect, useRef } from 'react'
import { useWeatherStore } from '@/hooks/useWeather'
import { WEATHER_CODES } from '@/types/weather'

// Importación dinámica de Leaflet para evitar problemas de SSR
let L: any = null

export default function MapComponent() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const { cities, selectedCity, selectCity } = useWeatherStore()

  useEffect(() => {
    // Cargar Leaflet dinámicamente
    const loadLeaflet = async () => {
      if (typeof window !== 'undefined' && !L) {
        try {
          L = (await import('leaflet')).default
          await import('leaflet.markercluster')
          
          // Configurar iconos por defecto
          delete (L.Icon.Default.prototype as any)._getIconUrl
          L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
          })
          
          // Forzar re-render del mapa después de cargar Leaflet
          setTimeout(() => {
            if (mapRef.current && !mapInstanceRef.current) {
              initializeMap()
            }
          }, 100)
        } catch (error) {
          console.error('Error loading Leaflet:', error)
        }
      }
    }

    loadLeaflet()
  }, [])

  const initializeMap = () => {
    if (!L || !mapRef.current || mapInstanceRef.current) return

    try {
      mapInstanceRef.current = L.map(mapRef.current).setView([4.570868, -74.297333], 6)
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current)
      
      // Actualizar marcadores después de inicializar el mapa
      updateMarkers()
    } catch (error) {
      console.error('Error initializing map:', error)
    }
  }

  const updateMarkers = () => {
    if (!L) return

    // Si el mapa no está listo o su contenedor fue desmontado, reinicializar de forma segura
    if (!mapInstanceRef.current || !(mapInstanceRef.current as any)._container || !mapRef.current?.isConnected) {
      initializeMap()
      if (!mapInstanceRef.current) return
    }

    // Limpiar marcadores existentes
    markersRef.current.forEach(marker => {
      mapInstanceRef.current.removeLayer(marker)
    })
    markersRef.current = []

    // Agregar marcadores para cada ciudad
    cities.forEach(city => {
      if (!city.weather?.current_weather) return

      const { current_weather } = city.weather
      const weatherInfo = WEATHER_CODES[current_weather.weathercode] || WEATHER_CODES[0]
      
      const marker = L.marker([city.lat, city.lon])
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-bold text-lg">${city.name}</h3>
            <p class="text-sm text-gray-600">${city.display_name}</p>
            <div class="flex items-center space-x-2 mt-2">
              <span class="text-2xl">${weatherInfo.icon}</span>
              <div>
                <p class="text-xl font-bold">${Math.round(current_weather.temperature)}°C</p>
                <p class="text-sm">${weatherInfo.description}</p>
                <p class="text-xs text-gray-500">Viento: ${Math.round(current_weather.windspeed)} km/h</p>
              </div>
            </div>
          </div>
        `)
        .on('click', () => selectCity(city.id))

      // Destacar ciudad seleccionada
      if (selectedCity === city.id) {
        marker.setIcon(L.icon({
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
          shadowSize: [41, 41]
        }))
      }

      marker.addTo(mapInstanceRef.current)
      markersRef.current.push(marker)
    })

    // Ajustar vista del mapa para mostrar todas las ciudades
    if (cities.length > 0) {
      const group = new L.featureGroup(markersRef.current)
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1))
    }
  }

  useEffect(() => {
    if (!L || !mapRef.current) return

    // Crear mapa si no existe
    if (!mapInstanceRef.current) {
      initializeMap()
    } else {
      // Solo actualizar marcadores si el mapa ya existe
      updateMarkers()
    }
  }, [cities, selectedCity, selectCity])

  // Efecto adicional para inicializar el mapa cuando esté listo
  useEffect(() => {
    if (L && mapRef.current && !mapInstanceRef.current) {
      initializeMap()
    }
  }, [L])

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  return <div ref={mapRef} className="w-full h-[600px] rounded-b-lg relative z-0" />
}
