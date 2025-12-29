import { useState, useEffect } from 'react'
import axios from 'axios'
import { MediaItem } from '@/types'

export function useMediaGallery(stationId: number | null) {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!stationId) return

    const fetchMedia = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await axios.get(`/api/media/${stationId}`)
        setMedia(response.data.data || [])
      } catch (err) {
        setError('Failed to load media')
        console.error('Error fetching media:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMedia()
  }, [stationId])

  return { media, loading, error }
}
