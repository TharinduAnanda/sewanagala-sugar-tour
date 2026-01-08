import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { verifyAuth } from '@/lib/auth'
import { RowDataPacket } from 'mysql2'

// GET - List all special bookings
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'pending'

    let query = `
      SELECT 
        b.id,
        b.booking_reference,
        b.name,
        b.email,
        b.phone,
        b.visit_date,
        b.visit_time,
        b.requested_capacity,
        b.special_request_reason,
        b.special_booking_status,
        b.status,
        b.admin_review_notes,
        b.reviewed_by,
        b.reviewed_at,
        b.created_at,
        COUNT(DISTINCT sbd.id) as document_count,
        ts.max_capacity as slot_capacity
      FROM bookings b
      LEFT JOIN special_booking_documents sbd ON b.id = sbd.booking_id
      LEFT JOIN tour_slots ts ON b.slot_id = ts.id
      WHERE b.is_special_booking = TRUE
    `

    const params: any[] = []

    if (status !== 'all') {
      query += ` AND b.special_booking_status = ?`
      params.push(status)
    }

    query += ` GROUP BY b.id ORDER BY b.created_at DESC`

    const [bookings] = await pool.execute<RowDataPacket[]>(query, params)

    return NextResponse.json({ success: true, data: bookings })
  } catch (error: any) {
    console.error('Fetch special bookings error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch special bookings' },
      { status: 500 }
    )
  }
}
