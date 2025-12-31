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
    
    // Get today''s bookings
    const [todayBookingsResult] = await pool.query(
      'SELECT COUNT(*) as count FROM bookings WHERE DATE(visit_date) = CURDATE()'
    )
    const todayBookings = (todayBookingsResult as any[])[0].count
    
    // Get total revenue
    const [revenueResult] = await pool.query(
      'SELECT SUM(visitor_count * 1500) as revenue FROM bookings WHERE status IN ("pending", "confirmed")'
    )
    const totalRevenue = (revenueResult as any[])[0].revenue || 0
    
    // Get pending bookings
    const [pendingResult] = await pool.query(
      'SELECT COUNT(*) as count FROM bookings WHERE status = "pending"'
    )
    const pendingBookings = (pendingResult as any[])[0].count
    
    return NextResponse.json({
      totalBookings,
      todayBookings,
      totalRevenue,
      pendingBookings
    })
  } catch (error: any) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { totalBookings: 0, todayBookings: 0, totalRevenue: 0, pendingBookings: 0 },
      { status: 200 }
    )
  }
}
