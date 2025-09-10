'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Info,
  Database,
  BarChart3
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ServicesIntro } from './ServicesIntro'
import { FeaturesShowcase } from './FeaturesShowcase'
import { DataSources } from './DataSources'

export function ServicesSection() {
  const [activeTab, setActiveTab] = useState<'intro' | 'features' | 'sources'>('intro')

  return (
    <div className="w-full">

      {/* Content Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="overflow-hidden"
      >
            {/* Tab Navigation */}
            <div className="flex justify-center mb-8">
              <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 shadow-lg">
                <Button
                  onClick={() => setActiveTab('intro')}
                  variant={activeTab === 'intro' ? 'default' : 'ghost'}
                  size="sm"
                  className={`${
                    activeTab === 'intro'
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg hover:shadow-xl transition-all duration-300'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200'
                  } rounded-lg`}
                >
                  <Info className="h-4 w-4 mr-2" />
                  Servicios
                </Button>
                <Button
                  onClick={() => setActiveTab('features')}
                  variant={activeTab === 'features' ? 'default' : 'ghost'}
                  size="sm"
                  className={`${
                    activeTab === 'features'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg hover:shadow-xl transition-all duration-300'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200'
                  } rounded-lg`}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Características
                </Button>
                <Button
                  onClick={() => setActiveTab('sources')}
                  variant={activeTab === 'sources' ? 'default' : 'ghost'}
                  size="sm"
                  className={`${
                    activeTab === 'sources'
                      ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-lg hover:shadow-xl transition-all duration-300'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200'
                  } rounded-lg`}
                >
                  <Database className="h-4 w-4 mr-2" />
                  Fuentes
                </Button>
              </div>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'intro' && <ServicesIntro />}
                {activeTab === 'features' && <FeaturesShowcase />}
                {activeTab === 'sources' && <DataSources />}
              </motion.div>
            </AnimatePresence>

      </motion.div>
    </div>
  )
}
