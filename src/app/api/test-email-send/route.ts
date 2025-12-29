import { NextRequest, NextResponse } from 'next/server'
import { sendBookingConfirmationEmail, testEmailConnection } from '@/lib/emailService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const testEmail = searchParams.get('email') || 'tharindulalanath49@gmail.com'
    
    console.log('=== EMAIL TEST STARTED ===')
    
    // Step 1: Test email connection
    console.log('Step 1: Testing email server connection...')
    const connectionTest = await testEmailConnection()
    
    if (!connectionTest.success) {
      return NextResponse.json({
        success: false,
        step: 'connection',
        message: 'Email server connection failed',
        error: connectionTest.message,
        details: {
          host: process.env.EMAIL_HOST || 'smtp.gmail.com',
          port: process.env.EMAIL_PORT || '587',
          user: process.env.EMAIL_USER || 'Not set in .env.local',
          hasPassword: !!process.env.EMAIL_APP_PASSWORD
        }
      }, { status: 500 })
    }
    
    console.log('Step 1: Connection successful!')
    
    // Step 2: Prepare test booking data
    console.log('Step 2: Preparing test booking data...')
    const testBookingData = {
      booking_id: 'TEST-' + Date.now().toString(36).toUpperCase(),
      name: 'Test User',
      email: testEmail,
      phone: '+94771234567',
      visit_date: '2025-12-30',
      visit_time: '10:00 AM',
      visitor_count: 5,
      booking_date: new Date().toISOString().split('T')[0]
    }
    
    console.log('Test booking data:', testBookingData)
    
    // Step 3: Send test email
    console.log('Step 3: Sending test email...')
    const emailResult = await sendBookingConfirmationEmail(testBookingData)
    
    if (!emailResult.success) {
      return NextResponse.json({
        success: false,
        step: 'email_send',
        message: 'Email sending failed',
        error: emailResult.error,
        bookingData: testBookingData
      }, { status: 500 })
    }
    
    console.log('Step 3: Email sent successfully!')
    console.log('=== EMAIL TEST COMPLETED SUCCESSFULLY ===')
    
    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully!',
      details: {
        recipient: testEmail,
        bookingId: testBookingData.booking_id,
        timestamp: new Date().toISOString(),
        connectionStatus: 'Connected',
        emailStatus: 'Sent'
      },
      instructions: 'Check your inbox (and spam folder) for the test email.'
    })
    
  } catch (error: any) {
    console.error('=== EMAIL TEST FAILED ===')
    console.error('Error:', error)
    
    return NextResponse.json({
      success: false,
      step: 'unknown',
      message: 'Unexpected error during email test',
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, bookingId } = body
    
    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email address is required'
      }, { status: 400 })
    }
    
    console.log('=== CUSTOM EMAIL TEST STARTED ===')
    
    const testBookingData = {
      booking_id: bookingId || 'TEST-' + Date.now().toString(36).toUpperCase(),
      name: name || 'Test User',
      email: email,
      phone: '+94771234567',
      visit_date: '2025-12-30',
      visit_time: '10:00 AM',
      visitor_count: 5,
      booking_date: new Date().toISOString().split('T')[0]
    }
    
    const emailResult = await sendBookingConfirmationEmail(testBookingData)
    
    if (!emailResult.success) {
      return NextResponse.json({
        success: false,
        message: 'Email sending failed',
        error: emailResult.error
      }, { status: 500 })
    }
    
    console.log('=== CUSTOM EMAIL TEST COMPLETED ===')
    
    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully!',
      details: {
        recipient: email,
        bookingId: testBookingData.booking_id
      }
    })
    
  } catch (error: any) {
    console.error('Custom email test failed:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to send test email',
      error: error.message
    }, { status: 500 })
  }
}
