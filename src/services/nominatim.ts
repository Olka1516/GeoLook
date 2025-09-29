import http from '../http'

export const getTownsByСontours = async (lat: number, lon: number) => {
  const data = await http.get(
    `/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=10&polygon_geojson=1&accept-language=uk`,
  )
  return data.data
}

export const getTownDetails = async (placeId: number) => {
  const data = await http.get(
    `/details?place_id=${placeId}&featuretype=city&polygon_geojson=1&format=json&addressdetails=1&accept-language=uk`,
  )
  return data.data
}
