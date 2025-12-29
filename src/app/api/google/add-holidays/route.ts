import { NextRequest, NextResponse } from 'next/server'
import { bulkAddHolidays } from '@/lib/googleCalendarWrite'
import { mercantileHolidays2025, mercantileHolidays2026 } from '@/data/mercantileHolidays2025'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { year, calendarId } = body
    
    let holidays = []
    
    if (year === 2025 || year === '2025') {
      holidays = mercantileHolidays2025
    } else if (year === 2026 || year === '2026') {
      holidays = mercantileHolidays2026
    } else {
      // Default to 2025
      holidays = mercantileHolidays2025
    }
    
    console.log(`Adding ${holidays.length} mercantile holidays for ${year || 2025}...`)
    
    const result = await bulkAddHolidays(holidays, calendarId)
    
    return NextResponse.json({
      success: true,
      message: `Successfully added ${result.added} holidays, skipped ${result.skipped} existing`,
      details: result,
    })
  } catch (error: any) {
    console.error('Error adding holidays:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 })
  }
}

// GET endpoint to preview holidays
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const year = searchParams.get('year') || '2025'
  
  let holidays = []
  
  if (year === '2025') {
    holidays = mercantileHolidays2025
  } else if (year === '2026') {
    holidays = mercantileHolidays2026
  } else {
    holidays = mercantileHolidays2025
  }
  
  return NextResponse.json({
    success: true,
    year,
    count: holidays.length,
    holidays,
  })
}
