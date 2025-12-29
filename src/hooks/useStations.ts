import { useState, useEffect } from 'react'
import axios from 'axios'
import { Station } from '@/types'

export function useStations(category?: string) {
  const [stations, setStations] = useState<Station[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStations = async () => {
      try {
        setLoading(true)
        setError(null)
        const url = category && category !== 'all'
          ? `/api/stations?category=${category}`
          : '/api/stations'
        const response = await axios.get(url)
        setStations(response.data.data || [])
      } catch (err) {
        setError('Failed to load stations')
        console.error('Error fetching stations:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStations()
  }, [category])

  return { stations, loading, error, refetch: () => {} }
}
