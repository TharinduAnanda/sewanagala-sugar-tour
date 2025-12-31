'use client'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Station, MediaItem } from '@/types'
import { useTour } from '@/context/TourContext'
import MediaViewer from '@/components/MediaViewer'
import { FaArrowLeft, FaArrowRight, FaClock, FaCheckCircle } from 'react-icons/fa'

export default function StationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [station, setStation] = useState<Station | null>(null)
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const { markStationVisited, visitedStations } = useTour()

  useEffect(() => {
    if (params.id) {
      fetchStationDetails()
    }
  }, [params.id])

  const fetchStationDetails = async () => {
    try {
      setLoading(true)
      const [stationRes, mediaRes] = await Promise.all([
        axios.get(`/api/stations/${params.id}`),
        axios.get(`/api/media/${params.id}`)
      ])
      
      setStation(stationRes.data.data)
      setMedia(mediaRes.data.data)
      
      // Mark as visited
      markStationVisited(Number(params.id))
    } catch (error) {
      console.error('Error fetching station details:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />
  if (!station) return <div>Station not found</div>

  const isVisited = visitedStations.includes(station.id)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6"
          >
            <FaArrowLeft className="mr-2" />
            Back to Tour
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-sm font-semibold text-primary mb-2 block">
                        Station {station.station_number}
                      </span>
                      <h1 className="text-3xl font-bold mb-2">{station.name}</h1>
                    </div>
                    {isVisited && (
                      <span className="flex items-center gap-2 text-green-600">
                        <FaCheckCircle />
                        <span>Visited</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FaClock />
                      {station.duration_minutes} minutes
                    </span>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                      {station.category}
                    </span>
                  </div>

                  <p className="text-lg leading-relaxed mb-6">
                    {station.description}
                  </p>

                  {/* Media Gallery */}
                  {media.length > 0 && (
                    <MediaViewer media={media} />
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Navigation</h3>
                  <div className="space-y-3">
                    {station.station_number > 1 && (
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                        onClick={() => router.push(`/station/${station.id - 1}`)}
                      >
                        <FaArrowLeft />
                        <span>Previous Station</span>
                        <span></span>
                      </Button>
                    )}
                    {station.station_number < 14 && (
                      <Button
                        className="w-full justify-between"
                        onClick={() => router.push(`/station/${station.id + 1}`)}
                      >
                        <span></span>
                        <span>Next Station</span>
                        <FaArrowRight />
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={() => router.push('/tour')}
                    >
                      Back to All Stations
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  )
}
