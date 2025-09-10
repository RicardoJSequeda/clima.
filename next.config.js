/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['openweathermap.org', 'api.open-meteo.com'],
  },
  // Configuración de Seguridad
  poweredByHeader: false,
  compress: true,
}

module.exports = nextConfig
