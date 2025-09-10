'use client'

import { WeatherDashboard } from '@/components/weather/WeatherDashboard'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AutoTour } from '@/components/tour/AutoTour'
import { ServicesSection } from '@/components/services/ServicesSection'
import { ClientOnly } from '@/components/ClientOnly'

import { useHydrateStore } from '@/hooks/useWeather'

function AppContent() {
  // Hidratar el store en el cliente
  useHydrateStore()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
      {/* AutoTour temporalmente deshabilitado para el build */}
      {/* <AutoTour /> */}
      <Header />
      <main className="container mx-auto px-4 py-6">
        <ServicesSection />
        <WeatherDashboard />
      </main>
      <Footer />
    </div>
  )
}

export default function Home() {
  return (
    <ClientOnly 
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-lg text-slate-600 dark:text-slate-400">Cargando El Tiempo Hoy...</p>
          </div>
        </div>
      }
    >
      <AppContent />
    </ClientOnly>
  )
}
