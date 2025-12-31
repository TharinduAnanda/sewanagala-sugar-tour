import nodemailer from 'nodemailer'
import BookingConfirmationEmail from '@/emails/BookingConfirmation'

// Email configuration
const EMAIL_CONFIG = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'tharindulalanath49@gmail.com',
    pass: process.env.EMAIL_APP_PASSWORD || 'pekn uqhy kklc ltjh'
  }
}

// Create transporter
const transporter = nodemailer.createTransport(EMAIL_CONFIG)

export interface BookingEmailData {
  booking_id: string
  name: string
  email: string
  phone: string
  visit_date: string
  visit_time: string
  visitor_count: number
  booking_date: string
}

// Send booking confirmation email (without PDF attachment)
export async function sendBookingConfirmationEmail(bookingData: BookingEmailData): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    console.log('Starting email send process for:', bookingData.email)
    
    // Verify transporter
    try {
      await transporter.verify()
      console.log('Email server connection verified')
    } catch (verifyError: any) {
      console.error('Email server verification failed:', verifyError.message)
      throw new Error('Email server connection failed: ' + verifyError.message)
    }

    // Generate HTML from email template (returns plain HTML string)
    console.log('Rendering email template...')
    const htmlContent = BookingConfirmationEmail({
      ...bookingData
    })

    console.log('Email template rendered successfully')

    // Prepare email options (no PDF attachment)
    const mailOptions: any = {
      from: {
        name: 'Sewanagala Sugar Factory Tours',
        address: EMAIL_CONFIG.auth.user
      },
      to: bookingData.email,
      subject: `Tour Booking Confirmed - ${bookingData.booking_id}`,
      html: htmlContent
    }

    console.log('Sending email to:', bookingData.email)

    // Send email
    const info = await transporter.sendMail(mailOptions)

    console.log('Email sent successfully to', bookingData.email, 'MessageID:', info.messageId)

    return {
      success: true,
      message: 'Email sent successfully with booking confirmation'
    }
  } catch (error: any) {
    console.error('Email sending failed:', error.message)
    console.error('Full error:', error)
    return {
      success: false,
      message: 'Failed to send email',
      error: error.message
    }
  }
}

// Test email connection
export async function testEmailConnection(): Promise<{ success: boolean; message: string }> {
  try {
    await transporter.verify()
    console.log('Email server connection verified')
    return { success: true, message: 'Email server is ready' }
  } catch (error: any) {
    console.error('Email server connection failed:', error.message)
    return { success: false, message: 'Email server connection failed: ' + error.message }
  }
}


