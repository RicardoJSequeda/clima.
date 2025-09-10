import { TourConfig } from '@/hooks/useIntroTour'

// Tour de bienvenida para nuevos usuarios
export const welcomeTour: TourConfig = {
  steps: [
    {
      element: '[data-tour="search-bar"]',
      intro: `
        <div class="text-center">
          <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
            🌤️ ¡Bienvenido a El Tiempo Hoy!
          </h3>
          <p class="text-sm text-slate-600 dark:text-slate-400">
            Aquí puedes buscar cualquier ciudad de Colombia para ver el clima en tiempo real.
          </p>
        </div>
      `,
      position: 'bottom',
      tooltipClass: 'introjs-tooltip-welcome'
    },
    {
      element: '[data-tour="location-button"]',
      intro: `
        <div class="text-center">
          <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
            📍 Ubicación Automática
          </h3>
          <p class="text-sm text-slate-600 dark:text-slate-400">
            Haz clic aquí para obtener automáticamente el clima de tu ubicación actual.
          </p>
        </div>
      `,
      position: 'bottom',
      tooltipClass: 'introjs-tooltip-feature'
    },
    {
      element: '[data-tour="notifications"]',
      intro: `
        <div class="text-center">
          <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
            🔔 Alertas Meteorológicas
          </h3>
          <p class="text-sm text-slate-600 dark:text-slate-400">
            Recibe notificaciones en tiempo real sobre alertas meteorológicas importantes.
          </p>
        </div>
      `,
      position: 'bottom',
      tooltipClass: 'introjs-tooltip-feature'
    },
    {
      element: '[data-tour="weather-map"]',
      intro: `
        <div class="text-center">
          <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
            🗺️ Mapa Interactivo
          </h3>
          <p class="text-sm text-slate-600 dark:text-slate-400">
            Explora el mapa meteorológico interactivo con marcadores de ciudades y datos en tiempo real.
          </p>
        </div>
      `,
      position: 'top',
      tooltipClass: 'introjs-tooltip-feature'
    },
    {
      element: '[data-tour="current-weather"]',
      intro: `
        <div class="text-center">
          <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
            🌡️ Clima Actual
          </h3>
          <p class="text-sm text-slate-600 dark:text-slate-400">
            Ve información detallada del clima actual: temperatura, humedad, viento, presión y más.
          </p>
        </div>
      `,
      position: 'left',
      tooltipClass: 'introjs-tooltip-feature'
    },
    {
      element: '[data-tour="weather-forecast"]',
      intro: `
        <div class="text-center">
          <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
            📅 Pronóstico 7 Días
          </h3>
          <p class="text-sm text-slate-600 dark:text-slate-400">
            Consulta el pronóstico del clima para los próximos 7 días con animaciones realistas.
          </p>
        </div>
      `,
      position: 'top',
      tooltipClass: 'introjs-tooltip-feature'
    },
    {
      element: '[data-tour="weather-news"]',
      intro: `
        <div class="text-center">
          <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
            📰 Noticias del Clima
          </h3>
          <p class="text-sm text-slate-600 dark:text-slate-400">
            Mantente informado con las últimas noticias meteorológicas y eventos climáticos.
          </p>
        </div>
      `,
      position: 'top',
      tooltipClass: 'introjs-tooltip-feature'
    }
  ],
  showProgress: true,
  showBullets: true,
  showStepNumbers: true,
  nextLabel: 'Siguiente',
  prevLabel: 'Anterior',
  skipLabel: 'Saltar Tour',
  doneLabel: '¡Comenzar!',
  tooltipPosition: 'auto',
  exitOnEsc: true,
  exitOnOverlayClick: false,
  keyboardNavigation: true,
  scrollToElement: true,
  scrollPadding: 20,
}

