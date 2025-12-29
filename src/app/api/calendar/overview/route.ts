import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'
import { listMonthHolidays } from '@/lib/googleCalendar'

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

    // Fetch bookings aggregation
    const [bookings] = await db.query<any[]>(
      `SELECT visit_date, status, COUNT(*) as count 
       FROM bookings 
       WHERE visit_date BETWEEN ? AND ? 
       GROUP BY visit_date, status`,
      [startDate, endDate]
    )
    
    const bookingsByDate: Record<string, any> = {}
    for (const b of bookings) {
      const dateStr = normalizeDateStr(b.visit_date)
      if (!bookingsByDate[dateStr]) {
        bookingsByDate[dateStr] = { pending: 0, confirmed: 0, cancelled: 0, total: 0 }
      }
      bookingsByDate[dateStr][b.status] = b.count
      bookingsByDate[dateStr].total += b.count
    }

    // Fetch mercantile holidays from Google Calendar
    const holidaysGC = await listMonthHolidays(year, month)

    // Build calendar days
    const calendarDays: any[] = []

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day)
      const dateStr = toDateStr(year, month, day)
      const dayOfWeek = date.getDay()
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

      const closure = closures.find(c => normalizeDateStr(c.closure_date) === dateStr)
      const isClosed = !!closure

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
        bookings: bookingsByDate[dateStr] || null,
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
        bookingsByDate 
      } 
    })
  } catch (error: any) {
    console.error('Error in admin calendar overview:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}
