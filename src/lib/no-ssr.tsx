'use client'

import dynamic from 'next/dynamic'
import { ReactNode } from 'react'

interface NoSSRProps {
  children: ReactNode
  fallback?: ReactNode
}

// Componente que desactiva el renderizado del lado del servidor
export const NoSSR = dynamic(() => Promise.resolve(({ children }: NoSSRProps) => <>{children}</>), {
  ssr: false,
  loading: () => <div>Cargando...</div>
})

export default NoSSR
