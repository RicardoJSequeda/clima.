declare module 'leaflet' {
  export interface MapOptions {
    center?: [number, number]
    zoom?: number
    maxZoom?: number
    attribution?: string
  }

  export interface IconOptions {
    iconUrl?: string
    iconRetinaUrl?: string
    iconSize?: [number, number]
    iconAnchor?: [number, number]
    popupAnchor?: [number, number]
    shadowUrl?: string
    shadowSize?: [number, number]
  }

  export interface MarkerOptions {
    icon?: Icon
  }

  export interface PopupOptions {
    content?: string
  }

  export class Map {
    constructor(container: HTMLElement, options?: MapOptions)
    setView(center: [number, number], zoom: number): Map
    remove(): void
    fitBounds(bounds: any, options?: any): Map
  }

  export class TileLayer {
    constructor(urlTemplate: string, options?: any)
    addTo(map: Map): TileLayer
  }

  export class Marker {
    constructor(latLng: [number, number], options?: MarkerOptions)
    bindPopup(content: string, options?: PopupOptions): Marker
    addTo(map: Map): Marker
    setIcon(icon: Icon): Marker
    on(event: string, handler: () => void): Marker
  }

  export class Icon {
    constructor(options: IconOptions)
  }

  export class featureGroup {
    constructor(layers: any[])
    getBounds(): any
  }

  export namespace Icon {
    namespace Default {
      function mergeOptions(options: IconOptions): void
    }
  }

  export function map(container: HTMLElement, options?: MapOptions): Map
  export function tileLayer(urlTemplate: string, options?: any): TileLayer
  export function marker(latLng: [number, number], options?: MarkerOptions): Marker
  export function icon(options: IconOptions): Icon
  export function featureGroup(layers: any[]): featureGroup

  const L: {
    map: typeof map
    tileLayer: typeof tileLayer
    marker: typeof marker
    icon: typeof icon
    featureGroup: typeof featureGroup
    Map: typeof Map
    TileLayer: typeof TileLayer
    Marker: typeof Marker
    Icon: typeof Icon
    featureGroup: typeof featureGroup
  }

  export default L
}

declare module 'leaflet.markercluster' {
  // MarkerClusterGroup types would go here if needed
  const MarkerClusterGroup: any
  export default MarkerClusterGroup
}
