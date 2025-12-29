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
    
    // Get total bookings
    const [totalBookingsResult] = await pool.query(
      'SELECT COUNT(*) as count FROM bookings'
    )
    const totalBookings = (totalBookingsResult as any[])[0].count
    
    // Get total visitors (sum of all visitor_count)
    const [totalVisitorsResult] = await pool.query(
      'SELECT SUM(visitor_count) as count FROM bookings WHERE status != "cancelled"'
    )
    const totalVisitors = (totalVisitorsResult as any[])[0].count || 0
    
    // Get today's bookings
    const [todayBookingsResult] = await pool.query(
      'SELECT COUNT(*) as count FROM bookings WHERE DATE(visit_date) = CURDATE()'
    )
    const todayBookings = (todayBookingsResult as any[])[0].count
    
    // Get upcoming bookings (future confirmed bookings)
    const [upcomingResult] = await pool.query(
      'SELECT COUNT(*) as count FROM bookings WHERE status = "confirmed" AND visit_date >= CURDATE()'
    )
    const upcomingBookings = (upcomingResult as any[])[0].count
    
    // Get this month's bookings
    const [thisMonthResult] = await pool.query(
      'SELECT COUNT(*) as count FROM bookings WHERE MONTH(visit_date) = MONTH(CURDATE()) AND YEAR(visit_date) = YEAR(CURDATE())'
    )
    const thisMonthBookings = (thisMonthResult as any[])[0].count
    
    // Get completed bookings
    const [completedResult] = await pool.query(
      'SELECT COUNT(*) as count FROM bookings WHERE status = "completed"'
    )
    const completedBookings = (completedResult as any[])[0].count
    
    // Get recent bookings
    const [recentBookings] = await pool.query(
      'SELECT booking_id, name, email, phone, visit_date, visit_time, visitor_count, status, created_at FROM bookings ORDER BY created_at DESC LIMIT 10'
    )
    
    return NextResponse.json({
      success: true,
      data: {
        totalBookings,
        totalVisitors,
        todayBookings,
        upcomingBookings,
        thisMonthBookings,
        completedBookings,
        recentBookings
      }
    })
  } catch (error: any) {
    console.error('Dashboard error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}