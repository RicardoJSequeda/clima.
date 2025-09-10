'use client'

import { useEffect } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { WeatherData, NewsItem, WeatherStore } from '@/types/weather'
import { WeatherAPI } from '@/lib/weather-api'
import { weatherNewsAPI } from '@/lib/weather-news-api'
import { generateId } from '@/lib/utils'

// Hook para hidratar el store en el cliente
export const useHydrateStore = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Forzar rehidratación del store
      useWeatherStore.persist.rehydrate()
    }
  }, [])
}

export const useWeatherStore = create<WeatherStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      cities: [],
      selectedCity: null,
      news: [],
      isLoading: false,
      error: null,

      // Acciones
      addCity: async (cityData) => {
        set({ isLoading: true, error: null })
        
        try {
          const weatherData = await WeatherAPI.fetchWeather(cityData.lat, cityData.lon)
          
          const newCity: WeatherData = {
            id: generateId(),
            ...cityData,
            lastFetched: new Date().toISOString(),
            weather: weatherData
          }

          set((state) => ({
            cities: [...state.cities, newCity],
            selectedCity: newCity.id,
            isLoading: false
          }))

        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al agregar ciudad',
            isLoading: false 
          })
        }
      },

      removeCity: (id) => {
        set((state) => {
          const newCities = state.cities.filter(city => city.id !== id)
          const newSelectedCity = state.selectedCity === id ? 
            (newCities.length > 0 ? newCities[0].id : null) : 
            state.selectedCity

          return {
            cities: newCities,
            selectedCity: newSelectedCity
          }
        })
      },

      selectCity: (id) => {
        set({ selectedCity: id })
      },

      updateCity: async (id) => {
        set({ isLoading: true, error: null })
        
        try {
          const city = get().cities.find(c => c.id === id)
          if (!city) return

          const weatherData = await WeatherAPI.fetchWeather(city.lat, city.lon)
          
          set((state) => ({
            cities: state.cities.map(c => 
              c.id === id 
                ? { ...c, weather: weatherData, lastFetched: new Date().toISOString() }
                : c
            ),
            isLoading: false
          }))

        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al actualizar ciudad',
            isLoading: false 
          })
        }
      },

      updateAllCities: async () => {
        set({ isLoading: true, error: null })
        
        try {
          const cities = get().cities
          const updatedCities = await Promise.all(
            cities.map(async (city) => {
              const weatherData = await WeatherAPI.fetchWeather(city.lat, city.lon)
              return { 
                ...city, 
                weather: weatherData, 
                lastFetched: new Date().toISOString()
              }
            })
          )

          set((state) => ({
            cities: updatedCities,
            isLoading: false
          }))

        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al actualizar datos',
            isLoading: false 
          })
        }
      },

      // Actualización automática en tiempo real
      startAutoUpdate: () => {
        const { updateAllCities } = get()
        
        // Actualizar cada 2 minutos para datos en tiempo real
        const interval = setInterval(() => {
          updateAllCities()
        }, 2 * 60 * 1000)

        // Retornar función de limpieza
        return () => clearInterval(interval)
      },

      clearCities: () => {
        set({ 
          cities: [], 
          selectedCity: null, 
          error: null 
        })
      },

      setLoading: (loading) => {
        set({ isLoading: loading })
      },

      setError: (error) => {
        set({ error })
      },

      setNews: (news) => {
        set({ news })
      },

      loadWeatherNews: async () => {
        try {
          const response = await weatherNewsAPI.fetchNews()
          set({ news: response.news })
          return response.news
        } catch (error) {
          console.error('Error loading weather news:', error)
          return []
        }
      },

      loadNewsByCategory: async (category: string) => {
        try {
          const news = await weatherNewsAPI.fetchNewsByCategory(category)
          return news
        } catch (error) {
          console.error('Error loading news by category:', error)
          return []
        }
      },

      loadNewsByDepartment: async (department: string) => {
        try {
          const news = await weatherNewsAPI.fetchNewsByDepartment(department)
          return news
        } catch (error) {
          console.error('Error loading news by department:', error)
          return []
        }
      }
    }),
    {
      name: 'weather-storage',
      partialize: (state) => ({
        cities: state.cities,
        selectedCity: state.selectedCity,
        news: state.news
      }),
      skipHydration: true
    }
  )
)