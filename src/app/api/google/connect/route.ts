import { NextRequest, NextResponse } from 'next/server'
import { getAuthUrl } from '@/lib/googleCalendar'

export async function GET(req: NextRequest) {
  try {
    const url = getAuthUrl()
    return NextResponse.redirect(url)
  } catch (error: any) {
    console.error('Error generating auth URL:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}
