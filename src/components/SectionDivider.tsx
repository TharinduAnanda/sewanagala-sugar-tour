'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import FactorySilhouette from './svgs/FactorySilhouette'
import SugarcaneSilhouette from './svgs/SugarcaneSilhouette'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface SectionDividerProps {
  type?: 'factory' | 'sugarcane'
  position?: 'top' | 'bottom'
  className?: string
  gradientFrom?: string
  gradientTo?: string
}

export default function SectionDivider({ 
  type = 'factory', 
  position = 'bottom',
  className = '',
  gradientFrom = 'from-white',
  gradientTo = 'to-transparent'
}: SectionDividerProps) {
  const dividerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!dividerRef.current) return

    const ctx = gsap.context(() => {
      // Fade in animation
      gsap.fromTo(dividerRef.current,
        { opacity: 0, y: position === 'bottom' ? 20 : -20 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: dividerRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none'
          }
        }
      )

      // Subtle parallax
      gsap.to(dividerRef.current, {
        y: position === 'bottom' ? -20 : 20,
        ease: 'none',
        scrollTrigger: {
          trigger: dividerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5
        }
      })
    }, dividerRef)

    return () => ctx.revert()
  }, [position])

  const SilhouetteComponent = type === 'factory' ? FactorySilhouette : SugarcaneSilhouette

  return (
    <div 
      ref={dividerRef}
      className={`relative w-full overflow-hidden pointer-events-none ${
        position === 'bottom' ? '-mb-1' : '-mt-1'
      } ${className}`}
      style={{ zIndex: 10 }}
    >
      {/* Gradient Background */}
      <div 
        className={`absolute inset-0 bg-gradient-to-${position === 'bottom' ? 't' : 'b'} ${gradientFrom} ${gradientTo}`}
      />
      
      {/* Silhouette */}
      <div className="relative">
        <SilhouetteComponent 
          className={`w-full ${type === 'factory' ? 'h-24 md:h-32 lg:h-40' : 'h-32 md:h-40 lg:h-48'} text-green-900/15`}
        />
      </div>
    </div>
  )
}
