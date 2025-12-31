'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { STATION_MAP_POSITIONS } from '@/lib/mapCoordinates'

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'

export default function AdjustMapPosition() {
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [scale, setScale] = useState(100)

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Map Position Adjustment Tool</h1>
      
      {/* Controls */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* X Offset */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Horizontal Offset (X): {offsetX}%
              </label>
              <input
                type="range"
                min="-50"
                max="50"
                step="0.5"
                value={offsetX}
                onChange={(e) => setOffsetX(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex gap-2 mt-2">
                <Button size="sm" onClick={() => setOffsetX(offsetX - 1)}>← -1</Button>
                <Button size="sm" onClick={() => setOffsetX(offsetX + 1)}>+1 →</Button>
                <Button size="sm" variant="outline" onClick={() => setOffsetX(0)}>Reset</Button>
              </div>
            </div>

            {/* Y Offset */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Vertical Offset (Y): {offsetY}%
              </label>
              <input
                type="range"
                min="-50"
                max="50"
                step="0.5"
                value={offsetY}
                onChange={(e) => setOffsetY(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex gap-2 mt-2">
                <Button size="sm" onClick={() => setOffsetY(offsetY - 1)}>↑ -1</Button>
                <Button size="sm" onClick={() => setOffsetY(offsetY + 1)}>+1 ↓</Button>
                <Button size="sm" variant="outline" onClick={() => setOffsetY(0)}>Reset</Button>
              </div>
            </div>

            {/* Scale */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Scale: {scale}%
              </label>
              <input
                type="range"
                min="80"
                max="120"
                step="1"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex gap-2 mt-2">
                <Button size="sm" onClick={() => setScale(scale - 5)}>-5%</Button>
                <Button size="sm" onClick={() => setScale(scale + 5)}>+5%</Button>
                <Button size="sm" variant="outline" onClick={() => setScale(100)}>Reset</Button>
              </div>
            </div>
          </div>

          {/* Code Output */}
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm font-semibold mb-2">CSS to apply in FactoryMapTour.tsx:</p>
            <code className="text-xs">
              style=&#123;&#123; objectPosition: '{offsetX >= 0 ? '+' : ''}{offsetX}% {offsetY >= 0 ? '+' : ''}{offsetY}%', transform: 'scale({scale / 100})' &#125;&#125;
            </code>
          </div>
        </CardContent>
      </Card>

      {/* Map Preview */}
      <Card className="overflow-hidden bg-gray-900">
        <div className="relative w-full" style={{ aspectRatio: '3541/1850' }}>
          <div className="relative w-full h-full">
            <Image
              src="/images/MAP_LAYOUT.png"
              alt="Factory Map Layout"
              fill
              className="object-contain"
              style={{
                objectPosition: `${50 + offsetX}% ${50 + offsetY}%`,
                transform: `scale(${scale / 100})`
              }}
              priority
            />

            {/* Station Markers */}
            {STATION_MAP_POSITIONS.map((station) => (
              <div
                key={station.stationNumber}
                className="absolute"
                style={{
                  left: `${station.x}%`,
                  top: `${station.y}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10
                }}
              >
                <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-red-500 border-2 border-white shadow-lg">
                  <span className="text-white font-bold text-sm">
                    {station.stationNumber}
                  </span>
                </div>
                <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <div className="bg-white px-2 py-1 rounded shadow-lg text-xs font-bold">
                    {station.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Instructions */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-3">Instructions:</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Adjust the sliders to move the image until markers align with the map</li>
            <li>Use the fine-tune buttons for precise adjustments</li>
            <li>Copy the CSS code above when you're happy with the alignment</li>
            <li>Apply it to line 77 in <code className="bg-gray-100 px-2 py-1 rounded">src/components/FactoryMapTour.tsx</code></li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
