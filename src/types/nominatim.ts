export interface City {
  display_name: string
  place_id: number
  parent_place_id: number
  osm_type: string
  osm_id: number
  category: string
  type: string
  admin_level: number
  localname: string
  names: Names
  addresstags: unknown
  country_code: string
  indexed_date: string
  importance: number
  calculated_importance: number
  extratags: Extratags
  calculated_wikipedia: string
  rank_address: number
  rank_search: number
  isarea: boolean
  centroid: Centroid
  geometry: Geometry
  icon: string
  address: Address[]
}

export interface Names {
  name: string
  'name:uk': string
}

export interface Extratags {
  place: string
  katotth: string
  wikidata: string
  wikipedia: string
}

export interface Centroid {
  type: string
  coordinates: number[]
}

export type Geometry = PolygonGeometry | MultiPolygonGeometry | LineStringGeometry

type PolygonGeometry = { type: 'Polygon'; coordinates: [number, number][][] }
type MultiPolygonGeometry = { type: 'MultiPolygon'; coordinates: [number, number][][][] }
type LineStringGeometry = { type: 'LineString'; coordinates: [number, number][] }

export interface Address {
  localname: string
  place_id?: number
  osm_id?: number
  osm_type?: string
  class: string
  type: string
  admin_level?: number
  rank_address: number
  distance: number
  isaddress: boolean
}

export type Poligon = number[][][]
