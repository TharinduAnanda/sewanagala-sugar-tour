import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'
import axios from 'axios'

function toDateStr(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

function normalizeDateStr(dateValue: any): string {
  if (typeof dateValue === 'string') {
    return dateValue.split('T')[0]
  } else if (dateValue instanceof Date) {
    return toDateStr(dateValue.getFullYear(), dateValue.getMonth() + 1, dateValue.getDate())
  } else {
    return new Date(dateValue).toISOString().split('T')[0]
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const year = Number(searchParams.get('year'))
    const month = Number(searchParams.get('month'))
    
    if (!year || !month) {
      return NextResponse.json({ 
        success: false, 
        error: 'Year and month are required' 
      }, { status: 400 })
    }

    const startDate = toDateStr(year, month, 1)
    const daysInMonth = new Date(year, month, 0).getDate()
    const endDate = toDateStr(year, month, daysInMonth)

    // Fetch admin closures from DB
    const [closures] = await db.query<any[]>(
      'SELECT * FROM factory_closures WHERE closure_date BETWEEN ? AND ? ORDER BY closure_date',
      [startDate, endDate]
    )

    // Fetch Sri Lankan holidays from our new API endpoint
    let holidaysGC: { date: string; reason: string }[] = []
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      const holidaysRes = await axios.get(`${baseUrl}/api/holidays`, {
        params: { year, month }
      })
      
      if (holidaysRes.data.success) {
        holidaysGC = holidaysRes.data.data.map((h: any) => ({
          date: h.date,
          reason: h.name
        }))
      }
    } catch (error) {
      console.log('Could not fetch holidays from API, continuing without them')
      // Continue without holidays if the API fails
    }

    // Build calendar days
    const calendarDays: any[] = []

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day)
      const dateStr = toDateStr(year, month, day)
      const dayOfWeek = date.getDay()
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

      // Check if day has admin closure
      const closure = closures.find(c => normalizeDateStr(c.closure_date) === dateStr)
      const isClosed = !!closure

      // Check if day is a holiday
      const holiday = holidaysGC.find(h => h.date === dateStr)
      const isHoliday = !!holiday

      const available = !isWeekend && !isClosed && !isHoliday

      calendarDays.push({
        day,
        date: dateStr,
        dayOfWeek,
        isWeekend,
        isClosed,
        isHoliday,
        closureReason: holiday?.reason || closure?.reason || null,
        available,
        bookings: null,
      })
    }

    return NextResponse.json({ 
      success: true, 
      calendar: { 
        year, 
        month, 
        days: calendarDays, 
        closures, 
        holidays: holidaysGC, 
        bookingsByDate: {} 
      } 
    })
  } catch (error: any) {
    console.error('Error in public calendar overview:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}
