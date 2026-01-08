'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function SugarcanePattern() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (svgRef.current) {
      const paths = svgRef.current.querySelectorAll('path')
      gsap.from(paths, {
        opacity: 0,
        y: 20,
        duration: 1,
        stagger: 0.1,
        ease: 'power2.out'
      })
    }
  }, [])

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full opacity-10"
      viewBox="0 0 1200 800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sugarcane stalks pattern */}
      {[...Array(12)].map((_, i) => (
        <g key={i} transform={`translate(${i * 100}, 0)`}>
          <path
            d={`M ${50 + (i % 3) * 10} 0 Q ${55 + (i % 3) * 10} 200 ${50 + (i % 3) * 10} 400 T ${50 + (i % 3) * 10} 800`}
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            className="text-green-600"
          />
          {/* Leaves */}
          <path
            d={`M ${50 + (i % 3) * 10} ${100 + i * 40} Q ${80 + (i % 3) * 10} ${120 + i * 40} ${70 + (i % 3) * 10} ${150 + i * 40}`}
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-green-500"
          />
          <path
            d={`M ${50 + (i % 3) * 10} ${100 + i * 40} Q ${20 + (i % 3) * 10} ${120 + i * 40} ${30 + (i % 3) * 10} ${150 + i * 40}`}
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-green-500"
          />
        </g>
      ))}
    </svg>
  )
}
