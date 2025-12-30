import { google } from 'googleapis'
import { getTokens } from './googleTokenStore'

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/google/callback'
const DEFAULT_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || 'primary'

function getOAuth2Client() {
  return new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
}

async function getAuthedClient() {
  const oauth2Client = getOAuth2Client()
  const saved = await getTokens()
  
  if (!saved || !saved.refresh_token) {
    throw new Error('Google Calendar not connected. Please connect via /api/google/connect')
  }
  
  oauth2Client.setCredentials({
    access_token: saved.access_token,
    refresh_token: saved.refresh_token,
    scope: saved.scope,
    token_type: saved.token_type,
    expiry_date: saved.expiry_date,
  })
  
  return oauth2Client
}

export async function addHolidayEvent(
  date: string, 
  name: string, 
  calendarId = DEFAULT_CALENDAR_ID
): Promise<{ success: boolean; eventId?: string; error?: string }> {
  try {
    const auth = await getAuthedClient()
    const calendar = google.calendar({ version: 'v3', auth })
    
    // Check if event already exists
    const existing = await calendar.events.list({
      calendarId,
      timeMin: new Date(date + 'T00:00:00').toISOString(),
      timeMax: new Date(date + 'T23:59:59').toISOString(),
      q: name,
    })
    
    if (existing.data.items && existing.data.items.length > 0) {
      return { 
        success: true, 
        eventId: existing.data.items[0].id || undefined,
        error: 'Event already exists' 
      }
    }
    
    // Create all-day event
    const event = {
      summary: name,
      description: 'Sri Lankan Mercantile Holiday',
      start: { date },
      end: { date },
      colorId: '9', // Blue color for holidays
      transparency: 'transparent',
    }
    
    const response = await calendar.events.insert({
      calendarId,
      requestBody: event,
    })
    
    return { 
      success: true, 
      eventId: response.data.id || undefined 
    }
  } catch (error: any) {
    console.error('Error adding holiday event:', error.message)
    return { 
      success: false, 
      error: error.message 
    }
  }
}

export async function bulkAddHolidays(
  holidays: { date: string; name: string }[],
  calendarId = DEFAULT_CALENDAR_ID
): Promise<{ success: boolean; added: number; skipped: number; errors: string[] }> {
  let added = 0
  let skipped = 0
  const errors: string[] = []
  
  for (const holiday of holidays) {
    const result = await addHolidayEvent(holiday.date, holiday.name, calendarId)
    
    if (result.success) {
      if (result.error === 'Event already exists') {
        skipped++
      } else {
        added++
      }
    } else {
      errors.push(`${holiday.date}: ${result.error}`)
    }
    
    // Rate limiting: wait 100ms between requests
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  return { 
    success: errors.length === 0, 
    added, 
    skipped, 
    errors 
  }
}

export async function deleteHolidayEvent(
  eventId: string,
  calendarId = DEFAULT_CALENDAR_ID
): Promise<{ success: boolean; error?: string }> {
  try {
    const auth = await getAuthedClient()
    const calendar = google.calendar({ version: 'v3', auth })
    
    await calendar.events.delete({
      calendarId,
      eventId,
    })
    
    return { success: true }
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message 
    }
  }
}
