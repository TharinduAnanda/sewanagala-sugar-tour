import nodemailer from 'nodemailer'
import BookingConfirmationEmail from '@/emails/BookingConfirmation'

// Email configuration with better error handling
const EMAIL_CONFIG = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  },
  // Additional options for better compatibility
  tls: {
    rejectUnauthorized: false, // Allow self-signed certificates in development
    ciphers: 'SSLv3'
  },
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000,
  debug: process.env.NODE_ENV === 'development', // Enable debug in development
  logger: process.env.NODE_ENV === 'development' // Enable logging in development
}

// Check if email is configured
const isEmailConfigured = !!(EMAIL_CONFIG.auth.user && EMAIL_CONFIG.auth.pass)

// Create transporter only if configured
let transporter: nodemailer.Transporter | null = null

if (isEmailConfigured) {
  try {
    transporter = nodemailer.createTransport(EMAIL_CONFIG)
    console.log('✅ Email transporter created successfully')
  } catch (error) {
    console.error('❌ Failed to create email transporter:', error)
  }
} else {
  console.warn('⚠️  Email service not configured - missing EMAIL_USER or EMAIL_APP_PASSWORD environment variables')
}

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
    // Check if email is configured
    if (!isEmailConfigured || !transporter) {
      console.warn('⚠️  Email service not configured, skipping email send')
      return {
        success: false,
        message: 'Email service not configured on server',
        error: 'EMAIL_USER or EMAIL_APP_PASSWORD not set'
      }
    }

    console.log('📧 Starting email send process for:', bookingData.email)
    
    // Verify transporter connection
    try {
      await transporter.verify()
      console.log('✅ Email server connection verified')
    } catch (verifyError: any) {
      console.error('❌ Email server verification failed:', verifyError.message)
      throw new Error('Email server connection failed: ' + verifyError.message)
    }

    // Generate HTML from email template
    console.log('🎨 Rendering email template...')
    const htmlContent = BookingConfirmationEmail({
      ...bookingData
    })

    console.log('✅ Email template rendered successfully')

    // Prepare email options
    const mailOptions: any = {
      from: {
        name: 'Sewanagala Sugar Factory Tours',
        address: EMAIL_CONFIG.auth.user!
      },
      to: bookingData.email,
      subject: `Tour Booking Confirmed - ${bookingData.booking_id}`,
      html: htmlContent,
      // Add text fallback
      text: `Your tour booking has been confirmed!\n\nBooking ID: ${bookingData.booking_id}\nName: ${bookingData.name}\nDate: ${bookingData.visit_date}\nTime: ${bookingData.visit_time}\nVisitors: ${bookingData.visitor_count}\n\nThank you for booking with Sewanagala Sugar Factory Tours!`
    }

    console.log('📤 Sending email to:', bookingData.email)

    // Send email with timeout
    const sendPromise = transporter.sendMail(mailOptions)
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Email send timeout after 30 seconds')), 30000)
    )

    const info = await Promise.race([sendPromise, timeoutPromise]) as any

    console.log('✅ Email sent successfully to', bookingData.email, 'MessageID:', info.messageId)

    return {
      success: true,
      message: 'Email sent successfully with booking confirmation'
    }
  } catch (error: any) {
    console.error('❌ Email sending failed:', error.message)
    console.error('Full error:', error)
    
    // Provide more specific error messages
    let errorMessage = error.message
    if (error.code === 'ECONNREFUSED') {
      errorMessage = 'Could not connect to email server. Please check EMAIL_HOST and EMAIL_PORT.'
    } else if (error.code === 'EAUTH') {
      errorMessage = 'Email authentication failed. Please check EMAIL_USER and EMAIL_APP_PASSWORD.'
    } else if (error.responseCode === 535) {
      errorMessage = 'Email authentication failed. Please use an App-Specific Password for Gmail.'
    }
    
    return {
      success: false,
      message: 'Failed to send email',
      error: errorMessage
    }
  }
}

// Test email connection
export async function testEmailConnection(): Promise<{ success: boolean; message: string; details?: any }> {
  try {
    if (!isEmailConfigured || !transporter) {
      return { 
        success: false, 
        message: 'Email service not configured',
        details: {
          configured: false,
          hasUser: !!process.env.EMAIL_USER,
          hasPassword: !!process.env.EMAIL_APP_PASSWORD,
          host: process.env.EMAIL_HOST || 'not set',
          port: process.env.EMAIL_PORT || 'not set'
        }
      }
    }

    console.log('🔍 Testing email server connection...')
    await transporter.verify()
    console.log('✅ Email server connection verified')
    
    return { 
      success: true, 
      message: 'Email server is ready',
      details: {
        configured: true,
        host: EMAIL_CONFIG.host,
        port: EMAIL_CONFIG.port,
        user: EMAIL_CONFIG.auth.user,
        secure: EMAIL_CONFIG.secure
      }
    }
  } catch (error: any) {
    console.error('❌ Email server connection failed:', error.message)
    
    let troubleshooting = []
    if (error.code === 'ECONNREFUSED') {
      troubleshooting.push('Check if EMAIL_HOST and EMAIL_PORT are correct')
      troubleshooting.push('Verify firewall/network allows outbound SMTP connections')
    } else if (error.code === 'EAUTH' || error.responseCode === 535) {
      troubleshooting.push('Check if EMAIL_USER and EMAIL_APP_PASSWORD are correct')
      troubleshooting.push('For Gmail, use App-Specific Password (not regular password)')
      troubleshooting.push('Enable 2-Factor Authentication and generate App Password')
    }
    
    return { 
      success: false, 
      message: 'Email server connection failed: ' + error.message,
      details: {
        error: error.message,
        code: error.code,
        responseCode: error.responseCode,
        troubleshooting
      }
    }
  }
}
