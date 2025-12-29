'use client'

import { useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface QRCodeGeneratorProps {
  value: string
  size?: number
  title?: string
}

export default function QRCodeGenerator({ value, size = 200, title = 'Scan QR Code' }: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !value) return

    // Simple QR code generation using a library would be better
    // For now, we'll show a placeholder
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    if (ctx) {
      // Clear canvas
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, size, size)
      
      // Draw placeholder
      ctx.fillStyle = 'black'
      ctx.font = '14px monospace'
      ctx.textAlign = 'center'
      ctx.fillText('QR Code', size / 2, size / 2 - 20)
      ctx.fillText(value.substring(0, 20), size / 2, size / 2)
      ctx.fillText('(Install qrcode library)', size / 2, size / 2 + 20)
    }
  }, [value, size])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="border rounded-lg"
        />
      </CardContent>
    </Card>
  )
}
