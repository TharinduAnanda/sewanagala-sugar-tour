import { NextRequest, NextResponse } from 'next/server'
import { handleOAuthCallback } from '@/lib/googleCalendar'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')
    
    if (!code) {
      return new NextResponse(
        '<h3 style="color: red;">Error: Missing authorization code</h3>',
        { headers: { 'Content-Type': 'text/html' }, status: 400 }
      )
    }
    
    await handleOAuthCallback(code)
    
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Google Calendar Connected</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .card {
              background: white;
              padding: 3rem;
              border-radius: 1rem;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
              text-align: center;
            }
            .success {
              color: #10b981;
              font-size: 4rem;
              margin-bottom: 1rem;
            }
            h1 {
              color: #1f2937;
              margin-bottom: 0.5rem;
            }
            p {
              color: #6b7280;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="success">✓</div>
            <h1>Google Calendar Connected!</h1>
            <p>Mercantile holidays will now sync automatically.</p>
            <p style="margin-top: 1.5rem; font-size: 0.875rem;">You can close this tab.</p>
          </div>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' },
    })
  } catch (error: any) {
    console.error('OAuth callback error:', error)
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Connection Failed</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background: #fee;
            }
            .card {
              background: white;
              padding: 2rem;
              border-radius: 1rem;
              box-shadow: 0 10px 30px rgba(0,0,0,0.2);
              text-align: center;
            }
            h1 { color: #dc2626; }
            p { color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Connection Failed</h1>
            <p>${error.message}</p>
          </div>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' },
      status: 500
    })
  }
}
