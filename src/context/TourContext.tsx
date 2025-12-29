'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Station } from '@/types'

interface TourContextType {
  visitedStations: number[]
  currentStation: number | null
  tourProgress: number
  markStationVisited: (stationId: number) => void
  setCurrentStation: (stationId: number | null) => void
  resetTour: () => void
}

const TourContext = createContext<TourContextType | undefined>(undefined)

export function TourProvider({ children }: { children: ReactNode }) {
  const [visitedStations, setVisitedStations] = useState<number[]>([])
  const [currentStation, setCurrentStation] = useState<number | null>(null)
  const [tourProgress, setTourProgress] = useState(0)
  const [mounted, setMounted] = useState(false)

  // Only access localStorage after component mounts (client-side only)
  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tourProgress')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          setVisitedStations(data.visitedStations || [])
          setCurrentStation(data.currentStation || null)
        } catch (error) {
          console.error('Error loading tour progress:', error)
        }
      }
    }
  }, [])

  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      localStorage.setItem('tourProgress', JSON.stringify({
        visitedStations,
        currentStation
      }))
      setTourProgress((visitedStations.length / 14) * 100)
    }
  }, [visitedStations, currentStation, mounted])

  const markStationVisited = (stationId: number) => {
    if (!visitedStations.includes(stationId)) {
      setVisitedStations([...visitedStations, stationId])
    }
  }

  const resetTour = () => {
    setVisitedStations([])
    setCurrentStation(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tourProgress')
    }
  }

  return (
    <TourContext.Provider value={{
      visitedStations,
      currentStation,
      tourProgress,
      markStationVisited,
      setCurrentStation,
      resetTour
    }}>
      {children}
    </TourContext.Provider>
  )
}

export function useTour() {
  const context = useContext(TourContext)
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider')
  }
  return context
}
