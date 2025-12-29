import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const SRI_LANKAN_HOLIDAYS_CALENDAR_ID = "en.lk#holiday@group.v.calendar.google.com";

export async function GET(request: NextRequest) {
  try {
    const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    
    if (!GOOGLE_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          message: 'Google API Key not configured',
          error: 'NEXT_PUBLIC_GOOGLE_API_KEY is missing from environment variables',
        },
        { status: 500 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const year = searchParams.get('year') || new Date().getFullYear().toString();
    const month = searchParams.get('month');

    let timeMin: string;
    let timeMax: string;

    if (month) {
      const monthNum = parseInt(month);
      const yearNum = parseInt(year);
      timeMin = new Date(yearNum, monthNum - 1, 1).toISOString();
      timeMax = new Date(yearNum, monthNum, 0, 23, 59, 59).toISOString();
    } else {
      const yearNum = parseInt(year);
      timeMin = new Date(yearNum, 0, 1).toISOString();
      timeMax = new Date(yearNum + 1, 0, 1).toISOString();
    }

    console.log('Fetching holidays from Google Calendar...');
    console.log('Date range:', timeMin, 'to', timeMax);

    // Fetch from Google Calendar API
    const response = await axios.get(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(SRI_LANKAN_HOLIDAYS_CALENDAR_ID)}/events`,
      {
        params: {
          key: GOOGLE_API_KEY,
          timeMin: timeMin,
          timeMax: timeMax,
          singleEvents: true,
          orderBy: 'startTime',
        },
      }
    );

    const events = response.data.items || [];
    console.log(`Found ${events.length} holidays`);
    
    const holidays = events.map((event: any) => ({
      date: event.start.date || event.start.dateTime?.split('T')[0],
      name: event.summary || 'Holiday',
      description: event.description || '',
    }));

    return NextResponse.json({
      success: true,
      data: holidays,
    });
  } catch (error: any) {
    console.error('Error fetching holidays:', error.response?.data || error.message);
    console.error('Full error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch holidays',
        error: error.response?.data?.error?.message || error.message,
        details: error.response?.data,
      },
      { status: 500 }
    );
  }
}
