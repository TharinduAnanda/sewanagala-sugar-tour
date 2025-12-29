import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

// GET /api/calendar/closures?start=2024-12-01&end=2024-12-31
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const start = searchParams.get('start')
    const end = searchParams.get('end')
    
    if (!start || !end) {
      return NextResponse.json({ 
        success: false, 
        error: 'Start and end dates are required' 
      }, { status: 400 })
    }

    const [closures] = await db.query<any[]>(
      `SELECT 
        id,
        closure_date as date,
        reason,
        closure_type as type,
        created_at as createdAt
      FROM factory_closures 
      WHERE closure_date BETWEEN ? AND ? 
      ORDER BY closure_date ASC`,
      [start, end]
    )
    
    return NextResponse.json(closures)
  } catch (error: any) {
    console.error('Error fetching closures:', error)
    return NextResponse.json([], { status: 200 })
  }
}

// POST /api/calendar/closures
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { date, reason, type } = body
    
    if (!date || !reason) {
      return NextResponse.json({ 
        success: false, 
        error: 'Date and reason are required' 
      }, { status: 400 })
    }

    const [result] = await db.query<any>(
      `INSERT INTO factory_closures (closure_date, reason, closure_type) 
       VALUES (?, ?, ?)`,
      [date, reason, type || 'other']
    )
    
    return NextResponse.json({ 
      success: true, 
      message: 'Closure added successfully',
      id: (result as any).insertId 
    }, { status: 201 })
  } catch (error: any) {
    if (error?.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ 
        success: false, 
        error: 'This date is already marked as closed' 
      }, { status: 400 })
    }
    console.error('Error adding closure:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}
