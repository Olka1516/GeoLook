import type { Ref } from 'vue'
import type { City, Poligon } from './nominatim'

export type IdType = string | undefined
export type CoordinatesType = [number, number][]

export interface NominatimStore {
  towns: Ref<City[]>
  townsDetails: Record<string, City>
  getDetails(id: number): Promise<City>
  getTowns(poligons: Poligon): Promise<void>
}

export interface PoligonStore {
  polygons: Poligon
  colors: string[]
  getPolygons(): void
}

export interface Shape {
  type: 'Polygon' | 'LineString'
  coords: [number, number][]
}
