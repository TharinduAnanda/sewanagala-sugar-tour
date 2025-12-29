import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { sendBookingConfirmationEmail } from '@/lib/emailService'
import { sendBookingConfirmationSMS } from '@/lib/smsService'

const MAX_CAPACITY_PER_SLOT = 30

function generateBookingReference(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 7)
  return `BK${timestamp}${random}`.toUpperCase()
}

// Get current bookings for a slot
async function getBookedCount(date: string, time_slot: string): Promise<number> {
  try {
    const [rows] = await pool.query(
      `SELECT COALESCE(SUM(visitor_count), 0) as total_booked
       FROM bookings
       WHERE visit_date = ? AND visit_time = ? AND status IN ('pending', 'confirmed')`,
      [date, time_slot]
    )
    const result = rows as any[]
    return parseInt(result[0]?.total_booked) || 0
  } catch (error) {
    console.error('Error getting booked count:', error)
    return 0
  }
}

// Send email notification
async function sendEmailNotification(bookingData: any) {
  try {
    const emailData = {
      booking_id: bookingData.booking_id,
      name: bookingData.name,
      email: bookingData.email,
      phone: bookingData.phone,
      visit_date: bookingData.visit_date,
      visit_time: bookingData.visit_time,
      visitor_count: bookingData.visitor_count,
      booking_date: new Date().toISOString().split('T')[0]
    }

    // Call local email service
    const result = await sendBookingConfirmationEmail(emailData)
    
    if (result.success) {
      console.log('Email sent successfully')
    } else {
      console.error('Email sending failed:', result.message)
    }
  } catch (error: any) {
    console.error('Email notification error:', error.message)
    // Don't throw - email failure shouldn't block booking
  }
}

// Send SMS notification
async function sendSMSNotification(bookingData: any) {
  try {
    const smsData = {
      booking_id: bookingData.booking_id,
      mobile_number: bookingData.phone,
      tour_date: bookingData.visit_date,
      tour_time: bookingData.visit_time
    }

    // Call local SMS service
    const result = await sendBookingConfirmationSMS(smsData)
    
    if (result.success) {
      console.log('SMS sent successfully')
    } else {
      console.error('SMS sending failed:', result.message)
    }
  } catch (error: any) {
    console.error('SMS notification error:', error.message)
    // Don't throw - SMS failure shouldn't block booking
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, date, time_slot, adults, children } = body
    
    // Validate required fields
    if (!name || !email || !phone || !date || !time_slot || !adults) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Validate visitor count
    const totalVisitors = adults + (children || 0)
    if (totalVisitors < 1 || totalVisitors > 30) {
      return NextResponse.json(
        { success: false, message: 'Invalid visitor count (1-30 allowed)' },
        { status: 400 }
      )
    }

    // Check slot availability
    const bookedCount = await getBookedCount(date, time_slot)
    const availableSpots = MAX_CAPACITY_PER_SLOT - bookedCount
    
    if (availableSpots < totalVisitors) {
      return NextResponse.json(
        { success: false, message: `Not enough spots available. Only ${availableSpots} spots left.` },
        { status: 400 }
      )
    }
    
    // Generate booking reference
    const booking_id = generateBookingReference()
    
    // Insert booking into database
    const [result] = await pool.query(
      `INSERT INTO bookings 
       (booking_id, name, email, phone, visit_date, visit_time, visitor_count, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed')`,
      [booking_id, name, email, phone, date, time_slot, totalVisitors]
    )
    
    const insertResult = result as any
    
    // Prepare booking data for notifications
    const bookingData = {
      booking_id,
      name,
      email,
      phone,
      visit_date: date,
      visit_time: time_slot,
      visitor_count: totalVisitors,
      adults,
      children: children || 0
    }

    // Send notifications asynchronously (don't wait for them)
    Promise.all([
      sendEmailNotification(bookingData),
      sendSMSNotification(bookingData)
    ]).catch(err => console.error('Notification error:', err))
    
    return NextResponse.json({
      success: true,
      message: 'Booking confirmed successfully! Your FREE tour has been automatically confirmed. Confirmation email and SMS will be sent shortly.',
      data: {
        id: insertResult.insertId,
        booking_reference: booking_id,
        available_spots_remaining: availableSpots - totalVisitors
      }
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create booking', error: error.message },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const date = searchParams.get('date')
    
    let query = 'SELECT * FROM bookings WHERE 1=1'
    const params: any[] = []
    
    if (status) {
      query += ' AND status = ?'
      params.push(status)
    }
    
    if (date) {
      query += ' AND date = ?'
      params.push(date)
    }
    
    query += ' ORDER BY created_at DESC'
    
    const [bookings] = await pool.query(query, params)
    
    return NextResponse.json({
      success: true,
      data: bookings
    })
  } catch (error: any) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}
