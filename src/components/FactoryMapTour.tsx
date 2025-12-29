'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { STATION_MAP_POSITIONS, getStationPosition, TOTAL_STATIONS } from '@/lib/mapCoordinates'
import FootprintTrail from '@/components/FootprintTrail'
import { FaArrowLeft, FaArrowRight, FaInfoCircle } from 'react-icons/fa'

interface FactoryMapTourProps {
  currentStation: number
  onStationChange?: (stationNumber: number) => void
  showControls?: boolean
  stations?: any[]
}

// Station descriptions - 12 stations total
const STATION_DESCRIPTIONS: Record<number, string> = {
  1: 'Welcome to the Reception and Visitor Center! This is where your tour begins. Here you\'ll receive safety equipment, an introduction to the factory\'s history, and an overview of the sugar production process.',
  2: 'The Sugarcane Unloading Bay is where trucks deliver fresh sugarcane from local farms. Watch as sugarcane is weighed and unloaded using specialized equipment designed to handle large volumes efficiently.',
  3: 'At the Cane Preparation Area, sugarcane undergoes initial processing. The canes are cleaned, chopped into smaller pieces, and prepared for the milling process. This ensures optimal juice extraction.',
  4: 'The Milling Station is the heart of juice extraction. Powerful rollers crush the prepared cane to extract the maximum amount of juice. The remaining fibrous material (bagasse) is collected for other uses.',
  5: 'In the Juice Clarification Plant, the extracted juice is heated and treated with lime to remove impurities. The clarified juice is then ready for concentration in the evaporation process.',
  6: 'The Evaporation Station uses multiple-effect evaporators to remove excess water from the clarified juice, concentrating it into a thick syrup. This energy-efficient process is crucial for sugar crystallization.',
  7: 'At the Crystallization Area, the concentrated syrup is carefully heated and seeded to form sugar crystals. This controlled process determines the quality and size of the final sugar crystals.',
  8: 'Centrifugal Separation uses high-speed spinning to separate sugar crystals from the remaining molasses. The crystals are washed and prepared for drying while molasses is collected as a by-product.',
  9: 'The Sugar Drying and Cooling facility ensures the separated sugar crystals reach the right moisture content and temperature. This is essential for proper storage and prevents clumping.',
  10: 'Our Quality Control Laboratory conducts rigorous testing of sugar samples throughout production. Tests include purity, color, moisture content, and granulation to ensure the highest standards.',
  11: 'The modern Packaging Line automatically weighs, packages, and seals sugar into various sizes for retail and industrial use. Watch as finished products are prepared for distribution.',
  12: 'The Warehouse and Storage facility maintains optimal conditions for storing packaged sugar. Advanced inventory management systems track products until they\'re shipped to customers nationwide.'
}

