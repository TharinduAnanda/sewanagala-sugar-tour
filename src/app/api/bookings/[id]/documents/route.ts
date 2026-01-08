import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { verifyAuth } from '@/lib/auth'
import { RowDataPacket } from 'mysql2'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const bookingId = params.id

    const [documents] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        id,
        document_type,
        document_url,
        cloudinary_public_id,
        file_name,
        file_size,
        mime_type,
        uploaded_at
       FROM special_booking_documents 
       WHERE booking_id = ?
       ORDER BY uploaded_at DESC`,
      [bookingId]
    )

    return NextResponse.json({ success: true, data: documents })
  } catch (error: any) {
    console.error('Fetch documents error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch documents' },
      { status: 500 }
    )
  }
}
