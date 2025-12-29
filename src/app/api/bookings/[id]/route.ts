import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { authenticateRequest } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const [bookings] = await pool.query(
      'SELECT * FROM bookings WHERE id = ?',
      [resolvedParams.id]
    )
    
    const bookingsArray = bookings as any[]
    
    if (bookingsArray.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Booking not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: bookingsArray[0]
    })
  } catch (error: any) {
    console.error('Error fetching booking:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch booking' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = authenticateRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const resolvedParams = await params;
    const body = await request.json()
    const { status } = body
    
    if (!status) {
      return NextResponse.json(
        { success: false, message: 'Status is required' },
        { status: 400 }
      )
    }
    
    const [result] = await pool.query(
      'UPDATE bookings SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, resolvedParams.id]
    )
    
    const updateResult = result as any
    
    if (updateResult.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: 'Booking not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Booking updated successfully'
    })
  } catch (error: any) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update booking' },
      { status: 500 }
    )
  }
}
