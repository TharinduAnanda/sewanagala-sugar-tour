'use client';


import { useState } from 'react';
import Image from 'next/image';

interface Station {
  id: number;
  station_number: number;
  name: string;
  map_x: number;
  map_y: number;
}

const initialStations: Station[] = [
  { id: 1, station_number: 1, name: 'Reception and Visitor Center', map_x: 5100, map_y: 80 },
  { id: 2, station_number: 2, name: 'Sugarcane Unloading Bay', map_x: 180, map_y: 120 },
  { id: 3, station_number: 3, name: 'Cane Preparation Area', map_x: 250, map_y: 140 },
  { id: 4, station_number: 4, name: 'Milling Station', map_x: 320, map_y: 160 },
  { id: 5, station_number: 5, name: 'Juice Clarification Plant', map_x: 380, map_y: 200 },
  { id: 6, station_number: 6, name: 'Evaporation Station', map_x: 450, map_y: 240 },
  { id: 7, station_number: 7, name: 'Crystallization Area', map_x: 520, map_y: 280 },
  { id: 8, station_number: 8, name: 'Centrifugal Separation', map_x: 580, map_y: 320 },
  { id: 9, station_number: 9, name: 'Sugar Drying and Cooling', map_x: 640, map_y: 280 },
  { id: 10, station_number: 10, name: 'Quality Control Laboratory', map_x: 700, map_y: 240 },
  { id: 11, station_number: 11, name: 'Packaging Line', map_x: 760, map_y: 180 },
  { id: 12, station_number: 12, name: 'Warehouse and Storage', map_x: 820, map_y: 120 },
  { id: 13, station_number: 13, name: 'By-Products Processing', map_x: 880, map_y: 160 },
  { id: 14, station_number: 14, name: 'Power Generation Plant', map_x: 920, map_y: 220 },
  { id: 15, station_number: 15, name: 'Historical Exhibition Hall', map_x: 800, map_y: 320 },
];

export default function MapCoordinatePicker() {
  const [stations, setStations] = useState<Station[]>(initialStations);
  const [selectedStation, setSelectedStation] = useState<number | null>(1);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (selectedStation === null) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate percentage-based coordinates
    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;

    setStations(prev =>
      prev.map(station =>
        station.station_number === selectedStation
          ? { ...station, map_x: percentX, map_y: percentY }
          : station
      )
    );
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
  };

  const exportSQL = () => {
    const sql = stations
      .map(
        station =>
          `UPDATE stations SET map_x = ${station.map_x.toFixed(2)}, map_y = ${station.map_y.toFixed(2)} WHERE station_number = ${station.station_number};`
      )
      .join('\n');
    
    navigator.clipboard.writeText(sql);
    alert('SQL UPDATE statements copied to clipboard!');
  };

  const exportJSON = () => {
    const json = JSON.stringify(stations, null, 2);
    navigator.clipboard.writeText(json);
    alert('JSON data copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Map Coordinate Picker</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Station List */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Stations</h2>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {stations.map(station => (
                <button
                  key={station.id}
                  onClick={() => setSelectedStation(station.station_number)}
                  className={`w-full text-left p-3 rounded transition-colors ${
                    selectedStation === station.station_number
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="font-semibold">#{station.station_number}</div>
                  <div className="text-sm">{station.name}</div>
                  <div className="text-xs mt-1 opacity-70">
                    X: {station.map_x.toFixed(2)}%, Y: {station.map_y.toFixed(2)}%
                  </div>
                </button>
              ))}
            </div>
            
            <div className="mt-4 space-y-2">
              <button
                onClick={exportSQL}
                className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
              >
                Copy SQL Updates
              </button>
              <button
                onClick={exportJSON}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
              >
                Copy JSON
              </button>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-4">
              Click on the map to place Station #{selectedStation || '?'}
            </h2>
            <div
              onClick={handleImageClick}
              className="relative cursor-crosshair border-4 border-blue-300"
              style={{ width: '100%', aspectRatio: '1.77' }}
            >
              <Image
                src="/images/MAP_LAYOUT.png"
                alt="Factory Map"
                fill
                style={{ objectFit: 'contain' }}
                onLoad={handleImageLoad}
              />
              
              {/* Show markers */}
              {stations.map(station => (
                <div
                  key={station.id}
                  className="absolute"
                  style={{
                    left: `${station.map_x}%`,
                    top: `${station.map_y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ${
                      selectedStation === station.station_number
                        ? 'bg-red-500 ring-4 ring-red-300'
                        : 'bg-blue-600'
                    }`}
                  >
                    {station.station_number}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Instructions:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Select a station from the left panel</li>
                <li>Click on the map where that station should be located</li>
                <li>The marker will move to your clicked position</li>
                <li>Repeat for all stations</li>
                <li>Click "Copy SQL Updates" to get the database update commands</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
