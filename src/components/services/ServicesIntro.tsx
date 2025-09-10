'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Cloud, 
  MapPin, 
  Bell, 
  Zap
} from 'lucide-react'
import { motion } from 'framer-motion'

export function ServicesIntro() {
  const services = [
    {
      icon: Cloud,
      title: 'Pronóstico en Tiempo Real',
      description: 'Datos meteorológicos actualizados cada minuto con información precisa de temperatura, humedad, viento y más.',
      features: ['Datos en tiempo real', 'Precisión alta', 'Actualización automática'],
      color: 'from-teal-500 to-cyan-500',
      iconColor: 'text-teal-600'
    },
    {
      icon: MapPin,
      title: 'Mapa Interactivo',
      description: 'Explora el clima de toda Colombia con nuestro mapa meteorológico interactivo y marcadores inteligentes.',
      features: ['Mapa interactivo', 'Marcadores dinámicos', 'Vista satelital'],
      color: 'from-cyan-500 to-blue-500',
      iconColor: 'text-cyan-600'
    },
    {
      icon: Bell,
      title: 'Alertas Meteorológicas',
      description: 'Recibe notificaciones instantáneas sobre condiciones climáticas extremas y alertas de seguridad.',
      features: ['Notificaciones push', 'Alertas críticas', 'Historial de alertas'],
      color: 'from-blue-500 to-indigo-500',
      iconColor: 'text-blue-600'
    }
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
        <Badge className="mb-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-0">
          <Zap className="h-3 w-3 mr-1" />
          Servicios Meteorológicos Profesionales
        </Badge>
        <h2 className="text-5xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent mb-6">
          El Tiempo Hoy
        </h2>
        <div className="max-w-4xl mx-auto space-y-3">
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            La plataforma meteorológica más completa y precisa de Colombia.
          </p>
          <p className="text-base text-slate-500 dark:text-slate-500 leading-relaxed">
            Obtén información en tiempo real, pronósticos confiables y alertas 
            que te mantienen seguro y preparado.
          </p>
        </div>
      </motion.div>


      {/* Servicios */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
      >
        {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group cursor-pointer"
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 overflow-hidden relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color}`}></div>
                </div>
                
                <CardHeader className="pb-4 relative z-10">
                  <div className="flex items-center space-x-4">
                    <motion.div 
                      className={`p-4 rounded-2xl bg-gradient-to-r ${service.color} shadow-xl group-hover:shadow-2xl transition-all duration-300`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    >
                      <service.icon className="h-8 w-8 text-white" />
                    </motion.div>
                    <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-300">
                      {service.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 relative z-10">
                  <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <motion.div 
                        key={featureIndex} 
                        className="flex items-center space-x-3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + featureIndex * 0.1 }}
                      >
                        <div className={`w-2 h-2 bg-gradient-to-r ${service.color} rounded-full animate-pulse`}></div>
                        <span className="text-sm text-slate-600 dark:text-slate-400">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
                
                {/* Decorative Elements */}
                <div className={`absolute top-4 right-4 w-20 h-20 bg-gradient-to-br ${service.color} opacity-10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500`}></div>
                <div className={`absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br ${service.color} opacity-10 rounded-full blur-lg group-hover:scale-125 transition-transform duration-500`}></div>
              </Card>
            </motion.div>
        ))}
      </motion.div>


    </div>
  )
}
