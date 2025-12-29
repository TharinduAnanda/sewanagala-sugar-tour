import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { Station } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    
    let query = 'SELECT * FROM stations WHERE is_active = 1'
    const params: any[] = []
    
    if (category) {
      query += ' AND category = ?'
      params.push(category)
    }
    
    query += ' ORDER BY station_number ASC'
    
    const [stations] = await pool.query(query, params)
    
    return NextResponse.json({
      success: true,
      data: stations
    })
  } catch (error: any) {
    console.error('Error fetching stations:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch stations' },
      { status: 500 }
    )
  }
}
