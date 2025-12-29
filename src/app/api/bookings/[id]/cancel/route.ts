import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Booking ID is required' },
        { status: 400 }
      )
    }

    // First, check if booking exists and is not already cancelled/completed
    const [bookings] = await pool.query(
      'SELECT * FROM bookings WHERE id = ?',
      [id]
    )

    const bookingsArray = bookings as any[]

    if (bookingsArray.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Booking not found' },
        { status: 404 }
      )
    }

    const booking = bookingsArray[0]

    if (booking.status === 'cancelled') {
      return NextResponse.json(
        { success: false, message: 'Booking is already cancelled' },
        { status: 400 }
      )
    }

    if (booking.status === 'completed') {
      return NextResponse.json(
        { success: false, message: 'Cannot cancel a completed booking' },
        { status: 400 }
      )
    }

    // Update booking status to cancelled
    const [result] = await pool.query(
      'UPDATE bookings SET status = ?, updated_at = NOW() WHERE id = ?',
      ['cancelled', id]
    )

    const updateResult = result as any

    if (updateResult.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: 'Failed to cancel booking' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Booking cancelled successfully'
    })
  } catch (error: any) {
    console.error('Error cancelling booking:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to cancel booking', error: error.message },
      { status: 500 }
    )
  }
}
