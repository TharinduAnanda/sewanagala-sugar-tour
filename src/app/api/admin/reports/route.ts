import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { authenticateRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = authenticateRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const endDate = searchParams.get('endDate') || new Date().toISOString().split('T')[0]

    // Get overview statistics
    const [totalBookingsResult] = await pool.query(
      'SELECT COUNT(*) as count FROM bookings WHERE visit_date BETWEEN ? AND ?',
      [startDate, endDate]
    )
    const totalBookings = (totalBookingsResult as any[])[0].count

    const [confirmedResult] = await pool.query(
      'SELECT COUNT(*) as count FROM bookings WHERE status = "confirmed" AND visit_date BETWEEN ? AND ?',
      [startDate, endDate]
    )
    const confirmedBookings = (confirmedResult as any[])[0].count

    const [pendingResult] = await pool.query(
      'SELECT COUNT(*) as count FROM bookings WHERE status = "pending" AND visit_date BETWEEN ? AND ?',
      [startDate, endDate]
    )
    const pendingBookings = (pendingResult as any[])[0].count

    const [cancelledResult] = await pool.query(
      'SELECT COUNT(*) as count FROM bookings WHERE status = "cancelled" AND visit_date BETWEEN ? AND ?',
      [startDate, endDate]
    )
    const cancelledBookings = (cancelledResult as any[])[0].count

    // Get upcoming bookings (future dates from today)
    const today = new Date().toISOString().split('T')[0]
    const [upcomingResult] = await pool.query(
      'SELECT COUNT(*) as count FROM bookings WHERE visit_date >= ? AND status IN ("confirmed", "pending")',
      [today]
    )
    const upcomingBookings = (upcomingResult as any[])[0].count

    const [visitorsResult] = await pool.query(
      'SELECT SUM(visitor_count) as total FROM bookings WHERE visit_date BETWEEN ? AND ? AND status = "confirmed"',
      [startDate, endDate]
    )
    const totalVisitors = (visitorsResult as any[])[0].total || 0

    // Get bookings by month
    const [monthlyData] = await pool.query(
      `SELECT 
        DATE_FORMAT(visit_date, '%Y-%m') as month,
        DATE_FORMAT(visit_date, '%b') as month_name,
        COUNT(*) as count
      FROM bookings 
      WHERE visit_date BETWEEN ? AND ?
      GROUP BY month, month_name
      ORDER BY month ASC`,
      [startDate, endDate]
    )

    // Get bookings by day of week
    const [weeklyData] = await pool.query(
      `SELECT 
        DAYNAME(visit_date) as day,
        COUNT(*) as count
      FROM bookings 
      WHERE visit_date BETWEEN ? AND ?
      GROUP BY DAYOFWEEK(visit_date), day
      ORDER BY DAYOFWEEK(visit_date) ASC`,
      [startDate, endDate]
    )

    // Get top performing dates
    const [topDates] = await pool.query(
      `SELECT 
        visit_date as date,
        COUNT(*) as bookings,
        SUM(visitor_count) as visitors
      FROM bookings 
      WHERE visit_date BETWEEN ? AND ? AND status = "confirmed"
      GROUP BY visit_date
      ORDER BY bookings DESC, visitors DESC
      LIMIT 10`,
      [startDate, endDate]
    )

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalBookings,
          confirmedBookings,
          upcomingBookings,
          pendingBookings,
          cancelledBookings,
          totalVisitors
        },
        trends: {
          bookingsByMonth: (monthlyData as any[]).map(row => ({
            month: row.month_name,
            count: row.count
          })),
          bookingsByDay: (weeklyData as any[]).map(row => ({
            day: row.day,
            count: row.count
          }))
        },
        topDates: topDates as any[]
      }
    })
  } catch (error: any) {
    console.error('Reports error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch reports data', error: error.message },
      { status: 500 }
    )
  }
}
