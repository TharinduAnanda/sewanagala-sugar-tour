import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { stationId: string } }
) {
  try {
    const [media] = await pool.query(
      'SELECT * FROM station_media WHERE station_id = ? ORDER BY upload_date DESC',
      [params.stationId]
    )
    
    return NextResponse.json({
      success: true,
      data: media
    })
  } catch (error: any) {
    console.error('Error fetching media:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch media' },
      { status: 500 }
    )
  }
}
