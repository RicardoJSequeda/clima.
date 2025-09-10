'use client'

import { Search, MapPin, RefreshCw, Plus, Trash2, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CitySearch } from '@/components/weather/CitySearch'
import { useWeatherStore } from '@/hooks/useWeather'
import { WelcomeTourButton } from '@/components/tour/TourButton'

export function Header() {
  const { addCity, updateAllCities, clearCities, isLoading, cities, selectedCity } = useWeatherStore()
  const [showAlerts, setShowAlerts] = useState(false)
  const [alerts, setAlerts] = useState<Array<{ id: string; type: string; level: 'low'|'medium'|'high'|'critical'; title?: string; message: string; source?: string; startsAt?: string; endsAt?: string }>>([])
  const notifiedIdsRef = useState<Set<string>>(() => new Set())[0]
  // Al iniciar: si no hay ciudades, intentar detectar ubicación y agregarla
  useEffect(() => {
    if (cities.length === 0 && typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const lat = pos.coords.latitude
          const lon = pos.coords.longitude
          // Usar reverse geocode del WeatherAPI para nombre amigable
          const api = await import('@/lib/weather-api')
          const info = await api.WeatherAPI.reverseGeocode(lat, lon)
          await addCity({
            name: info?.display_name?.split(',')[0] || 'Mi ubicación',
            display_name: info?.display_name || 'Mi ubicación, Colombia',
            lat,
            lon
          } as any)
        } catch {}
      }, () => {}, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 })
    }
  }, [cities.length, addCity])

  // Cargar alertas desde múltiples fuentes a través de WeatherAPI
  useEffect(() => {
    let timer: any
    const load = async () => {
      try {
        const current = cities.find(c => c.id === selectedCity) || cities[0]
        const last = current ? { lat: current.lat, lon: current.lon } : { lat: 4.6097, lon: -74.0817 }
        const api = await import('@/lib/weather-api')
        const list = await api.WeatherAPI.fetchAlerts(last.lat, last.lon)
        setAlerts(list)
        // Guardar en historial local
        try {
          if (typeof window !== 'undefined') {
            const key = 'weather_alerts_history'
            const prev = JSON.parse(localStorage.getItem(key) || '[]') as any[]
            const merged = [...list.map(a => ({ ...a, ts: new Date().toISOString() })), ...prev]
            localStorage.setItem(key, JSON.stringify(merged.slice(0, 100)))
          }
        } catch {}
      } catch {}
    }
    if (showAlerts) {
      load()
      timer = setInterval(load, 60 * 1000)
    }
    return () => timer && clearInterval(timer)
  }, [showAlerts, cities, selectedCity])

  // Solicitar permiso de notificaciones cuando se abra el panel por primera vez
  useEffect(() => {
    if (showAlerts && typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().catch(() => {})
      }
    }
  }, [showAlerts])

  // Enviar notificación del navegador para alertas críticas nuevas
  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return
    if (Notification.permission !== 'granted') return
    alerts
      .filter(a => a.level === 'critical' && !notifiedIdsRef.has(a.id))
      .forEach(a => {
        try {
          new Notification(a.title || 'Alerta meteorológica crítica', {
            body: a.message,
          })
          notifiedIdsRef.add(a.id)
        } catch {}
      })
  }, [alerts, notifiedIdsRef])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <img src="/logo.svg" alt="El Tiempo Hoy" className="h-8 w-8 rounded-md" />
            <div>
              <h1 className="text-xl font-bold text-foreground">El Tiempo Hoy</h1>
              <p className="text-xs text-muted-foreground">Pronóstico meteorológico profesional</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <CitySearch />
          {/* Botón de tour de bienvenida */}
          <WelcomeTourButton />
          {/* Notificaciones de alertas */}
          <div className="relative">
            <Button
              variant="outline"
              size="icon"
              title="Alertas en tiempo real"
              aria-label="Alertas en tiempo real"
              onClick={() => setShowAlerts((s) => !s)}
              data-tour="notifications"
            >
              <Bell className="h-4 w-4" />
            </Button>
            {alerts.length > 0 && (
              <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 rounded-full bg-red-500 text-[10px] leading-4 text-white text-center">
                {Math.min(alerts.filter(a => a.level === 'high' || a.level === 'critical').length || alerts.length, 99)}
              </span>
            )}
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={updateAllCities}
            disabled={isLoading}
            title="Actualizar datos"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={clearCities}
            title="Limpiar ciudades"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        {/* Panel de alertas */}
        {showAlerts && (
          <div className="absolute right-4 top-16 z-[60] w-80">
            <Card className="p-3 space-y-2 shadow-lg border-border/60">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Alertas en tiempo real</p>
                <Button variant="ghost" size="sm" onClick={() => setShowAlerts(false)}>Cerrar</Button>
              </div>
              {alerts.length === 0 ? (
                <p className="text-xs text-muted-foreground">Sin alertas por el momento.</p>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {alerts.map((a) => (
                    <div key={a.id} className="rounded-md border p-2">
                      <p className="text-xs font-medium">{a.type} · {a.level.toUpperCase()} {a.source ? `· ${a.source}` : ''}</p>
                      <p className="text-xs text-muted-foreground">{a.title || 'Alerta'} — {a.message}</p>
                    </div>
                  ))}
                </div>
              )}
              <details className="mt-1">
                <summary className="text-xs cursor-pointer text-muted-foreground">Ver historial local</summary>
                <div className="mt-2 max-h-40 overflow-y-auto space-y-1">
                  {(typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('weather_alerts_history') || '[]') : []).slice(0,20).map((h: any, idx: number) => (
                    <div key={idx} className="text-[11px] text-muted-foreground">
                      {h.title || h.type}: {h.message}
                    </div>
                  ))}
                </div>
              </details>
            </Card>
          </div>
        )}
      </div>
    </header>
  )
}
