// API para noticias meteorológicas en tiempo real de Colombia
// Integración con múltiples fuentes de noticias

export interface WeatherNewsItem {
  id: string
  title: string
  description: string
  url: string
  source: string
  publishedAt: string
  category: 'rain' | 'wind' | 'flood' | 'storm' | 'damage' | 'alert' | 'general'
  severity: 'low' | 'medium' | 'high' | 'critical'
  location: string
  department: string
  imageUrl?: string
  tags: string[]
}

export interface WeatherNewsResponse {
  news: WeatherNewsItem[]
  lastUpdate: string
  total: number
  sources: string[]
}

class WeatherNewsAPI {
  private baseUrl = 'https://api.weather-news-colombia.com'
  private sources = [
    'El Tiempo',
    'El Espectador',
    'Semana',
    'Noticias Caracol',
    'RCN Noticias',
    'IDEAM',
    'UNGRD',
    'Canal 1',
    'City TV',
    'Noticias Uno'
  ]

  // Simulación de noticias meteorológicas en tiempo real
  // En producción, esto se conectaría con APIs reales de noticias
  private generateMockNews(): WeatherNewsItem[] {
    const now = new Date()
    const categories: WeatherNewsItem['category'][] = ['rain', 'wind', 'flood', 'storm', 'damage', 'alert', 'general']
    const severities: WeatherNewsItem['severity'][] = ['low', 'medium', 'high', 'critical']
    
    // Priorizar Córdoba - aparece primero en la lista
    const departments = [
      'Córdoba', // Prioridad máxima
      'Cundinamarca', 'Antioquia', 'Valle del Cauca', 'Atlántico', 'Santander',
      'Norte de Santander', 'Boyacá', 'Caldas', 'Tolima', 'Huila', 'Cauca',
      'Nariño', 'Sucre', 'Bolívar', 'Magdalena', 'Cesar', 'La Guajira',
      'Meta', 'Casanare', 'Arauca', 'Vichada', 'Guainía', 'Vaupés', 'Amazonas',
      'Putumayo', 'Caquetá', 'Guaviare', 'Risaralda', 'Quindío', 'Chocó'
    ]

    const newsTemplates = {
      rain: [
        'Lluvias intensas causan inundaciones en {location}',
        'Precipitaciones superan los 50mm en {location}',
        'Alerta por lluvias torrenciales en {location}',
        'Desbordamiento de quebradas en {location} por lluvias',
        'Lluvias afectan vías principales de {location}',
        'Precipitaciones causan deslizamientos en {location}',
        // Plantillas específicas para Córdoba
        'Río Sinú se desborda en {location} por lluvias intensas',
        'Inundaciones en la zona bananera de {location}',
        'Lluvias afectan cultivos de algodón en {location}',
        'Precipitaciones causan anegamiento en {location}',
        'Quebradas de {location} superan su capacidad por lluvias'
      ],
      wind: [
        'Vientos fuertes superan los 60 km/h en {location}',
        'Ráfagas de viento causan daños en {location}',
        'Alerta por vientos huracanados en {location}',
        'Vientos derriban árboles en {location}',
        'Ráfagas afectan infraestructura en {location}',
        'Vientos fuertes interrumpen servicios en {location}',
        // Plantillas específicas para Córdoba
        'Vientos afectan cultivos de banano en {location}',
        'Ráfagas causan daños en invernaderos de {location}',
        'Vientos fuertes interrumpen cosecha en {location}',
        'Ráfagas afectan infraestructura portuaria de {location}',
        'Vientos causan daños en viviendas de {location}'
      ],
      flood: [
        'Inundaciones afectan barrios de {location}',
        'Río se desborda en {location}',
        'Zonas bajas de {location} bajo el agua',
        'Inundación causa evacuación en {location}',
        'Desbordamiento de ríos en {location}',
        'Inundaciones bloquean vías en {location}',
        // Plantillas específicas para Córdoba
        'Río Sinú inunda barrios de {location}',
        'Inundaciones afectan zona bananera de {location}',
        'Río San Jorge se desborda en {location}',
        'Inundaciones en la Ciénaga Grande de {location}',
        'Desbordamiento de caños en {location}',
        'Inundaciones afectan cultivos de {location}'
      ],
      storm: [
        'Tormenta eléctrica azota {location}',
        'Granizada afecta cultivos en {location}',
        'Tormenta causa cortes de energía en {location}',
        'Ráfagas y lluvia intensa en {location}',
        'Tormenta eléctrica interrumpe servicios en {location}',
        'Granizo causa daños en {location}',
        // Plantillas específicas para Córdoba
        'Tormenta eléctrica afecta cultivos de banano en {location}',
        'Granizada daña invernaderos de {location}',
        'Tormenta interrumpe cosecha en {location}',
        'Ráfagas y lluvia afectan puerto de {location}',
        'Tormenta eléctrica causa cortes en {location}'
      ],
      damage: [
        'Clima extremo causa daños en {location}',
        'Eventos meteorológicos afectan infraestructura en {location}',
        'Daños por clima en vías de {location}',
        'Pérdidas materiales por clima en {location}',
        'Infraestructura afectada por clima en {location}',
        'Daños en cultivos por clima en {location}',
        // Plantillas específicas para Córdoba
        'Daños en cultivos de banano por clima en {location}',
        'Pérdidas en sector ganadero de {location}',
        'Daños en infraestructura portuaria de {location}',
        'Pérdidas en cultivos de algodón de {location}',
        'Daños en viviendas por clima en {location}',
        'Pérdidas económicas en {location} por eventos climáticos'
      ],
      alert: [
        'IDEAM emite alerta meteorológica para {location}',
        'Alerta roja por clima en {location}',
        'UNGRD activa protocolos en {location}',
        'Alerta naranja por condiciones climáticas en {location}',
        'Autoridades emiten alerta para {location}',
        'Sistema de alertas activado en {location}',
        // Plantillas específicas para Córdoba
        'IDEAM emite alerta por desbordamiento del Río Sinú en {location}',
        'Alerta roja por inundaciones en zona bananera de {location}',
        'UNGRD activa protocolos en {location} por lluvias intensas',
        'Alerta naranja por vientos fuertes en {location}',
        'Autoridades de {location} emiten alerta por clima extremo',
        'Sistema de alertas activado en {location} por tormentas'
      ],
      general: [
        'Pronóstico meteorológico para {location}',
        'Condiciones climáticas en {location}',
        'Actualización del clima en {location}',
        'Reporte meteorológico de {location}',
        'Estado del clima en {location}',
        'Informe climático de {location}',
        // Plantillas específicas para Córdoba
        'Pronóstico para la zona bananera de {location}',
        'Condiciones climáticas en el valle del Sinú de {location}',
        'Actualización del clima en {location} para agricultores',
        'Reporte meteorológico para el puerto de {location}',
        'Estado del clima en {location} para el sector ganadero',
        'Informe climático de {location} para cultivos'
      ]
    }

    const news: WeatherNewsItem[] = []
    
    // Generar 15-25 noticias
    const newsCount = Math.floor(Math.random() * 11) + 15
    
    // Generar noticias priorizando Córdoba (40% de las noticias)
    const cordobaNewsCount = Math.floor(newsCount * 0.4)
    const otherNewsCount = newsCount - cordobaNewsCount
    
    // Generar noticias de Córdoba primero
    for (let i = 0; i < cordobaNewsCount; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)]
      const severity = severities[Math.floor(Math.random() * severities.length)]
      const department = 'Córdoba' // Siempre Córdoba para estas noticias
      const source = this.sources[Math.floor(Math.random() * this.sources.length)]
      
