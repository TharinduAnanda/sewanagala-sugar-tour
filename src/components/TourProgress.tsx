'use client'

import { motion } from 'framer-motion'
import { useTour } from '@/context/TourContext'
import { FaCheckCircle, FaCircle } from 'react-icons/fa'

export default function TourProgress() {
  const { tourProgress, visitedStations } = useTour()

  return (
    <div className="bg-card border rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">Your Tour Progress</h3>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Stations Visited</span>
          <span className="text-sm font-medium">{visitedStations.length} / 14</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-4 overflow-hidden">
          <motion.div
            className="bg-primary h-full"
            initial={{ width: 0 }}
            animate={{ width: `${tourProgress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {Math.round(tourProgress)}% Complete
        </p>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 14 }, (_, i) => i + 1).map((num) => (
          <div
            key={num}
            className="flex flex-col items-center"
          >
            {visitedStations.includes(num) ? (
              <FaCheckCircle className="text-green-500 text-2xl" />
            ) : (
              <FaCircle className="text-muted-foreground text-2xl opacity-30" />
            )}
            <span className="text-xs mt-1">{num}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
