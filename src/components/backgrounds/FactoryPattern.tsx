'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function FactoryPattern() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (svgRef.current) {
      const elements = svgRef.current.querySelectorAll('.animate-element')
      gsap.from(elements, {
        scale: 0,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'back.out(1.7)'
      })
    }
  }, [])

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full opacity-5"
      viewBox="0 0 1200 800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Factory buildings pattern */}
      <g className="animate-element">
        <rect x="100" y="400" width="150" height="300" fill="currentColor" className="text-green-800" />
        <polygon points="100,400 175,350 250,400" fill="currentColor" className="text-green-700" />
      </g>
      
      <g className="animate-element">
        <rect x="300" y="450" width="120" height="250" fill="currentColor" className="text-green-800" />
        <polygon points="300,450 360,420 420,450" fill="currentColor" className="text-green-700" />
      </g>
      
      <g className="animate-element">
        <rect x="500" y="380" width="180" height="320" fill="currentColor" className="text-green-800" />
        <polygon points="500,380 590,330 680,380" fill="currentColor" className="text-green-700" />
      </g>

      {/* Smokestacks */}
      <g className="animate-element">
        <rect x="550" y="200" width="30" height="180" fill="currentColor" className="text-green-900" />
        <ellipse cx="565" cy="200" rx="20" ry="10" fill="currentColor" className="text-green-700" />
      </g>
      
      <g className="animate-element">
        <rect x="800" y="250" width="25" height="150" fill="currentColor" className="text-green-900" />
        <ellipse cx="812.5" cy="250" rx="17" ry="8" fill="currentColor" className="text-green-700" />
      </g>

      {/* Gears/Machinery icons scattered */}
      {[...Array(8)].map((_, i) => (
        <circle
          key={i}
          className="animate-element text-green-600"
          cx={200 + i * 120}
          cy={150 + (i % 3) * 150}
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />
      ))}
    </svg>
  )
}
