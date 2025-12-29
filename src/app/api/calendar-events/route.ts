import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
const SRI_LANKAN_HOLIDAYS_CALENDAR_ID = 'en.lk#holiday@group.v.calendar.google.com'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year') || new Date().getFullYear().toString()
    
    const startDate = new Date(parseInt(year), 0, 1).toISOString()
    const endDate = new Date(parseInt(year) + 1, 0, 1).toISOString()

    const allEvents: any[] = []

    // 1. Fetch Sri Lankan holidays
    try {
      const holidayUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(SRI_LANKAN_HOLIDAYS_CALENDAR_ID)}/events?key=${GOOGLE_API_KEY}&timeMin=${startDate}&timeMax=${endDate}&singleEvents=true&orderBy=startTime`
      const holidayResponse = await fetch(holidayUrl)
      
      if (holidayResponse.ok) {
        const data = await holidayResponse.json()
        const holidayEvents = (data.items || []).map((event: any) => ({
          id: `holiday-${event.id}`,
          title: `???? ${event.summary || 'Holiday'}`,
          start: event.start.dateTime || event.start.date,
          end: event.end?.dateTime || event.end?.date,
          allDay: !event.start.dateTime,
          backgroundColor: '#ef4444',
          borderColor: '#dc2626',
          extendedProps: { type: 'holiday' }
        }))
        allEvents.push(...holidayEvents)
        console.log(`Loaded ${holidayEvents.length} holidays`)
      }
    } catch (error) {
      console.error('Error fetching holidays:', error)
    }

    // 2. Fetch bookings from database
    try {
      const [bookings] = await pool.query(
        'SELECT booking_id, name, visit_date, visit_time, visitor_count, status FROM bookings WHERE YEAR(visit_date) = ? AND status != "cancelled" ORDER BY visit_date',
        [parseInt(year)]
      )
      
      const bookingEvents = (bookings as any[]).map((booking) => {
        const visitDate = new Date(booking.visit_date).toISOString().split('T')[0]
        return {
          id: `booking-${booking.booking_id}`,
          title: `?? ${booking.name} (${booking.visitor_count} visitors)`,
          start: `${visitDate}T${booking.visit_time}`,
          allDay: false,
          backgroundColor: booking.status === 'confirmed' ? '#3b82f6' : '#f59e0b',
          borderColor: booking.status === 'confirmed' ? '#2563eb' : '#d97706',
          extendedProps: { 
            type: 'booking',
            status: booking.status,
            visitors: booking.visitor_count
          }
        }
      })
      allEvents.push(...bookingEvents)
      console.log(`Loaded ${bookingEvents.length} bookings`)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    }

    // 3. Fetch factory closures (if table exists)
    try {
      const [closures] = await pool.query(
        'SELECT id, date, reason, type FROM factory_closures WHERE YEAR(date) = ? ORDER BY date',
        [parseInt(year)]
      )
      
      const closureEvents = (closures as any[]).map((closure) => {
        const closureDate = new Date(closure.date).toISOString().split('T')[0]
        return {
          id: `closure-${closure.id}`,
          title: `?? Closed: ${closure.reason}`,
          start: closureDate,
          allDay: true,
          backgroundColor: '#dc2626',
          borderColor: '#b91c1c',
          extendedProps: { 
            type: 'closure',
            closureType: closure.type
          }
        }
      })
      allEvents.push(...closureEvents)
      console.log(`Loaded ${closureEvents.length} closures`)
    } catch (error) {
      console.error('Error fetching closures (table may not exist):', error)
      // Continue even if closures table doesn't exist
    }

    console.log(`Total events: ${allEvents.length}`)
    return NextResponse.json({ success: true, events: allEvents, count: allEvents.length })
  } catch (error: any) {
    console.error('Error fetching calendar events:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch calendar events', error: error.toString() },
      { status: 500 }
    )
  }
}