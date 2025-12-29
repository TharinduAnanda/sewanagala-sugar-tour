import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

// Factory operating hours and constants
const FIXED_SLOTS = [
  { start_time: '08:00', end_time: '10:00' },
  { start_time: '10:00', end_time: '12:00' },
  { start_time: '12:00', end_time: '14:00' },
  { start_time: '14:00', end_time: '16:00' }
]

const MAX_CAPACITY_PER_SLOT = 30

// Check if date is a weekend
const isWeekend = (date: string): boolean => {
  const d = new Date(date)
  return d.getDay() === 0 || d.getDay() === 6
}

// Check if factory is closed on a specific date
const isFactoryClosed = async (date: string): Promise<boolean> => {
  try {
    const [rows] = await pool.query(
      'SELECT id FROM factory_closures WHERE closure_date = ?',
      [date]
    )
    const result = rows as any[]
    return result.length > 0
  } catch (error) {
    console.error('Error checking factory closures:', error)
    return false
  }
}

// Get booked count for a specific slot
const getBookedCountForSlot = async (date: string, startTime: string): Promise<number> => {
  try {
    const [rows] = await pool.query(
      `SELECT COALESCE(SUM(visitor_count), 0) as total_booked
       FROM bookings
       WHERE visit_date = ? AND visit_time = ? AND status IN ('pending', 'confirmed')`,
      [date, startTime]
    )
    const result = rows as any[]
    return parseInt(result[0]?.total_booked) || 0
  } catch (error) {
    console.error('Error getting booked count:', error)
    return 0
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    
    if (!date) {
      return NextResponse.json(
        { success: false, message: 'Date parameter is required' },
        { status: 400 }
      )
    }
    
    // Check if weekend
    if (isWeekend(date)) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'No tours available on weekends'
      })
    }

    // Check if factory is closed
    const isClosed = await isFactoryClosed(date)
    if (isClosed) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'Factory is closed on this date'
      })
    }

    // Generate dynamic slots
    const slots = []
    for (const slot of FIXED_SLOTS) {
      const bookedCount = await getBookedCountForSlot(date, slot.start_time)
      const availableSpots = MAX_CAPACITY_PER_SLOT - bookedCount

      slots.push({
        id: `${date}_${slot.start_time}`,
        date: date,
        time_slot: slot.start_time,
        end_time: slot.end_time,
        max_capacity: MAX_CAPACITY_PER_SLOT,
        current_bookings: bookedCount,
        available_spots: availableSpots,
        is_available: availableSpots > 0,
        capacity_status: 
          availableSpots <= 0 ? 'Full' :
          availableSpots < 10 ? 'Limited' :
          'Available'
      })
    }
    
    return NextResponse.json({
      success: true,
      data: slots
    })
  } catch (error: any) {
    console.error('Error fetching slots:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch slots', error: error.message },
      { status: 500 }
    )
  }
}
