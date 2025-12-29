import { useState, useEffect } from 'react'

interface GeolocationState {
  latitude: number | null
  longitude: number | null
  error: string | null
  loading: boolean
}

export function useGeolocation() {
  const [location, setLocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  })

  useEffect(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocation({
        latitude: null,
        longitude: null,
        error: 'Geolocation is not supported by your browser',
        loading: false,
      })
      return
    }

    const success = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
        loading: false,
      })
    }

    const error = (err: GeolocationPositionError) => {
      setLocation({
        latitude: null,
        longitude: null,
        error: err.message,
        loading: false,
      })
    }

    navigator.geolocation.getCurrentPosition(success, error)
  }, [])

  return location
}
