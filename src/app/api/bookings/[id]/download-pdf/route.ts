import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { generateBookingPDF } from '@/lib/pdfService'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id

    // Fetch booking details from database
    const [bookings] = await pool.query(
      'SELECT * FROM bookings WHERE booking_id = ?',
      [bookingId]
    )

    const bookingArray = bookings as any[]
    
    if (bookingArray.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Booking not found' },
        { status: 404 }
      )
    }

    const booking = bookingArray[0]

    // Prepare booking data for PDF
    const bookingData = {
      booking_id: booking.booking_id,
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      visit_date: booking.visit_date,
      visit_time: booking.visit_time,
      visitor_count: booking.visitor_count,
      booking_date: booking.created_at.toISOString().split('T')[0]
    }

    // Generate PDF
    const pdfBuffer = await generateBookingPDF(bookingData)

    // Return PDF as download
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Booking-${bookingId}.pdf"`,
      },
    })
  } catch (error: any) {
    console.error('PDF download error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to generate PDF', error: error.message },
      { status: 500 }
    )
  }
}
