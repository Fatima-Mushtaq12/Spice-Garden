import { Loader } from '@googlemaps/js-api-loader'

let loader: Loader | null = null

export function getMapsLoader(): Loader {
  if (!loader) {
    loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
      version: 'weekly',
      libraries: ['places', 'geometry'],
    })
  }
  return loader
}

export const RESTAURANT_LOCATION = {
  lat: 31.5204,
  lng: 74.3587,
  address: '45 MM Alam Road, Gulberg III, Lahore, Punjab 54000',
}

export const DELIVERY_RADIUS_KM = 10

export function calculateDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function isWithinDeliveryZone(lat: number, lng: number): boolean {
  const dist = calculateDistance(
    RESTAURANT_LOCATION.lat,
    RESTAURANT_LOCATION.lng,
    lat,
    lng
  )
  return dist <= DELIVERY_RADIUS_KM
}