// Tour específico para funcionalidades avanzadas
export const advancedFeaturesTour: TourConfig = {
  steps: [
    {
      element: '[data-tour="search-history"]',
      intro: `
        <div class="text-center">
          <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
            📚 Historial de Búsquedas
          </h3>
          <p class="text-sm text-slate-600 dark:text-slate-400">
            Tus búsquedas recientes se guardan automáticamente para acceso rápido.
          </p>
        </div>
      `,
      position: 'bottom',
      tooltipClass: 'introjs-tooltip-advanced'
    },
    {
      element: '[data-tour="city-list"]',
      intro: `
        <div class="text-center">
          <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
            🏙️ Múltiples Ciudades
          </h3>
          <p class="text-sm text-slate-600 dark:text-slate-400">
            Agrega varias ciudades para comparar el clima entre diferentes ubicaciones.
          </p>
        </div>
      `,
      position: 'bottom',
      tooltipClass: 'introjs-tooltip-advanced'
    },
    {
      element: '[data-tour="map-markers"]',
      intro: `
        <div class="text-center">
          <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
            📍 Marcadores del Mapa
          </h3>
          <p class="text-sm text-slate-600 dark:text-slate-400">
            Haz clic en los marcadores del mapa para ver información rápida del clima.
          </p>
        </div>
      `,
      position: 'top',
      tooltipClass: 'introjs-tooltip-advanced'
    },
    {
      element: '[data-tour="weather-details"]',
      intro: `
        <div class="text-center">
          <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
            📊 Métricas Detalladas
          </h3>
          <p class="text-sm text-slate-600 dark:text-slate-400">
            Explora métricas avanzadas como índice UV, visibilidad, presión atmosférica y más.
          </p>
        </div>
      `,
      position: 'left',
      tooltipClass: 'introjs-tooltip-advanced'
    }
  ],
  showProgress: true,
  showBullets: true,
  showStepNumbers: true,
  nextLabel: 'Siguiente',
  prevLabel: 'Anterior',
  skipLabel: 'Saltar',
  doneLabel: 'Entendido',
  tooltipPosition: 'auto',
  exitOnEsc: true,
  exitOnOverlayClick: false,
  keyboardNavigation: true,
  scrollToElement: true,
  scrollPadding: 20,
}

// Tour para alertas meteorológicas
export const alertsTour: TourConfig = {
  steps: [
    {
      element: '[data-tour="notifications"]',
      intro: `
        <div class="text-center">
          <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
            🚨 Sistema de Alertas
          </h3>
          <p class="text-sm text-slate-600 dark:text-slate-400">
            Haz clic en el icono de notificaciones para ver alertas meteorológicas en tiempo real.
          </p>
        </div>
      `,
      position: 'bottom',
      tooltipClass: 'introjs-tooltip-alerts'
    },
    {
      element: '[data-tour="alert-types"]',
      intro: `
        <div class="text-center">
          <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
            ⚠️ Tipos de Alertas
          </h3>
          <p class="text-sm text-slate-600 dark:text-slate-400">
            Recibe alertas sobre: calor extremo, lluvias intensas, vientos fuertes, tormentas y más.
          </p>
        </div>
      `,
      position: 'bottom',
      tooltipClass: 'introjs-tooltip-alerts'
    },
    {
      element: '[data-tour="browser-notifications"]',
      intro: `
        <div class="text-center">
          <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
            🔔 Notificaciones del Navegador
          </h3>
          <p class="text-sm text-slate-600 dark:text-slate-400">
            Las alertas críticas también aparecerán como notificaciones nativas del navegador.
          </p>
        </div>
      `,
      position: 'bottom',
      tooltipClass: 'introjs-tooltip-alerts'
    }
  ],
  showProgress: true,
  showBullets: true,
  showStepNumbers: true,
  nextLabel: 'Siguiente',
  prevLabel: 'Anterior',
  skipLabel: 'Saltar',
  doneLabel: 'Entendido',
  tooltipPosition: 'auto',
  exitOnEsc: true,
  exitOnOverlayClick: false,
  keyboardNavigation: true,
  scrollToElement: true,
  scrollPadding: 20,
}

// Configuración de hints (pistas visuales)
export const hintsConfig = [
  {
    element: '[data-tour="search-bar"]',
    hint: '¡Busca tu ciudad aquí!',
    hintPosition: 'top-middle'
  },
  {
    element: '[data-tour="location-button"]',
    hint: 'Obtén tu ubicación automáticamente',
    hintPosition: 'top-middle'
  },
  {
    element: '[data-tour="notifications"]',
    hint: 'Revisa las alertas meteorológicas',
    hintPosition: 'top-middle'
  }
]
