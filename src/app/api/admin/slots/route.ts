import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { authenticateRequest } from '@/lib/auth'

// GET: Fetch all configured time slots
export async function GET(request: NextRequest) {
  try {
    const user = authenticateRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if time_slots table exists, if not return default slots
    try {
      const [slots] = await pool.query(
        'SELECT * FROM time_slots ORDER BY start_time ASC'
      )
      
      return NextResponse.json({
        success: true,
        data: slots
      })
    } catch (error: any) {
      // If table doesn't exist, return default slots
      if (error.code === 'ER_NO_SUCH_TABLE') {
        const defaultSlots = [
          { id: 1, start_time: '08:00', end_time: '10:00', max_capacity: 30, is_active: true },
          { id: 2, start_time: '10:00', end_time: '12:00', max_capacity: 30, is_active: true },
          { id: 3, start_time: '12:00', end_time: '14:00', max_capacity: 30, is_active: true },
          { id: 4, start_time: '14:00', end_time: '16:00', max_capacity: 30, is_active: true }
        ]
        
        return NextResponse.json({
          success: true,
          data: defaultSlots,
          message: 'Using default slots. Database table will be created on first write operation.'
        })
      }
      throw error
    }
  } catch (error: any) {
    console.error('Error fetching slots:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch slots', error: error.message },
      { status: 500 }
    )
  }
}

// POST: Create a new time slot
export async function POST(request: NextRequest) {
  try {
    const user = authenticateRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { start_time, end_time, max_capacity, is_active } = body

    // Validate required fields
    if (!start_time || !end_time || !max_capacity) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate capacity
    if (max_capacity < 1 || max_capacity > 100) {
      return NextResponse.json(
        { success: false, message: 'Capacity must be between 1 and 100' },
        { status: 400 }
      )
    }

    // Create table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS time_slots (
        id INT AUTO_INCREMENT PRIMARY KEY,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        max_capacity INT NOT NULL DEFAULT 30,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    // Insert new slot
    const [result] = await pool.query(
      `INSERT INTO time_slots (start_time, end_time, max_capacity, is_active) 
       VALUES (?, ?, ?, ?)`,
      [start_time, end_time, max_capacity, is_active !== false]
    )

    const insertResult = result as any

    return NextResponse.json({
      success: true,
      message: 'Time slot created successfully',
      data: {
        id: insertResult.insertId,
        start_time,
        end_time,
        max_capacity,
        is_active: is_active !== false
      }
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating slot:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create slot', error: error.message },
      { status: 500 }
    )
  }
}

// PUT: Update a time slot
export async function PUT(request: NextRequest) {
  try {
    const user = authenticateRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id, start_time, end_time, max_capacity, is_active } = body

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Slot ID is required' },
        { status: 400 }
      )
    }

    // Build update query dynamically
    const updates: string[] = []
    const values: any[] = []

    if (start_time !== undefined) {
      updates.push('start_time = ?')
      values.push(start_time)
    }
    if (end_time !== undefined) {
      updates.push('end_time = ?')
      values.push(end_time)
    }
    if (max_capacity !== undefined) {
      if (max_capacity < 1 || max_capacity > 100) {
        return NextResponse.json(
          { success: false, message: 'Capacity must be between 1 and 100' },
          { status: 400 }
        )
      }
      updates.push('max_capacity = ?')
      values.push(max_capacity)
    }
    if (is_active !== undefined) {
      updates.push('is_active = ?')
      values.push(is_active)
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No fields to update' },
        { status: 400 }
      )
    }

    values.push(id)

    await pool.query(
      `UPDATE time_slots SET ${updates.join(', ')} WHERE id = ?`,
      values
    )

    return NextResponse.json({
      success: true,
      message: 'Time slot updated successfully'
    })
  } catch (error: any) {
    console.error('Error updating slot:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update slot', error: error.message },
      { status: 500 }
    )
  }
}

// DELETE: Delete a time slot
export async function DELETE(request: NextRequest) {
  try {
    const user = authenticateRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Slot ID is required' },
        { status: 400 }
      )
    }

    await pool.query('DELETE FROM time_slots WHERE id = ?', [id])

    return NextResponse.json({
      success: true,
      message: 'Time slot deleted successfully'
    })
  } catch (error: any) {
    console.error('Error deleting slot:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete slot', error: error.message },
      { status: 500 }
    )
  }
}
