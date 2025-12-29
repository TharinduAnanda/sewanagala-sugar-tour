import { NextRequest, NextResponse } from 'next/server'
import { isConnected } from '@/lib/googleCalendar'

export async function GET(req: NextRequest) {
  try {
    const connected = await isConnected()
    return NextResponse.json({ 
      success: true, 
      connected,
      message: connected ? 'Google Calendar is connected' : 'Google Calendar is not connected'
    })
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      connected: false,
      error: error.message 
    }, { status: 500 })
  }
}
