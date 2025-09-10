'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Error:', error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold mb-2">Algo salió mal</h2>
        <p className="text-muted-foreground mb-6">
          No se pudieron cargar los datos meteorológicos. Por favor, intenta de nuevo.
        </p>
        <div className="space-x-4">
          <Button onClick={reset} className="inline-flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>Intentar de nuevo</span>
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Recargar página
          </Button>
        </div>
      </div>
    </div>
  )
}
