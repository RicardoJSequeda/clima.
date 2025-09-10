export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container py-4 px-4">
        <div className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              © 2025 Clima Colombia. Datos meteorológicos proporcionados por{' '}
              <a
                href="https://open-meteo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-4"
              >
                Open-Meteo
              </a>
              .
            </p>
          </div>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>Desarrollado con ❤️ para Colombia</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
