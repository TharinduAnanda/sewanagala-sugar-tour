'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function CustomCursor() {
  const pathname = usePathname()
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHero, setIsHero] = useState(false)
  const [isHeaderFooter, setIsHeaderFooter] = useState(false)

  // Hide cursor on admin pages
  const isAdminPage = pathname?.startsWith('/admin')

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })

      // Check if mouse is over Hero section
      const heroElement = document.querySelector('section')
      if (heroElement) {
        const rect = heroElement.getBoundingClientRect()
        const isInHero = e.clientY >= rect.top && e.clientY <= rect.bottom
        setIsHero(isInHero)
      }

      // Check if mouse is over Header or Footer
      const headerElement = document.querySelector('header')
      const footerElement = document.querySelector('footer')
      
      let isInHeaderFooter = false
      
      if (headerElement) {
        const headerRect = headerElement.getBoundingClientRect()
        if (e.clientY >= headerRect.top && e.clientY <= headerRect.bottom) {
          isInHeaderFooter = true
        }
      }
      
      if (footerElement) {
        const footerRect = footerElement.getBoundingClientRect()
        if (e.clientY >= footerRect.top && e.clientY <= footerRect.bottom) {
          isInHeaderFooter = true
        }
      }
      
      setIsHeaderFooter(isInHeaderFooter)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Don't render on admin pages
  if (isAdminPage) return null

  // Determine cursor color based on location
  const isWhite = isHero || isHeaderFooter

  return (
    <div
      className="fixed pointer-events-none z-[9999] transition-all duration-100 ease-out"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Soft dissolving glow - no sharp edges */}
      <div
        className="w-16 h-16 rounded-full transition-all duration-300"
        style={{
          background: isWhite 
            ? 'radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 15%, rgba(255, 255, 255, 0.3) 35%, rgba(255, 255, 255, 0.1) 60%, transparent 100%)' 
            : 'radial-gradient(circle, rgba(34, 197, 94, 0.9) 0%, rgba(34, 197, 94, 0.6) 15%, rgba(34, 197, 94, 0.3) 35%, rgba(34, 197, 94, 0.1) 60%, transparent 100%)',
          filter: 'blur(2px)',
        }}
      />
      
      {/* Core bright center */}
      <div
        className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full transition-all duration-300"
        style={{
          transform: 'translate(-50%, -50%)',
          background: isWhite 
            ? 'radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.5) 70%, transparent 100%)' 
            : 'radial-gradient(circle, rgba(34, 197, 94, 1) 0%, rgba(34, 197, 94, 0.5) 70%, transparent 100%)',
          filter: 'blur(1px)',
        }}
      />
    </div>
  )
}
