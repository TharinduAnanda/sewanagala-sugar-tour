'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StationCard from '@/components/StationCard'
import LoadingSpinner from '@/components/LoadingSpinner'
import TourProgress from '@/components/TourProgress'
import FactoryMapTour from '@/components/FactoryMapTour'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Station } from '@/types'
import { useTour } from '@/context/TourContext'
import { FaMap, FaThLarge } from 'react-icons/fa'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

type ViewMode = 'map' | 'grid'

export default function TourPage() {
  const [stations, setStations] = useState<Station[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('map')
  const [currentStation, setCurrentStation] = useState(1)
  const { tourProgress } = useTour()
  const router = useRouter()

  useEffect(() => {
    fetchStations()
  }, [filter])

  const fetchStations = async () => {
    try {
      setLoading(true)
      const url = filter === 'all' 
        ? '/api/stations' 
        : `/api/stations?category=${filter}`
      const response = await axios.get(url)
      setStations(response.data.data)
    } catch (error) {
      console.error('Error fetching stations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStationChange = (stationNumber: number) => {
    setCurrentStation(stationNumber)
  }

  const categories = ['all', 'processing', 'machinery', 'storage', 'office', 'history']

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Virtual Factory Tour</h1>
            <p className="text-lg text-muted-foreground mb-6">
              Explore our sugar production process through 15 interactive stations
            </p>
          </div>

          {/* Tour Progress */}
          <div className="max-w-4xl mx-auto mb-8">
            <TourProgress />
          </div>

          {/* View Controls */}
          <Card className="p-4 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    onClick={() => setFilter(category)}
                    variant={filter === category ? 'default' : 'outline'}
                    size="sm"
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Button>
                ))}
              </div>

              {/* View Mode Toggle */}
              <div className="flex gap-2">
                <Button
                  onClick={() => setViewMode('map')}
                  variant={viewMode === 'map' ? 'default' : 'outline'}
                  size="sm"
                >
                  <FaMap className="mr-2" />
                  Map View
                </Button>
                <Button
                  onClick={() => setViewMode('grid')}
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                >
                  <FaThLarge className="mr-2" />
                  Grid View
                </Button>
              </div>
            </div>
          </Card>

          {/* Content Area */}
          {viewMode === 'map' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <FactoryMapTour
                currentStation={currentStation}
                onStationChange={handleStationChange}
                showControls={true}
                stations={stations}
              />
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {stations.map((station, index) => (
                <StationCard key={station.id} station={station} index={index} />
              ))}
            </div>
          )}
        </motion.div>
      </main>
      
      <Footer />
    </div>
  )
}
