import { google } from 'googleapis'
import { getTokens, saveTokens } from './googleTokenStore'

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/google/callback'
const DEFAULT_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || 'primary'

function getOAuth2Client() {
  return new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
}

export function getAuthUrl(): string {
  const oauth2Client = getOAuth2Client()
  const scopes = ['https://www.googleapis.com/auth/calendar.readonly']
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes,
  })
}

export async function handleOAuthCallback(code: string) {
  const oauth2Client = getOAuth2Client()
  const { tokens } = await oauth2Client.getToken(code)
  await saveTokens(tokens)
  return tokens
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
  
  // Auto-refresh and save new tokens
  oauth2Client.on('tokens', async (tokens) => {
    if (tokens.access_token || tokens.refresh_token) {
      await saveTokens(tokens)
    }
  })
  
  return oauth2Client
}

function toISODateString(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function expandAllDayRange(startStr: string, endStr?: string): string[] {
  const days: string[] = []
  const start = new Date(startStr + 'T00:00:00')
  const end = endStr ? new Date(endStr + 'T00:00:00') : new Date(start)
  
  // Google Calendar end dates are exclusive for all-day events
  if (!endStr) {
    end.setDate(end.getDate() + 1)
  }
  
  for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
    days.push(toISODateString(d))
  }
  
  return days
}

export async function listMonthHolidays(
  year: number, 
  month: number, 
  calendarId = DEFAULT_CALENDAR_ID
): Promise<{ date: string; reason: string }[]> {
  try {
    const auth = await getAuthedClient()
    const calendar = google.calendar({ version: 'v3', auth })
    
    const timeMin = new Date(year, month - 1, 1)
    const timeMax = new Date(year, month, 0, 23, 59, 59, 999)

    const res = await calendar.events.list({
      calendarId,
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    })

    const events = res.data.items || []
    const holidays: { date: string; reason: string }[] = []
    
    for (const ev of events) {
      const summary = ev.summary || 'Holiday'
      
      if (ev.start?.date) {
        // All-day event
        const days = expandAllDayRange(ev.start.date, ev.end?.date)
        for (const date of days) {
          holidays.push({ date, reason: summary })
        }
      } else if (ev.start?.dateTime) {
        // Timed event - use the date part
        const date = toISODateString(new Date(ev.start.dateTime))
        holidays.push({ date, reason: summary })
      }
    }
    
    return holidays
  } catch (error: any) {
    console.error('Error fetching Google Calendar events:', error.message)
    // Return empty array if not connected yet
    return []
  }
}

export async function isConnected(): Promise<boolean> {
  try {
    const saved = await getTokens()
    return !!(saved && saved.refresh_token)
  } catch {
    return false
  }
}
