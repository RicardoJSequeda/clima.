/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración de Seguridad
  poweredByHeader: false,
  compress: true,
  // Configuración para exportación estática
  output: 'export',
  trailingSlash: true,
  // Deshabilitar optimizaciones que requieren servidor
  images: {
    unoptimized: true,
    domains: ['openweathermap.org', 'api.open-meteo.com'],
  },
}

module.exports = nextConfig
