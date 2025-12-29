export interface Station {
  id: number
  name: string
  description: string
  station_number: number
  latitude: number
  longitude: number
  map_x: number
  map_y: number
  category: string
  duration_minutes: number
  audio_guide_url?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Booking {
  id: number
  name: string
  email: string
  phone: string
  date: string
  time_slot: string
  adults: number
  children: number
  total_amount: number
  status: string
  booking_reference: string
  created_at: string
}

export interface TourSlot {
  id: number
  date: string
  time_slot: string
  max_capacity: number
  current_bookings: number
  available_spots: number
  is_available: boolean
}

export interface Admin {
  id: number
  username: string
  email: string
  role: string
}

export interface MediaItem {
  id: number
  station_id: number
  media_type: string
  media_url: string
  thumbnail_url?: string
  title?: string
  description?: string
  display_order: number
  created_at: string
}
