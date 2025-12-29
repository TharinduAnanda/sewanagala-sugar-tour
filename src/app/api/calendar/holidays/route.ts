import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const SRI_LANKAN_HOLIDAYS_CALENDAR_ID = "en.lk#holiday@group.v.calendar.google.com"

export async function GET(request: NextRequest) {
  try {
    const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
    
    if (!GOOGLE_API_KEY) {
      return NextResponse.json([], { status: 200 }) // Return empty array if no API key
    }

    const searchParams = request.nextUrl.searchParams
    const start = searchParams.get('start')
    const end = searchParams.get('end')

    let timeMin: string
    let timeMax: string

    if (start && end) {
      timeMin = new Date(start).toISOString()
      timeMax = new Date(end).toISOString()
    } else {
      // Default to current month
      const now = new Date()
      timeMin = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      timeMax = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString()
    }

    // Fetch from Google Calendar API
    const response = await axios.get(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(SRI_LANKAN_HOLIDAYS_CALENDAR_ID)}/events`,
      {
        params: {
          key: GOOGLE_API_KEY,
          timeMin: timeMin,
          timeMax: timeMax,
          singleEvents: true,
          orderBy: 'startTime',
        },
      }
    )

    const events = response.data.items || []
    
    const holidays = events.map((event: any) => ({
      date: event.start.date || event.start.dateTime?.split('T')[0],
      name: event.summary || 'Holiday',
    }))

    return NextResponse.json(holidays)
  } catch (error: any) {
    console.error('Error fetching holidays:', error.response?.data || error.message)
    // Return empty array on error to prevent UI breakage
    return NextResponse.json([])
  }
}
