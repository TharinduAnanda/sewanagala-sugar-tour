// Shared type definitions for booking-related components

export interface TimeSlot {
  id: string // Format: 'YYYY-MM-DD_HH:MM'
  date: string
  time_slot: string
  available_spots: number
  max_capacity: number
}

export interface BookingFormData {
  name: string
  email: string
  phone: string
  date: string
  time_slot: string
  adults: number
  children: number
  special_requirements: string
  agree_terms: boolean
}
