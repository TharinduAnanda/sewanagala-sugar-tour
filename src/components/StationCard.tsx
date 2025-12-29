'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaCogs, FaIndustry, FaBox, FaBuilding, FaScroll, FaMapMarkerAlt, FaClock, FaCheckCircle, FaArrowRight } from 'react-icons/fa'
import { useTour } from '@/context/TourContext'
import { Station } from '@/types'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface StationCardProps {
  station: Station
  index?: number
}

export default function StationCard({ station, index = 0 }: StationCardProps) {
  const { visitedStations } = useTour()
  const isVisited = visitedStations.includes(station.id)

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, JSX.Element> = {
      processing: <FaCogs className="w-6 h-6" />,
      machinery: <FaIndustry className="w-6 h-6" />,
      storage: <FaBox className="w-6 h-6" />,
      office: <FaBuilding className="w-6 h-6" />,
      history: <FaScroll className="w-6 h-6" />
    }
    return icons[category] || <FaMapMarkerAlt className="w-6 h-6" />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <Card className={`h-full ${isVisited ? 'border-green-500' : ''}`}>
        <CardHeader>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-primary">
              Station {station.station_number}
            </span>
            {isVisited && (
              <span className="flex items-center gap-1 text-green-600 text-sm">
                <FaCheckCircle />
                <span>Visited</span>
              </span>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col items-center text-center mb-4">
            <div className="mb-4 text-primary">
              {getCategoryIcon(station.category)}
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-2">{station.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {station.description}
            </p>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center gap-1 text-muted-foreground">
              <FaClock />
              <span>{station.duration_minutes} min</span>
            </span>
            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
              {station.category}
            </span>
          </div>
        </CardContent>
        
        <CardFooter>
          <Link href={`/station/${station.id}`} className="w-full">
            <Button className="w-full group">
              <span>View Details</span>
              <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
