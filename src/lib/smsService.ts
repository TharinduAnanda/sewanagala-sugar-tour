import axios from 'axios'

// SMS Configuration for Notify.lk
const NOTIFY_CONFIG = {
  userId: process.env.NOTIFY_USER_ID || '30646',
  apiKey: process.env.NOTIFY_API_KEY || 'l8H0miN4hXIfe7c2BAlz',
  senderId: process.env.NOTIFY_SENDER_ID || 'NotifyDEMO',
  apiUrl: 'https://app.notify.lk/api/v1/send'
}

export interface BookingSMSData {
  booking_id: string
  mobile_number: string
  tour_date: string
  tour_time: string
}

// Format date to "25 Dec 2025" format
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }
  return date.toLocaleDateString('en-GB', options)
}

// Format time to "10:00 AM" format
const formatTime = (timeString: string): string => {
  if (!timeString) return 'TBA'
  
  const [hours, minutes] = timeString.split(':')
  const hour = parseInt(hours)
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  
  return `${displayHour}:${minutes} ${period}`
}

// Format phone number to Sri Lankan format with country code
const formatPhoneNumber = (phoneNumber: string): string => {
  // Remove all non-digit characters
  const cleanNumber = phoneNumber.replace(/\D/g, '')
  
  // Add country code if not present
  if (cleanNumber.startsWith('0')) {
    return '94' + cleanNumber.substring(1)
  } else if (!cleanNumber.startsWith('94')) {
    return '94' + cleanNumber
  }
  
  return cleanNumber
}

// Send booking confirmation SMS
export async function sendBookingConfirmationSMS(
  bookingData: BookingSMSData,
  retryCount: number = 0
): Promise<{ success: boolean; message: string; error?: string }> {
  const MAX_RETRIES = 2
  
  try {
    const { booking_id, mobile_number, tour_date, tour_time } = bookingData

    // Validate required fields
    if (!booking_id || !mobile_number || !tour_date || !tour_time) {
      throw new Error('Missing required SMS fields')
    }

    // Format phone number
    const formattedNumber = formatPhoneNumber(mobile_number)

    // Validate phone number length
    if (formattedNumber.length < 11 || formattedNumber.length > 12) {
      throw new Error('Invalid phone number format')
    }

    // Create SMS message
    const message = `Sewanagala Sugar Factory Tour confirmed.
Booking ID: ${booking_id}
Date: ${formatDate(tour_date)}
Time: ${formatTime(tour_time)}
Please arrive 15 mins early.`

    // Prepare API request
    const requestData = {
      user_id: NOTIFY_CONFIG.userId,
      api_key: NOTIFY_CONFIG.apiKey,
      sender_id: NOTIFY_CONFIG.senderId,
      to: formattedNumber,
      message: message
    }

    console.log(`Sending SMS to ${formattedNumber} (attempt ${retryCount + 1})`)

    // Send SMS via Notify.lk API
    const response = await axios.post(NOTIFY_CONFIG.apiUrl, requestData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 15000 // 15 second timeout
    })

    console.log('SMS sent successfully:', response.data)

    return {
      success: true,
      message: 'SMS sent successfully'
    }

  } catch (error: any) {
    console.error(`SMS sending failed (attempt ${retryCount + 1}):`, error.message)
    
    // Retry logic for network errors
    if (retryCount < MAX_RETRIES && (!error.response || error.code === 'ECONNABORTED')) {
      console.log(`Retrying in ${(retryCount + 1) * 2} seconds...`)
      await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 2000))
      return sendBookingConfirmationSMS(bookingData, retryCount + 1)
    }
    
    if (error.response) {
      console.error('SMS API Error Response:', error.response.data)
      return {
        success: false,
        message: 'Failed to send SMS: API Error',
        error: error.response.data.message || 'Unknown API error'
      }
    }

    return {
      success: false,
      message: 'Failed to send SMS: Network error',
      error: error.message
    }
  }
}

// Send tour reminder SMS (for future use)
export async function sendTourReminderSMS(
  bookingData: BookingSMSData
): Promise<{ success: boolean; message: string }> {
  try {
    const { booking_id, mobile_number, tour_date, tour_time } = bookingData
    const formattedNumber = formatPhoneNumber(mobile_number)

    const message = `Reminder: Your Sewanagala Sugar Factory tour is tomorrow!
Booking ID: ${booking_id}
Date: ${formatDate(tour_date)}
Time: ${formatTime(tour_time)}
See you soon!`

    const requestData = {
      user_id: NOTIFY_CONFIG.userId,
      api_key: NOTIFY_CONFIG.apiKey,
      sender_id: NOTIFY_CONFIG.senderId,
      to: formattedNumber,
      message: message
    }

    await axios.post(NOTIFY_CONFIG.apiUrl, requestData, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000
    })

    console.log('Reminder SMS sent successfully')
    return { success: true, message: 'Reminder SMS sent successfully' }

  } catch (error: any) {
    console.error('Reminder SMS failed:', error.message)
    return { success: false, message: 'Failed to send reminder SMS' }
  }
}

export { formatDate, formatTime, formatPhoneNumber }
