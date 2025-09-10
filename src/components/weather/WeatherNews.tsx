'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  ExternalLink, 
  Newspaper, 
  Filter, 
  MapPin, 
  Clock, 
  AlertTriangle,
  CloudRain,
  Wind,
  Zap,
  Droplets,
  Sun,
  Shield,
  TrendingUp
} from 'lucide-react'
import { useWeatherStore } from '@/hooks/useWeather'
import { weatherNewsAPI } from '@/lib/weather-news-api'
import { formatDate } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function WeatherNews() {
  const { news, loadWeatherNews } = useWeatherStore()
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)

  const categories = weatherNewsAPI.getCategories()
  const severities = weatherNewsAPI.getSeverities()

  useEffect(() => {
    const loadNews = async () => {
      if (news.length === 0) {
        setLoading(true)
        try {
          await loadWeatherNews()
          setLastUpdate(new Date().toISOString())
        } catch (error) {
          console.error('Error fetching news:', error)
        } finally {
          setLoading(false)
        }
      }
    }
    
    loadNews()
  }, [])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'rain':
        return <CloudRain className="h-4 w-4 text-blue-500" />
      case 'wind':
        return <Wind className="h-4 w-4 text-gray-500" />
      case 'flood':
        return <Droplets className="h-4 w-4 text-blue-600" />
      case 'storm':
        return <Zap className="h-4 w-4 text-yellow-500" />
      case 'damage':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'alert':
        return <Shield className="h-4 w-4 text-orange-500" />
      case 'general':
        return <Sun className="h-4 w-4 text-yellow-400" />
      default:
        return <Newspaper className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'rain':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'wind':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'flood':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'storm':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'damage':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'alert':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'general':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'Crítica'
      case 'high':
        return 'Alta'
      case 'medium':
        return 'Media'
      case 'low':
        return 'Baja'
      default:
        return 'Normal'
    }
  }

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'rain':
        return 'Lluvia'
      case 'wind':
        return 'Viento'
      case 'flood':
        return 'Inundación'
      case 'storm':
        return 'Tormenta'
      case 'damage':
        return 'Daños'
      case 'alert':
        return 'Alerta'
      case 'general':
        return 'General'
      default:
        return category
    }
  }

  const filteredNews = news.filter(item => {
    const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory
    const severityMatch = selectedSeverity === 'all' || item.severity === selectedSeverity
    return categoryMatch && severityMatch
  })

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Hace menos de 1 hora'
    if (diffInHours < 24) return `Hace ${diffInHours} horas`
    const diffInDays = Math.floor(diffInHours / 24)
    return `Hace ${diffInDays} días`
  }

  if (news.length === 0 && !loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Newspaper className="h-5 w-5 text-blue-600" />
            <span>Noticias del Clima</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📰</div>
            <p className="text-muted-foreground text-lg mb-4">
              Cargando noticias meteorológicas...
            </p>
            <p className="text-sm text-muted-foreground">
              Los datos se cargarán automáticamente
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-[500px] flex flex-col" data-tour="weather-news">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Newspaper className="h-5 w-5 text-blue-600" />
            <span>Noticias del Clima</span>
            <Badge variant="secondary" className="ml-2">
              {filteredNews.length} noticias
            </Badge>
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-1"
            >
              <Filter className="h-4 w-4" />
              <span>Filtros</span>
            </Button>
          </div>
        </div>
        
        {lastUpdate && (
          <p className="text-sm text-muted-foreground">
            Última actualización: {formatDate(lastUpdate)}
          </p>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col overflow-hidden">
        {/* Filtros */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4 flex-shrink-0"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Categoría</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-md"
                >
                  <option value="all">Todas las categorías</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {getCategoryText(category)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Severidad</label>
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-md"
                >
                  <option value="all">Todas las severidades</option>
                  {severities.map(severity => (
                    <option key={severity} value={severity}>
                      {getSeverityText(severity)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {/* Lista de noticias */}
        <div className="flex-1 overflow-y-auto pr-2">
          <AnimatePresence mode="popLayout">
            <motion.div 
              layout
              className="space-y-4"
            >
            {filteredNews.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-md"
              >
                <div className="flex items-start space-x-4">
                  {/* Imagen */}
                  {item.imageUrl && (
                    <div className="flex-shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    {/* Header con categoría y severidad */}
                    <div className="flex items-center space-x-2 mb-2">
                      {getCategoryIcon(item.category || 'general')}
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getCategoryColor(item.category || 'general')}`}
                      >
                        {getCategoryText(item.category || 'general')}
                      </Badge>
                      {item.severity && (
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getSeverityColor(item.severity)}`}
                        >
                          {getSeverityText(item.severity)}
                        </Badge>
                      )}
                    </div>
                    
                    {/* Título */}
                    <h3 className="font-semibold text-sm leading-tight mb-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    
                    {/* Descripción */}
                    {item.description && (
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    
                    {/* Ubicación y tiempo */}
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-2">
                      {item.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{item.location}</span>
                          {item.department && <span>({item.department})</span>}
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{getTimeAgo(item.publishedAt)}</span>
                      </div>
                    </div>
                    
                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {item.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Footer con fuente y enlace */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {item.source}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(item.publishedAt)}
                        </span>
                      </div>
                      
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-xs text-primary hover:text-primary/80 transition-colors"
                        title="Abrir en nueva pestaña"
                      >
                        <span>Leer más</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            </motion.div>
          </AnimatePresence>
          
          {filteredNews.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-muted-foreground">
                No hay noticias que coincidan con los filtros seleccionados
              </p>
            </motion.div>
          )}
        </div>
        
        <div className="mt-6 pt-4 border-t border-border/50 flex-shrink-0">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-3 w-3" />
              <span>Noticias actualizadas en tiempo real</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>Última actualización: {lastUpdate ? getTimeAgo(lastUpdate) : 'N/A'}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