export default function FactoryMapTour({ 
  currentStation, 
  onStationChange,
  showControls = true,
  stations = []
}: FactoryMapTourProps) {
  const router = useRouter()
  const currentPos = getStationPosition(currentStation)
  const previousStation = currentStation > 1 ? currentStation - 1 : null
  const nextStation = currentStation < TOTAL_STATIONS ? currentStation + 1 : null

  const handlePrevious = () => {
    if (previousStation && onStationChange) {
      onStationChange(previousStation)
    }
  }

  const handleNext = () => {
    if (nextStation && onStationChange) {
      onStationChange(nextStation)
    }
  }

  const handleMoreDetails = () => {
    const station = stations.find(s => s.station_number === currentStation)
    if (station) {
      router.push(`/station/${station.id}`)
    } else {
      // Fallback: navigate using station number
      router.push(`/station/${currentStation}`)
    }
  }

  return (
    <div className="w-full space-y-6">
      {/* Map Container - Responsive with proper aspect ratio */}
      <Card className="overflow-hidden bg-gray-900">
        <div className="relative w-full" style={{ aspectRatio: '3541/1850' }}>
          <div className="relative w-full h-full">
            <Image
              src="/images/MAP_LAYOUT.png"
              alt="Factory Map Layout"
              fill
              className="object-contain"
              priority
            />

            {/* Station Markers - Positioned at footpath points with flashing animation */}
            {STATION_MAP_POSITIONS.map((station) => {
              const isActive = station.stationNumber === currentStation
              const isVisited = station.stationNumber < currentStation
              const isUpcoming = station.stationNumber > currentStation

              return (
                <motion.div
                  key={station.stationNumber}
                  className="absolute"
                  style={{
                    left: `${station.x}%`,
                    top: `${station.y}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: isActive ? 20 : 10
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1 
                  }}
                  transition={{ 
                    delay: station.stationNumber * 0.05,
                    type: 'spring',
                    stiffness: 200
                  }}
                >
                  <motion.div
                    className={`
                      relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full
                      transition-all duration-300
                      ${isActive ? 'bg-primary shadow-2xl shadow-primary/60 border-3 border-white ring-8 ring-primary/20 transition-all duration-300 hover:scale-110 scale-125 sm:scale-150' : ''}
                      ${isVisited ? 'bg-emerald-500 shadow-lg shadow-emerald-500/60 border-2 border-white' : ''}
                      ${isUpcoming ? 'bg-muted border-2 border-muted-foreground/50' : ''}
                    `}
                    // Add flashing animation ONLY to active station
                    animate={isActive ? {
                      opacity: [1, 0.5, 1],
                    } : {}}
                    transition={isActive ? {
                      duration: 1,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    } : {}}
                  >
                    <span className="text-white font-bold text-xs sm:text-sm">
                      {station.stationNumber}
                    </span>

                    {/* Active Station Pulse Effect */}
                    {isActive && (
                      <>
                        <motion.div
                          className="absolute inset-0 rounded-full bg-primary"
                          initial={{ scale: 1, opacity: 0.6 }}
                          animate={{ scale: 2.5, opacity: 0 }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: 'easeOut'
                          }}
                        />
                        <motion.div
                          className="absolute inset-0 rounded-full bg-primary/80"
                          initial={{ scale: 1, opacity: 0.4 }}
                          animate={{ scale: 2, opacity: 0 }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: 'easeOut',
                            delay: 0.3
                          }}
                        />
                      </>
                    )}
                  </motion.div>

                  {/* Station Label */}
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                    >
                      <div className="bg-primary text-primary-foreground px-3 py-1 rounded-lg shadow-xl text-xs font-bold border-2 border-white">
                        {station.name}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )
            })}

            {STATION_MAP_POSITIONS.map((station, index) => {
              if (index === 0) return null
              const prevStation = STATION_MAP_POSITIONS[index - 1]
              const isPathActive = station.stationNumber <= currentStation
              
              if (!isPathActive) return null
              
              return (
                <FootprintTrail
                  key={`footprint-trail-${station.stationNumber}`}
                  startX={prevStation.x}
                  startY={prevStation.y}
                  endX={station.x}
                  endY={station.y}
                />
              )
            })}


            {/* Legend */}
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/95 backdrop-blur rounded-lg shadow-lg p-2 sm:p-3 text-[10px] sm:text-xs">
              <div className="font-semibold mb-2">Legend</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/60 border-2 border-white"></div>
                  <span>Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-primary border border-white"></div>
                  <span>Current</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-muted border-2 border-muted-foreground/50"></div>
                  <span>Upcoming</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Navigation Controls */}
      {showControls && (
        <Card className="bg-white shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <Button
                onClick={handlePrevious}
                disabled={!previousStation}
                variant="outline"
                size="lg"
                className="w-full sm:flex-1 h-12 sm:h-14"
              >
                <FaArrowLeft className="mr-2" />
                Previous Station
              </Button>

              <div className="text-center px-4 sm:px-6 order-first sm:order-none">
                <div className="text-xl sm:text-xl sm:text-2xl font-bold text-primary">
                  Station {currentStation}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">
                  of {TOTAL_STATIONS}
                </div>
              </div>

              <Button
                onClick={handleNext}
                disabled={!nextStation}
                variant="outline"
                size="lg"
                className="w-full sm:flex-1 h-12 sm:h-14"
              >
                Next Station
                <FaArrowRight className="ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Station Description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStation}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-primary/5 to-background border-2 border-primary/20 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg">
                    {currentStation}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
                    {currentPos?.name}
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-4">
                    {STATION_DESCRIPTIONS[currentStation]}
                  </p>
                  <Button
                    onClick={handleMoreDetails}
                    className="bg-primary hover:bg-primary/90 text-white"
                    size="lg"
                  >
                    <FaInfoCircle className="mr-2" />
                    More Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
