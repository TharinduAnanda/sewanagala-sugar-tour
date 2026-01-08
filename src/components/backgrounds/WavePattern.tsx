'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function WavePattern() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (svgRef.current) {
      const wave1 = svgRef.current.querySelector('.wave-1')
      const wave2 = svgRef.current.querySelector('.wave-2')
      const wave3 = svgRef.current.querySelector('.wave-3')

      gsap.to(wave1, {
        x: -30,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })

      gsap.to(wave2, {
        x: 30,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })

      gsap.to(wave3, {
        x: -20,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
    }
  }, [])

  return (
    <svg
      ref={svgRef}
      className="absolute bottom-0 left-0 w-full h-32 opacity-20"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="wave-1 text-green-400"
        d="M0,50 Q300,10 600,50 T1200,50 L1200,120 L0,120 Z"
        fill="currentColor"
      />
      <path
        className="wave-2 text-green-500"
        d="M0,70 Q300,30 600,70 T1200,70 L1200,120 L0,120 Z"
        fill="currentColor"
      />
      <path
        className="wave-3 text-green-600"
        d="M0,90 Q300,60 600,90 T1200,90 L1200,120 L0,120 Z"
        fill="currentColor"
      />
    </svg>
  )
}
