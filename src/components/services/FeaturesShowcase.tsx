'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  Sun, 
  CloudRain,
  Map,
  Bell,
  BarChart3,
  Clock,
  Zap,
  Shield
} from 'lucide-react'
import { motion } from 'framer-motion'

export function FeaturesShowcase() {
  const features = [
    {
      category: 'Datos en Tiempo Real',
      icon: Clock,
      color: 'from-teal-500 to-cyan-500',
      items: [
        { icon: Thermometer, label: 'Temperatura', value: 'Precisión ±0.1°C' },
        { icon: Droplets, label: 'Humedad', value: 'Actualización cada minuto' },
        { icon: Wind, label: 'Viento', value: 'Velocidad y dirección' },
        { icon: Eye, label: 'Visibilidad', value: 'Condiciones de conducción' }
      ]
    },
    {
      category: 'Pronósticos Avanzados',
      icon: BarChart3,
      color: 'from-cyan-500 to-blue-500',
      items: [
        { icon: Sun, label: 'Índice UV', value: 'Protección solar recomendada' },
        { icon: CloudRain, label: 'Precipitación', value: 'Probabilidad y cantidad' },
        { icon: Map, label: 'Cobertura', value: 'Toda Colombia' },
        { icon: Bell, label: 'Alertas', value: 'Notificaciones críticas' }
      ]
    }
  ]

  const benefits = [
    {
      icon: Zap,
      title: 'Ultra Rápido',
      description: 'Carga instantánea de datos meteorológicos',
      color: 'text-teal-600'
    },
    {
      icon: Shield,
      title: 'Confiable',
      description: 'Datos verificados por múltiples fuentes',
      color: 'text-cyan-600'
    },
    {
      icon: Clock,
      title: 'Actualizado',
      description: 'Información fresca cada minuto',
      color: 'text-blue-600'
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
        <Badge className="mb-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0">
          <BarChart3 className="h-3 w-3 mr-1" />
          Características Técnicas
        </Badge>
        <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Tecnología de Vanguardia
        </h3>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Nuestra plataforma utiliza las últimas tecnologías para brindarte 
          la información meteorológica más precisa y actualizada.
        </p>
      </motion.div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 * index }}
          >
            <Card className="h-full border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} shadow-lg`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    {feature.category}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {feature.items.map((item, itemIndex) => (
                    <motion.div
                      key={itemIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 * itemIndex }}
                      className="flex items-center space-x-3 p-3 rounded-lg bg-white/50 dark:bg-slate-700/50"
                    >
                      <item.icon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      <div className="flex-1">
                        <div className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                          {item.label}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                          {item.value}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Benefits */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * index }}
            whileHover={{ scale: 1.05 }}
          >
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
              <CardContent className="p-6">
                <benefit.icon className={`h-12 w-12 mx-auto mb-4 ${benefit.color}`} />
                <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  {benefit.title}
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