      // Generar ubicación específica
      const locations = this.getLocationsByDepartment(department)
      const location = locations[Math.floor(Math.random() * locations.length)]
      
      // Seleccionar plantilla
      const templates = newsTemplates[category]
      const template = templates[Math.floor(Math.random() * templates.length)]
      const title = template.replace('{location}', location)
      
      // Generar descripción
      const description = this.generateDescription(category, location, severity)
      
      // Generar fecha (últimas 24 horas)
      const hoursAgo = Math.floor(Math.random() * 24)
      const publishedAt = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000)
      
      // Generar tags
      const tags = this.generateTags(category, severity, department)
      
      news.push({
        id: `news-${Date.now()}-${i}`,
        title,
        description,
        url: `https://${source.toLowerCase().replace(/\s+/g, '')}.com/noticia/${i}`,
        source,
        publishedAt: publishedAt.toISOString(),
        category,
        severity,
        location,
        department,
        imageUrl: this.getImageUrl(category),
        tags
      })
    }
    
    // Generar noticias de otros departamentos
    for (let i = 0; i < otherNewsCount; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)]
      const severity = severities[Math.floor(Math.random() * severities.length)]
      const department = departments[Math.floor(Math.random() * departments.length)]
      const source = this.sources[Math.floor(Math.random() * this.sources.length)]
      
      // Generar ubicación específica
      const locations = this.getLocationsByDepartment(department)
      const location = locations[Math.floor(Math.random() * locations.length)]
      
      // Seleccionar plantilla
      const templates = newsTemplates[category]
      const template = templates[Math.floor(Math.random() * templates.length)]
      const title = template.replace('{location}', location)
      
      // Generar descripción
      const description = this.generateDescription(category, location, severity)
      
      // Generar fecha (últimas 24 horas)
      const hoursAgo = Math.floor(Math.random() * 24)
      const publishedAt = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000)
      
      // Generar tags
      const tags = this.generateTags(category, severity, department)
      
      news.push({
        id: `news-${Date.now()}-${i + cordobaNewsCount}`,
        title,
        description,
        url: `https://${source.toLowerCase().replace(/\s+/g, '')}.com/noticia/${i + cordobaNewsCount}`,
        source,
        publishedAt: publishedAt.toISOString(),
        category,
        severity,
        location,
        department,
        imageUrl: this.getImageUrl(category),
        tags
      })
    }
    
    // Ordenar por fecha (más recientes primero)
    return news.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  }

  private getLocationsByDepartment(department: string): string[] {
    const locations: Record<string, string[]> = {
      'Cundinamarca': ['Bogotá', 'Soacha', 'Zipaquirá', 'Facatativá', 'Chía', 'Girardot', 'Fusagasugá'],
      'Antioquia': ['Medellín', 'Bello', 'Itagüí', 'Envigado', 'Apartadó', 'Turbo', 'Rionegro'],
      'Valle del Cauca': ['Cali', 'Palmira', 'Buenaventura', 'Tuluá', 'Cartago', 'Buga', 'Yumbo'],
      'Atlántico': ['Barranquilla', 'Soledad', 'Malambo', 'Puerto Colombia', 'Galapa', 'Sabanalarga'],
      'Santander': ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta', 'Barrancabermeja', 'San Gil'],
      'Norte de Santander': ['Cúcuta', 'Villa del Rosario', 'Los Patios', 'El Zulia', 'Ocaña'],
      'Boyacá': ['Tunja', 'Duitama', 'Sogamoso', 'Chiquinquirá', 'Paipa', 'Villa de Leyva'],
      'Caldas': ['Manizales', 'La Dorada', 'Chinchiná', 'Riosucio', 'Anserma'],
      'Tolima': ['Ibagué', 'Girardot', 'Espinal', 'Melgar', 'Guamo', 'Honda'],
      'Huila': ['Neiva', 'Pitalito', 'Garzón', 'La Plata', 'Gigante', 'Campoalegre'],
      'Cauca': ['Popayán', 'Santander de Quilichao', 'Patía', 'Puerto Tejada', 'Silvia'],
      'Nariño': ['Pasto', 'Tumaco', 'Ipiales', 'Túquerres', 'La Unión', 'Sandoná'],
      'Córdoba': [
        'Montería', 'Cereté', 'Sahagún', 'Lorica', 'Montelíbano', 'Planeta Rica',
        'Ciénaga de Oro', 'San Andrés Sotavento', 'Canalete', 'Los Córdobas',
        'Puerto Escondido', 'San Bernardo del Viento', 'San Pelayo', 'Tierralta',
        'Valencia', 'Ayapel', 'Buenavista', 'Chimá', 'Cotorra', 'La Apartada',
        'Momil', 'Pueblo Nuevo', 'Purísima', 'San Antero', 'San Carlos',
        'San José de Uré', 'Tuchín', 'Villa del Rosario'
      ],
      'Sucre': ['Sincelejo', 'Corozal', 'Sampués', 'San Onofre', 'Coveñas', 'Tolú'],
      'Bolívar': ['Cartagena', 'Magangué', 'Turbaco', 'Arjona', 'San Pablo', 'Mompós'],
      'Magdalena': ['Santa Marta', 'Ciénaga', 'Fundación', 'Aracataca', 'El Banco', 'Zona Bananera'],
      'Cesar': ['Valledupar', 'Aguachica', 'Codazzi', 'La Paz', 'San Diego', 'Chimichagua'],
      'La Guajira': ['Riohacha', 'Maicao', 'Uribia', 'Manaure', 'San Juan del Cesar', 'Fonseca'],
      'Meta': ['Villavicencio', 'Acacías', 'Granada', 'San Martín', 'Cumaral', 'Restrepo'],
      'Casanare': ['Yopal', 'Aguazul', 'Tauramena', 'Villanueva', 'Monterrey', 'Sabanalarga'],
      'Arauca': ['Arauca', 'Saravena', 'Fortul', 'Tame', 'Arauquita', 'Puerto Rondón'],
      'Vichada': ['Puerto Carreño', 'La Primavera', 'Santa Rosalía', 'Cumaribo', 'Puerto Nariño'],
      'Guainía': ['Inírida', 'Barranco Minas', 'Mapiripana', 'San Felipe', 'Pana Pana'],
      'Vaupés': ['Mitú', 'Caruru', 'Pacoa', 'Taraira', 'Papunaua', 'Yavaraté'],
      'Amazonas': ['Leticia', 'El Encanto', 'La Chorrera', 'La Pedrera', 'Miriti-Paraná', 'Puerto Nariño'],
      'Putumayo': ['Mocoa', 'Villagarzón', 'Puerto Asís', 'Orito', 'Valle del Guamuez', 'San Miguel'],
      'Caquetá': ['Florencia', 'San Vicente del Caguán', 'Puerto Rico', 'La Montañita', 'El Paujíl'],
      'Guaviare': ['San José del Guaviare', 'Calamar', 'El Retorno', 'Miraflores'],
      'Risaralda': ['Pereira', 'Dosquebradas', 'Santa Rosa de Cabal', 'Cartago', 'La Virginia'],
      'Quindío': ['Armenia', 'Calarcá', 'La Tebaida', 'Montenegro', 'Quimbaya', 'Circasia'],
      'Chocó': ['Quibdó', 'Istmina', 'Condoto', 'Tadó', 'Riosucio', 'Acandí']
    }
    
    return locations[department] || [department]
  }

  private generateDescription(category: string, location: string, severity: string): string {
    const descriptions = {
      rain: [
        `Las precipitaciones en ${location} han superado los niveles normales, causando preocupación entre las autoridades locales.`,
        `Las lluvias intensas en ${location} han generado problemas de movilidad y afectado varias zonas residenciales.`,
        `Las precipitaciones torrenciales en ${location} han activado los protocolos de emergencia de las autoridades.`,
        `Las lluvias persistentes en ${location} han causado el desbordamiento de quebradas y ríos menores.`,
        // Descripciones específicas para Córdoba
        `Las lluvias en ${location} han afectado la zona bananera, causando preocupación entre los productores.`,
        `Las precipitaciones en ${location} han causado el desbordamiento del Río Sinú, afectando comunidades ribereñas.`,
        `Las lluvias intensas en ${location} han impactado los cultivos de algodón en la región.`,
        `Las precipitaciones en ${location} han causado anegamiento en la Ciénaga Grande, afectando la pesca.`
      ],
      wind: [
        `Los vientos fuertes en ${location} han causado la caída de árboles y afectado el tendido eléctrico.`,
        `Las ráfagas de viento en ${location} han superado los 60 km/h, generando alertas de las autoridades.`,
        `Los vientos huracanados en ${location} han causado daños en infraestructura y viviendas.`,
        `Las ráfagas intensas en ${location} han interrumpido servicios básicos y causado evacuaciones preventivas.`,
        // Descripciones específicas para Córdoba
        `Los vientos fuertes en ${location} han afectado los cultivos de banano, causando pérdidas económicas.`,
        `Las ráfagas en ${location} han dañado invernaderos y afectado la producción agrícola.`,
        `Los vientos en ${location} han interrumpido las labores de cosecha en la zona bananera.`,
        `Las ráfagas intensas en ${location} han afectado la infraestructura portuaria del puerto.`
      ],
      flood: [
        `Las inundaciones en ${location} han afectado varios barrios y causado evacuaciones de emergencia.`,
        `El desbordamiento de ríos en ${location} ha generado alertas rojas y evacuaciones masivas.`,
        `Las inundaciones en ${location} han bloqueado vías principales y afectado el comercio local.`,
        `El aumento del nivel de las aguas en ${location} ha causado daños materiales considerables.`,
        // Descripciones específicas para Córdoba
        `El desbordamiento del Río Sinú en ${location} ha afectado comunidades ribereñas y cultivos.`,
        `Las inundaciones en ${location} han impactado la zona bananera, causando pérdidas en la cosecha.`,
        `El desbordamiento del Río San Jorge en ${location} ha afectado la ganadería de la región.`,
        `Las inundaciones en ${location} han causado anegamiento en la Ciénaga Grande, afectando la pesca.`
      ],
      storm: [
        `La tormenta eléctrica en ${location} ha causado cortes de energía y afectado las comunicaciones.`,
        `La granizada en ${location} ha dañado cultivos y causado pérdidas económicas significativas.`,
        `La tormenta en ${location} ha generado alertas de las autoridades y recomendaciones de seguridad.`,
        `Los fenómenos meteorológicos en ${location} han causado interrupciones en servicios básicos.`,
        // Descripciones específicas para Córdoba
        `La tormenta eléctrica en ${location} ha afectado los cultivos de banano, causando pérdidas.`,
        `La granizada en ${location} ha dañado invernaderos y afectado la producción agrícola.`,
        `La tormenta en ${location} ha interrumpido las labores de cosecha en la zona bananera.`,
        `Los fenómenos meteorológicos en ${location} han afectado la infraestructura portuaria.`
      ],
      damage: [
        `Los daños causados por el clima en ${location} han sido evaluados por las autoridades competentes.`,
        `La infraestructura en ${location} ha sido afectada por las condiciones climáticas extremas.`,
        `Los eventos meteorológicos en ${location} han causado pérdidas materiales considerables.`,
        `Los daños en ${location} han activado los protocolos de ayuda humanitaria de las autoridades.`,
        // Descripciones específicas para Córdoba
        `Los daños en los cultivos de banano de ${location} han causado pérdidas económicas significativas.`,
        `La infraestructura portuaria de ${location} ha sido afectada por las condiciones climáticas.`,
        `Los eventos meteorológicos en ${location} han causado pérdidas en el sector ganadero.`,
        `Los daños en ${location} han afectado la producción de algodón en la región.`
      ],
      alert: [
        `Las autoridades han emitido alertas meteorológicas para ${location} debido a las condiciones climáticas.`,
        `El sistema de alertas tempranas ha sido activado en ${location} por las condiciones meteorológicas.`,
        `Las autoridades competentes han declarado alerta en ${location} por fenómenos climáticos.`,
        `Los protocolos de emergencia han sido activados en ${location} debido al clima extremo.`,
        // Descripciones específicas para Córdoba
        `IDEAM ha emitido alerta por desbordamiento del Río Sinú en ${location}, afectando comunidades ribereñas.`,
        `El sistema de alertas tempranas ha sido activado en ${location} por lluvias intensas en la zona bananera.`,
        `Las autoridades de ${location} han declarado alerta por vientos fuertes que afectan la agricultura.`,
        `Los protocolos de emergencia han sido activados en ${location} por tormentas que afectan el puerto.`
      ],
      general: [
        `El pronóstico meteorológico para ${location} indica condiciones variables en las próximas horas.`,
        `Las condiciones climáticas en ${location} están siendo monitoreadas por las autoridades.`,
        `El reporte meteorológico de ${location} muestra patrones climáticos inusuales para la época.`,
        `Las autoridades han emitido un informe climático actualizado para ${location}.`,
        // Descripciones específicas para Córdoba
        `El pronóstico para la zona bananera de ${location} indica condiciones favorables para la cosecha.`,
        `Las condiciones climáticas en el valle del Sinú de ${location} están siendo monitoreadas por IDEAM.`,
        `El reporte meteorológico de ${location} muestra patrones climáticos que afectan la agricultura.`,
        `Las autoridades han emitido un informe climático actualizado para ${location} enfocado en el sector ganadero.`
      ]
    }
    
    const categoryDescriptions = descriptions[category as keyof typeof descriptions] || descriptions.general
    return categoryDescriptions[Math.floor(Math.random() * categoryDescriptions.length)]
  }

  private generateTags(category: string, severity: string, department: string): string[] {
    const baseTags = [category, severity, department.toLowerCase()]
    
    const additionalTags = {
      rain: ['precipitación', 'lluvia', 'inundación', 'desbordamiento'],
      wind: ['viento', 'ráfagas', 'tornado', 'huracán'],
      flood: ['inundación', 'desbordamiento', 'creciente', 'anegamiento'],
      storm: ['tormenta', 'granizo', 'rayos', 'truenos'],
      damage: ['daños', 'pérdidas', 'afectación', 'emergencia'],
      alert: ['alerta', 'emergencia', 'protocolo', 'evacuación'],
      general: ['clima', 'meteorología', 'pronóstico', 'condiciones']
    }
    
    const categoryTags = additionalTags[category as keyof typeof additionalTags] || additionalTags.general
    return [...baseTags, ...categoryTags.slice(0, 2)]
  }

  private getImageUrl(category: string): string {
    const imageUrls = {
      rain: 'https://images.unsplash.com/photo-1433863448220-78aaa064ff47?w=400&h=200&fit=crop',
      wind: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop',
      flood: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop',
      storm: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop',
      damage: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=200&fit=crop',
      alert: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=200&fit=crop',
      general: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop'
    }
    
    return imageUrls[category as keyof typeof imageUrls] || imageUrls.general
  }

  async fetchNews(): Promise<WeatherNewsResponse> {
    try {
      // En producción, esto haría llamadas reales a APIs de noticias
      // const response = await fetch(`${this.baseUrl}/news`)
      // const data = await response.json()
      
      // Por ahora, retornamos datos simulados
      const news = this.generateMockNews()
      
      return {
        news,
        lastUpdate: new Date().toISOString(),
        total: news.length,
        sources: this.sources
      }
    } catch (error) {
      console.error('Error fetching weather news:', error)
      
      // Fallback a datos simulados en caso de error
      return {
        news: this.generateMockNews().slice(0, 5),
        lastUpdate: new Date().toISOString(),
        total: 5,
        sources: this.sources.slice(0, 3)
      }
    }
  }

  async fetchNewsByCategory(category: string): Promise<WeatherNewsItem[]> {
    try {
      const response = await this.fetchNews()
      return response.news.filter(item => item.category === category)
    } catch (error) {
      console.error('Error fetching news by category:', error)
      return []
    }
  }

  async fetchNewsByDepartment(department: string): Promise<WeatherNewsItem[]> {
    try {
      const response = await this.fetchNews()
      return response.news.filter(item => 
        item.department.toLowerCase().includes(department.toLowerCase())
      )
    } catch (error) {
      console.error('Error fetching news by department:', error)
      return []
    }
  }

  async fetchNewsBySeverity(severity: string): Promise<WeatherNewsItem[]> {
    try {
      const response = await this.fetchNews()
      return response.news.filter(item => item.severity === severity)
    } catch (error) {
      console.error('Error fetching news by severity:', error)
      return []
    }
  }

  getCategories(): string[] {
    return ['rain', 'wind', 'flood', 'storm', 'damage', 'alert', 'general']
  }

  getSeverities(): string[] {
    return ['low', 'medium', 'high', 'critical']
  }

  getSources(): string[] {
    return this.sources
  }
}

export const weatherNewsAPI = new WeatherNewsAPI()
