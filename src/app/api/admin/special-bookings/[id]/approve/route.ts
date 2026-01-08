import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { verifyAuth } from '@/lib/auth'
import { sendEmail } from '@/lib/emailService'
import { sendSMS } from '@/lib/smsService'
import { ResultSetHeader, RowDataPacket } from 'mysql2'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { admin_review_notes, action } = body // action: 'approve' or 'reject'
    const bookingId = params.id

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const connection = await pool.getConnection()

    try {
      // Get booking details
      const [bookings] = await connection.execute<RowDataPacket[]>(
        `SELECT * FROM bookings WHERE id = ? AND is_special_booking = TRUE`,
        [bookingId]
      )

      if (bookings.length === 0) {
        connection.release()
        return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
      }

      const booking = bookings[0]

      // Update booking status
      const newStatus = action === 'approve' ? 'confirmed' : 'cancelled'
      const specialBookingStatus = action === 'approve' ? 'approved' : 'rejected'

      await connection.execute<ResultSetHeader>(
        `UPDATE bookings 
         SET status = ?, 
             special_booking_status = ?, 
             admin_review_notes = ?,
             reviewed_by = ?,
             reviewed_at = NOW(),
             updated_at = NOW()
         WHERE id = ?`,
        [newStatus, specialBookingStatus, admin_review_notes, authResult.user.email, bookingId]
      )

      // Send approval/rejection SMS
      try {
        const smsMessage =
          action === 'approve'
            ? `Sewanagala Sugar Factory Tour - APPROVED! Your special booking for ${booking.requested_capacity} visitors on ${booking.visit_date} at ${booking.visit_time} has been confirmed. Booking ID: ${booking.booking_reference}. Please arrive 15 minutes early.`
            : `Sewanagala Sugar Factory Tour - Your special booking request (ID: ${booking.booking_reference}) has been declined. Reason: ${admin_review_notes}. Please contact us for more information.`

        await sendSMS(booking.phone, smsMessage)

        await connection.execute(
          `INSERT INTO special_booking_notifications (booking_id, notification_type, status) 
           VALUES (?, ?, 'sent')`,
          [bookingId, action === 'approve' ? 'approved_sms' : 'rejected_sms']
        )
      } catch (smsError) {
        console.error('SMS send failed:', smsError)
        await connection.execute(
          `INSERT INTO special_booking_notifications (booking_id, notification_type, status, response) 
           VALUES (?, ?, 'failed', ?)`,
          [bookingId, action === 'approve' ? 'approved_sms' : 'rejected_sms', String(smsError)]
        )
      }

      // Send approval/rejection email
      try {
        let emailSubject, emailBody

        if (action === 'approve') {
          emailSubject = 'Special Booking Approved - Confirmed'
          emailBody = `
            <h2>Special Booking Approved!</h2>
            <p>Dear ${booking.name},</p>
            <p>Great news! Your special booking request has been <strong style="color: green;">APPROVED</strong>.</p>
            
            <h3>Confirmed Booking Details:</h3>
            <ul>
              <li><strong>Booking Reference:</strong> ${booking.booking_reference}</li>
              <li><strong>Approved Capacity:</strong> ${booking.requested_capacity} visitors</li>
              <li><strong>Date:</strong> ${booking.visit_date}</li>
              <li><strong>Time:</strong> ${booking.visit_time}</li>
              <li><strong>Status:</strong> <span style="color: green;">CONFIRMED</span></li>
            </ul>

            ${admin_review_notes ? `<h3>Admin Notes:</h3><p>${admin_review_notes}</p>` : ''}

            <h3>Important Reminders:</h3>
            <ul>
              <li>Please arrive 15 minutes before your scheduled time</li>
              <li>Bring this booking reference: <strong>${booking.booking_reference}</strong></li>
              <li>Ensure all ${booking.requested_capacity} visitors are present at the start time</li>
              <li>Follow all safety guidelines during the tour</li>
            </ul>

            <h3>Contact Information:</h3>
            <p>For any queries, contact us at:<br>
            Phone: +94 55 227 5271<br>
            Email: info@lankasugar.lk</p>

            <p>We look forward to welcoming your group!</p>
            <p>Sewanagala Sugar Factory Tour Team</p>
          `
        } else {
          emailSubject = 'Special Booking Request - Not Approved'
          emailBody = `
            <h2>Special Booking Request Update</h2>
            <p>Dear ${booking.name},</p>
            <p>Thank you for your special booking request. After careful review, we regret to inform you that we cannot approve your request at this time.</p>
            
            <h3>Request Details:</h3>
            <ul>
              <li><strong>Booking Reference:</strong> ${booking.booking_reference}</li>
              <li><strong>Requested Capacity:</strong> ${booking.requested_capacity} visitors</li>
              <li><strong>Requested Date:</strong> ${booking.visit_date}</li>
              <li><strong>Status:</strong> <span style="color: red;">NOT APPROVED</span></li>
            </ul>

            <h3>Reason:</h3>
            <p>${admin_review_notes}</p>

            <h3>Alternative Options:</h3>
            <p>We recommend the following alternatives:</p>
            <ul>
              <li>Request a different date with better availability</li>
              <li>Split your group into smaller batches (under 100 per slot)</li>
              <li>Contact us directly for customized arrangements</li>
            </ul>

            <h3>Contact Us:</h3>
            <p>For further assistance, please reach out:<br>
            Phone: +94 55 227 5271<br>
            Email: info@lankasugar.lk</p>

            <p>We apologize for any inconvenience and hope to serve you in the future.</p>
            <p>Sewanagala Sugar Factory Tour Team</p>
          `
        }

        await sendEmail(booking.email, emailSubject, emailBody)

        await connection.execute(
          `INSERT INTO special_booking_notifications (booking_id, notification_type, status) 
           VALUES (?, ?, 'sent')`,
          [bookingId, action === 'approve' ? 'approved_email' : 'rejected_email']
        )
      } catch (emailError) {
        console.error('Email send failed:', emailError)
        await connection.execute(
          `INSERT INTO special_booking_notifications (booking_id, notification_type, status, response) 
           VALUES (?, ?, 'failed', ?)`,
          [bookingId, action === 'approve' ? 'approved_email' : 'rejected_email', String(emailError)]
        )
      }

      // Log admin action
      await connection.execute(
        `INSERT INTO admin_actions (admin_email, action_type, booking_id, details, created_at) 
         VALUES (?, ?, ?, ?, NOW())`,
        [
          authResult.user.email,
          action === 'approve' ? 'special_booking_approved' : 'special_booking_rejected',
          bookingId,
          JSON.stringify({ admin_review_notes, requested_capacity: booking.requested_capacity }),
        ]
      )

      connection.release()

      return NextResponse.json({
        success: true,
        message: `Booking ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
        booking: {
          id: bookingId,
          status: newStatus,
          special_booking_status: specialBookingStatus,
        },
      })
    } catch (error) {
      connection.release()
      throw error
    }
  } catch (error: any) {
    console.error('Special booking approval error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process special booking' },
      { status: 500 }
    )
  }
}
