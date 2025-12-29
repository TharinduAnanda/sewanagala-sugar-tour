// Map coordinates for each station on MAP_LAYOUT.png
// These coordinates are percentages (0-100) relative to the IMAGE dimensions (3541x1850)
// User-marked exact positions from the coordinate picker tool

export interface StationMapPosition {
  stationNumber: number
  x: number // X coordinate as percentage (0-100) of IMAGE width
  y: number // Y coordinate as percentage (0-100) of IMAGE height
  name: string
}

// Coordinates exactly as marked by user on the MAP_LAYOUT.png image
// These are IMAGE-based percentages, not container percentages
export const STATION_MAP_POSITIONS: StationMapPosition[] = [
  { stationNumber: 1, x: 12.17, y: 57.98, name: 'Reception and Visitor Center' },
  { stationNumber: 2, x: 30.86, y: 68.99, name: 'Sugarcane Unloading Bay' },
  { stationNumber: 3, x: 31.60, y: 50.27, name: 'Cane Preparation Area' },
  { stationNumber: 4, x: 31.47, y: 39.39, name: 'Milling Station' },
  { stationNumber: 5, x: 32.09, y: 25.46, name: 'Juice Clarification Plant' },
  { stationNumber: 6, x: 38.48, y: 43.96, name: 'Evaporation Station' },
  { stationNumber: 7, x: 52.74, y: 43.96, name: 'Crystallization Area' },
  { stationNumber: 8, x: 64.05, y: 21.33, name: 'Centrifugal Separation' },
  { stationNumber: 9, x: 46.72, y: 60.94, name: 'Sugar Drying and Cooling' },
  { stationNumber: 10, x: 46.35, y: 71.82, name: 'Quality Control Laboratory' },
  { stationNumber: 11, x: 46.47, y: 88.36, name: 'Packaging Line' },
  { stationNumber: 12, x: 14.26, y: 23.29, name: 'Warehouse and Storage' }
]

export const TOTAL_STATIONS = 12

export function getStationPosition(stationNumber: number): StationMapPosition | undefined {
  return STATION_MAP_POSITIONS.find(pos => pos.stationNumber === stationNumber)
}

export function getNextStationPosition(currentStation: number): StationMapPosition | undefined {
  return STATION_MAP_POSITIONS.find(pos => pos.stationNumber === currentStation + 1)
}

export function getPreviousStationPosition(currentStation: number): StationMapPosition | undefined {
  return STATION_MAP_POSITIONS.find(pos => pos.stationNumber === currentStation - 1)
}
