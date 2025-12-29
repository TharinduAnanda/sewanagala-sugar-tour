import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username and password are required' },
        { status: 400 }
      )
    }
    
    const [admins] = await pool.query(
      'SELECT * FROM admins WHERE username = ? OR email = ?',
      [username, username]
    )
    
    const adminsArray = admins as any[]
    
    if (adminsArray.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }
    
    const admin = adminsArray[0]
    const isValidPassword = await bcrypt.compare(password, admin.password)
    
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }
    
    const token = signToken({
      userId: admin.id,
      username: admin.username,
      role: admin.role
    })
    
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    })
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, message: 'Login failed' },
      { status: 500 }
    )
  }
}
