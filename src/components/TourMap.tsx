'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Station } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { FaMapMarkerAlt } from 'react-icons/fa'

interface TourMapProps {
  stations: Station[]
  currentStation?: number | null
  onStationClick?: (station: Station) => void
}

export default function TourMap({ stations, currentStation, onStationClick }: TourMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Dynamically import Leaflet only on client-side
    const loadMap = async () => {
      const L = await import('leaflet')
      require('leaflet/dist/leaflet.css')

      if (!mapRef.current) return

      // Initialize map
      const map = L.map(mapRef.current).setView([6.8857, 81.3024], 15)

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map)

      // Add markers for each station
      stations.forEach((station) => {
        if (station.latitude && station.longitude) {
          const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div class="marker-content ${currentStation === station.id ? 'active' : ''}">
                    <div class="marker-number">${station.station_number}</div>
                   </div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 40]
          })

          const marker = L.marker([station.latitude, station.longitude], { icon })
            .addTo(map)
            .bindPopup(`
              <div class="station-popup">
                <h3>${station.name}</h3>
                <p>${station.description.substring(0, 100)}...</p>
              </div>
            `)

          marker.on('click', () => {
            if (onStationClick) {
              onStationClick(station)
            }
          })
        }
      })

      setMapLoaded(true)
    }

    loadMap()
  }, [stations, currentStation, onStationClick])

  return (
    <Card className="w-full">
      <CardContent className="p-0">
        <div 
          ref={mapRef} 
          className="w-full h-[500px] rounded-lg"
          style={{ zIndex: 0 }}
        />
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// CSS for custom markers (add to globals.css)
export const mapStyles = `
  .custom-marker {
    background: transparent;
    border: none;
  }

  .marker-content {
    width: 40px;
    height: 40px;
    background: white;
    border: 3px solid #3b82f6;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    cursor: pointer;
    transition: all 0.3s;
  }

  .marker-content:hover {
    transform: rotate(-45deg) scale(1.2);
    box-shadow: 0 6px 12px rgba(0,0,0,0.2);
  }

  .marker-content.active {
    background: #3b82f6;
    border-color: #1e40af;
  }

  .marker-number {
    transform: rotate(45deg);
    font-weight: bold;
    font-size: 14px;
    color: #3b82f6;
  }

  .marker-content.active .marker-number {
    color: white;
  }

  .station-popup h3 {
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .station-popup p {
    font-size: 0.875rem;
    color: #666;
  }
`
