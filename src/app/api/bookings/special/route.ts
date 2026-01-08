import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { sendEmail } from '@/lib/emailService'
import { sendSMS } from '@/lib/smsService'
import { ResultSetHeader, RowDataPacket } from 'mysql2'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      phone,
      visit_date,
      visit_time,
      slot_id,
      requested_capacity,
      special_request_reason,
      documents,
      special_requests,
    } = body

    // Validate required fields for special booking
    if (!requested_capacity || requested_capacity <= 100) {
      return NextResponse.json(
        { error: 'Special bookings require capacity greater than 100' },
        { status: 400 }
      )
    }

    if (!special_request_reason || special_request_reason.trim().length < 50) {
      return NextResponse.json(
        { error: 'Please provide detailed reason (minimum 50 characters)' },
        { status: 400 }
      )
    }

    if (!documents || documents.length === 0) {
      return NextResponse.json(
        { error: 'At least one supporting document is required' },
        { status: 400 }
      )
    }

    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()

      // Generate booking reference
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
      const randomNum = Math.floor(1000 + Math.random() * 9000)
      const booking_reference = `SSF-${dateStr}-${randomNum}`

      // Insert special booking (pending status)
      const insertQuery = `
        INSERT INTO bookings (
          booking_reference, name, email, phone, visit_date, visit_time,
          adults, children, total_amount, status, special_requests,
          slot_id, is_special_booking, requested_capacity, 
          special_request_reason, legal_documents, special_booking_status,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `

      const [result] = await connection.execute<ResultSetHeader>(insertQuery, [
        booking_reference,
        name,
        email,
        phone,
        visit_date,
        visit_time,
        requested_capacity, // adults = requested capacity
        0, // children
        0.00, // total_amount
        'pending', // booking status is pending
        special_requests || '',
        slot_id,
        true, // is_special_booking
        requested_capacity,
        special_request_reason,
        JSON.stringify(documents),
        'pending', // special_booking_status
      ])

      const bookingId = result.insertId

      // Insert documents into special_booking_documents table
      for (const doc of documents) {
        await connection.execute(
          `INSERT INTO special_booking_documents 
           (booking_id, document_type, document_url, cloudinary_public_id, 
            file_name, file_size, mime_type, uploaded_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
          [
            bookingId,
            'supporting_document',
            doc.url,
            doc.publicId,
            doc.name,
            doc.size,
            doc.type,
          ]
        )
      }

      await connection.commit()

      // Send pending notification SMS
      try {
        const smsMessage = `Sewanagala Sugar Factory Tour - Your special booking request for ${requested_capacity} visitors on ${visit_date} at ${visit_time} has been received. Booking ID: ${booking_reference}. Status: PENDING ADMIN APPROVAL. You will receive confirmation once reviewed.`
        
        await sendSMS(phone, smsMessage)
        
        // Log SMS notification
        await connection.execute(
          `INSERT INTO special_booking_notifications (booking_id, notification_type, status) 
           VALUES (?, 'pending_sms', 'sent')`,
          [bookingId]
        )
      } catch (smsError) {
        console.error('SMS send failed:', smsError)
        await connection.execute(
          `INSERT INTO special_booking_notifications (booking_id, notification_type, status, response) 
           VALUES (?, 'pending_sms', 'failed', ?)`,
          [bookingId, String(smsError)]
        )
      }

      // Send pending notification email
      try {
        const emailSubject = 'Special Booking Request Received - Pending Approval'
        const emailBody = `
          <h2>Special Booking Request Received</h2>
          <p>Dear ${name},</p>
          <p>Thank you for your special booking request for the Sewanagala Sugar Factory Tour.</p>
          
          <h3>Booking Details:</h3>
          <ul>
            <li><strong>Booking Reference:</strong> ${booking_reference}</li>
            <li><strong>Requested Capacity:</strong> ${requested_capacity} visitors</li>
            <li><strong>Date:</strong> ${visit_date}</li>
            <li><strong>Time:</strong> ${visit_time}</li>
            <li><strong>Status:</strong> <span style="color: orange;">PENDING ADMIN APPROVAL</span></li>
          </ul>

          <h3>Next Steps:</h3>
          <p>Your request is currently under review by our administration team. We will:</p>
          <ol>
            <li>Review your submitted documents</li>
            <li>Verify the requested capacity and reason</li>
            <li>Confirm availability for your requested date and time</li>
          </ol>

          <p><strong>You will receive:</strong></p>
          <ul>
            <li>An SMS notification once your booking is reviewed</li>
            <li>An email with final confirmation or additional requirements</li>
          </ul>

          <p>This review process typically takes 24-48 hours. For urgent requests, please contact us directly.</p>

          <p>Thank you for your patience.</p>
          <p>Sewanagala Sugar Factory Tour Team</p>
        `

        await sendEmail(email, emailSubject, emailBody)
        
        await connection.execute(
          `INSERT INTO special_booking_notifications (booking_id, notification_type, status) 
           VALUES (?, 'pending_email', 'sent')`,
          [bookingId]
        )
      } catch (emailError) {
        console.error('Email send failed:', emailError)
        await connection.execute(
          `INSERT INTO special_booking_notifications (booking_id, notification_type, status, response) 
           VALUES (?, 'pending_email', 'failed', ?)`,
          [bookingId, String(emailError)]
        )
      }

      connection.release()

      return NextResponse.json({
        success: true,
        message: 'Special booking request submitted successfully. Awaiting admin approval.',
        booking: {
          id: bookingId,
          booking_reference,
          status: 'pending',
          special_booking_status: 'pending',
        },
      })
    } catch (error) {
      await connection.rollback()
      connection.release()
      throw error
    }
  } catch (error: any) {
    console.error('Special booking creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create special booking' },
      { status: 500 }
    )
  }
}
