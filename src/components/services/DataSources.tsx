'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Database, 
  Globe, 
  Shield, 
  Zap, 
  CheckCircle,
  ExternalLink,
  MapPin,
  Cloud
} from 'lucide-react'
import { motion } from 'framer-motion'

export function DataSources() {
  const dataSources = [
    {
      name: 'Open-Meteo',
      description: 'API meteorológica de código abierto con datos globales',
      features: ['Tiempo real', 'Pronósticos 7 días', 'Datos históricos'],
      reliability: '99.9%',
      updateFrequency: 'Cada minuto',
      icon: Cloud,
      color: 'from-teal-500 to-cyan-500',
      link: 'https://open-meteo.com'
    },
    {
      name: 'OpenWeatherMap',
      description: 'Servicio meteorológico líder mundial',
      features: ['Alertas meteorológicas', 'Mapas interactivos', 'Datos precisos'],
      reliability: '99.8%',
      updateFrequency: 'Cada 10 minutos',
      icon: Globe,
      color: 'from-cyan-500 to-blue-500',
      link: 'https://openweathermap.org'
    },
    {
      name: 'Nominatim',
      description: 'Servicio de geocodificación de OpenStreetMap',
      features: ['Búsqueda de ubicaciones', 'Geocodificación inversa', 'Datos abiertos'],
      reliability: '99.5%',
      updateFrequency: 'Tiempo real',
      icon: MapPin,
      color: 'from-blue-500 to-indigo-500',
      link: 'https://nominatim.org'
    }
  ]

  const qualityMetrics = [
    { label: 'Precisión de Datos', value: '99.7%', icon: CheckCircle, color: 'text-teal-600' },
    { label: 'Tiempo de Respuesta', value: '< 200ms', icon: Zap, color: 'text-cyan-600' },
    { label: 'Disponibilidad', value: '99.9%', icon: Shield, color: 'text-blue-600' },
    { label: 'Cobertura', value: 'Global', icon: Globe, color: 'text-indigo-600' }
  ]

  return (
    <div className="w-full px-4 py-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white border-0">
          <Database className="h-3 w-3 mr-1" />
          Fuentes de Datos
        </Badge>
        <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Datos Confiables y Precisos
        </h3>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Nuestra plataforma utiliza múltiples fuentes de datos meteorológicos 
          líderes para garantizar la máxima precisión y confiabilidad.
        </p>
      </motion.div>

      {/* Quality Metrics */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
      >
        {qualityMetrics.map((metric, index) => (
          <Card key={index} className="text-center border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
            <CardContent className="p-4">
              <metric.icon className={`h-8 w-8 mx-auto mb-2 ${metric.color}`} />
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{metric.value}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">{metric.label}</div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Data Sources */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {dataSources.map((source, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * index }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="group"
          >
            <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${source.color} shadow-lg`}>
                      <source.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {source.name}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {source.reliability} confiable
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <a
                    href={source.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <ExternalLink className="h-4 w-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
                  </a>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm leading-relaxed">
                  {source.description}
                </p>
                <div className="space-y-2 mb-4">
                  {source.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-500">
                  <span>Actualización: {source.updateFrequency}</span>
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Activo</span>
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer Note */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-12 text-center"
      >
        <Card className="border-0 shadow-lg bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-900">
          <CardContent className="p-6">
            <Shield className="h-8 w-8 mx-auto mb-3 text-teal-600" />
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Garantía de Calidad
            </h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl mx-auto">
              Todos nuestros datos son verificados por múltiples fuentes y actualizados 
              en tiempo real para garantizar la máxima precisión y confiabilidad.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
