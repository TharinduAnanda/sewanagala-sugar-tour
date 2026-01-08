'use client'

import { useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { FaArrowRight } from 'react-icons/fa'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subheadingRef = useRef<HTMLParagraphElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const sunriseRef = useRef<HTMLDivElement>(null)
  const orb1Ref = useRef<HTMLDivElement>(null)
  const orb2Ref = useRef<HTMLDivElement>(null)
  const orb3Ref = useRef<HTMLDivElement>(null)
  const sugarcaneSilRef = useRef<HTMLDivElement>(null)
  const factorySilRef = useRef<HTMLDivElement>(null)
  const landscapeSilRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)

  // Generate deterministic "random" values for SSR consistency
  const sugarcaneHeights = useMemo(() => [
    280, 320, 290, 310, 270, 300, 330, 285, 305, 315, 295, 275, 325, 290, 310
  ], [])

  const particlePositions = useMemo(() => 
    Array.from({ length: 25 }, (_, i) => ({
      left: (i * 37 + 23) % 100, // Deterministic "random" left position
      top: (i * 41 + 67) % 50 + 50 // Deterministic "random" top position
    }))
  , [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      // PHASE 1: Background (0-2s)
      // Step 1.2 - Sunrise gradient sweeps
      if (sunriseRef.current) {
        tl.fromTo(sunriseRef.current,
          { x: '-100%', opacity: 0 },
          { x: '0%', opacity: 1, duration: 2, ease: 'power2.out' },
          0.3
        )
      }

      // Step 1.3 - Gradient orbs float in
      if (orb1Ref.current) {
        tl.fromTo(orb1Ref.current,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.5, ease: 'power2.out' },
          0.5
        )
      }
      if (orb2Ref.current) {
        tl.fromTo(orb2Ref.current,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.5, ease: 'power2.out' },
          0.7
        )
      }
      if (orb3Ref.current) {
        tl.fromTo(orb3Ref.current,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.5, ease: 'power2.out' },
          0.9
        )
      }

      // PHASE 2: Silhouettes (0.8-2.5s)
      // Step 2.1 - Sugarcane silhouette
      if (sugarcaneSilRef.current) {
        tl.fromTo(sugarcaneSilRef.current,
          { y: 100, opacity: 0 },
          { y: 0, opacity: 0.3, duration: 1.2, ease: 'power2.out' },
          0.8
        )
      }

      // Step 2.2 - Factory silhouette
      if (factorySilRef.current) {
        tl.fromTo(factorySilRef.current,
          { y: 100, opacity: 0 },
          { y: 0, opacity: 0.3, duration: 1.2, ease: 'power2.out' },
          1.0
        )
      }

      // Step 2.3 - Background landscape
      if (landscapeSilRef.current) {
        tl.fromTo(landscapeSilRef.current,
          { opacity: 0 },
          { opacity: 0.15, duration: 1.5 },
          1.2
        )
      }

      // PHASE 3: Content Entry (1.5-3s)
      // Step 3.1 - Main headline with crystallization
      if (headlineRef.current) {
        tl.fromTo(headlineRef.current,
          { filter: 'blur(10px)', scale: 0.95, opacity: 0 },
          { 
            filter: 'blur(0px)', 
            scale: 1, 
            opacity: 1, 
            duration: 1, 
            ease: 'power3.out',
            onUpdate: function() {
              const progress = this.progress()
              if (progress < 0.4 && headlineRef.current) {
                headlineRef.current.style.filter = `blur(${10 - progress * 12.5}px)`
                headlineRef.current.style.opacity = `${progress * 1.25}`
              }
            }
          },
          1.5
        )
      }

      // Step 3.2 - Subheading
      if (subheadingRef.current) {
        tl.fromTo(subheadingRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
          1.8
        )
      }

      // Step 3.3 - Description
      if (descriptionRef.current) {
        tl.fromTo(descriptionRef.current,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 0.8, duration: 0.7, ease: 'power2.out' },
          2.0
        )
      }

      // PHASE 4: Interactive Elements (2.2-3.2s)
      // Step 4.1 - Statistics cards
      if (statsRef.current) {
        const cards = Array.from(statsRef.current.children)
        cards.forEach((card, i) => {
          tl.fromTo(card,
            { scale: 0.8, y: 30, opacity: 0 },
            { scale: 1, y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.3)' },
            2.2 + (i * 0.15)
          )
        })
      }

      // Step 4.2 - CTA buttons
      if (buttonsRef.current) {
        tl.fromTo(buttonsRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
          2.8
        )
      }

      // PHASE 5: Continuous Animations
      // Background gradient shift
      if (sunriseRef.current) {
        gsap.to(sunriseRef.current, {
          x: '10%',
          duration: 15,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true
        })
      }

      // Gradient orbs float
      if (orb1Ref.current) {
        gsap.to(orb1Ref.current, {
          x: 30,
          y: -20,
          duration: 8,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true
        })
      }
      if (orb2Ref.current) {
        gsap.to(orb2Ref.current, {
          x: -40,
          y: 25,
          duration: 10,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true
        })
      }
      if (orb3Ref.current) {
        gsap.to(orb3Ref.current, {
          rotation: 360,
          scale: 1.05,
          duration: 12,
          ease: 'none',
          repeat: -1
        })
      }

      // Silhouette parallax on scroll
      if (sugarcaneSilRef.current && heroRef.current) {
        gsap.to(sugarcaneSilRef.current, {
          y: -50,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        })
      }
      if (factorySilRef.current && heroRef.current) {
        gsap.to(factorySilRef.current, {
          y: -80,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        })
      }
      if (landscapeSilRef.current && heroRef.current) {
        gsap.to(landscapeSilRef.current, {
          y: -30,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        })
      }

      // Golden particles animation
      if (particlesRef.current) {
        const particles = particlesRef.current.querySelectorAll('.particle')
        particles.forEach((particle, i) => {
          // Use deterministic durations based on index
          const duration = 6 + ((i * 3) % 4)
          gsap.to(particle, {
            y: -100,
            opacity: 0,
            duration: duration,
            delay: i * 0.1,
            repeat: -1,
            ease: 'none'
          })
        })
      }

    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Layer 1 - Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-green-800 to-amber-900 z-0" />

      {/* Layer 2 - Animated Gradient Overlay (Sunrise) */}
      <div 
        ref={sunriseRef}
        className="absolute inset-0 bg-gradient-to-r from-amber-600/40 via-orange-500/20 to-transparent z-5"
      />

      {/* Layer 3 - Subtle Mesh Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-green-50/10 to-transparent z-10" />

      {/* Layer 4 - Hero Image */}
      <div className="absolute inset-0 z-15 opacity-60 mix-blend-overlay">
        <Image
          src="/images/hero.jpg"
          alt="Sevanagala Sugar Factory"
          fill
          className="object-cover"
          priority
          quality={95}
        />
      </div>

      {/* NEW: Dark Overlay for Better Contrast */}
      <div className="absolute inset-0 z-16 bg-gradient-to-br from-black/50 via-green-900/40 to-black/50" />

      {/* Animated Gradient Orbs */}
      <div 
        ref={orb1Ref}
        className="absolute top-[10%] left-[10%] w-[500px] h-[500px] rounded-full z-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(217, 119, 6, 0.3) 0%, transparent 70%)',
          filter: 'blur(70px)'
        }}
      />
      <div 
        ref={orb2Ref}
        className="absolute bottom-[15%] right-[10%] w-[600px] h-[600px] rounded-full z-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, rgba(16, 185, 129, 0.1) 50%, transparent 70%)',
          filter: 'blur(80px)'
        }}
      />
      <div 
        ref={orb3Ref}
        className="absolute top-[50%] left-[50%] w-[350px] h-[350px] rounded-full z-20 pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, transparent 70%)',
          filter: 'blur(55px)'
        }}
      />

      {/* Silhouette Elements */}
      {/* Position C - Background landscape (full width) */}
      <div 
        ref={landscapeSilRef}
        className="absolute bottom-0 left-0 right-0 h-[60%] z-25 pointer-events-none"
        style={{ opacity: 0 }}
      >
        <svg viewBox="0 0 1200 400" className="w-full h-full" preserveAspectRatio="xMidYMax slice">
          <path 
            d="M0,400 L0,300 Q200,280 400,290 T800,300 Q1000,310 1200,290 L1200,400 Z" 
            fill="black" 
            opacity="0.15"
          />
        </svg>
      </div>

      {/* Position A - Sugarcane stalks (left) */}
      <div 
        ref={sugarcaneSilRef}
        className="absolute bottom-0 left-0 w-[30%] h-[45%] z-30 pointer-events-none"
        style={{ opacity: 0 }}
      >
        <svg viewBox="0 0 300 400" className="w-full h-full" preserveAspectRatio="xMinYMax meet">
          {sugarcaneHeights.map((height, i) => {
            const x = 20 + i * 18
            return (
              <g key={i}>
                <rect x={x} y={400 - height} width="8" height={height} fill="black" opacity="0.3" />
                <ellipse cx={x + 4} cy={400 - height + 30} rx="20" ry="6" fill="black" opacity="0.25" transform={`rotate(-45 ${x + 4} ${400 - height + 30})`} />
              </g>
            )
          })}
        </svg>
      </div>

      {/* Position B - Factory building (right) */}
      <div 
        ref={factorySilRef}
        className="absolute bottom-0 right-0 w-[30%] h-[40%] z-30 pointer-events-none"
        style={{ opacity: 0 }}
      >
        <svg viewBox="0 0 300 350" className="w-full h-full" preserveAspectRatio="xMaxYMax meet">
          <rect x="50" y="150" width="200" height="200" fill="black" opacity="0.3" />
          <rect x="100" y="100" width="100" height="50" fill="black" opacity="0.25" />
          <rect x="120" y="50" width="60" height="50" fill="black" opacity="0.25" />
          <circle cx="150" cy="30" r="15" fill="rgba(20, 83, 45, 0.2)" />
          <rect x="70" y="200" width="30" height="40" fill="black" opacity="0.2" />
          <rect x="200" y="200" width="30" height="40" fill="black" opacity="0.2" />
        </svg>
      </div>

      {/* Golden Particles */}
      <div ref={particlesRef} className="absolute inset-0 z-35 pointer-events-none overflow-hidden">
        {particlePositions.map((pos, i) => (
          <div
            key={i}
            className="particle absolute w-1 h-1 bg-amber-400 rounded-full"
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
              boxShadow: '0 0 10px rgba(251, 191, 36, 0.5)'
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container relative z-40 mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="max-w-5xl mx-auto">
          {/* Main Headline */}
          <h1 
            ref={headlineRef}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight"
            style={{
              color: 'white',
              textShadow: '0 4px 20px rgba(20, 83, 45, 0.4)'
            }}
          >
            Sevanagala Sugar Factory
          </h1>
          
          {/* Subheading */}
          <p 
            ref={subheadingRef}
            className="text-xl sm:text-2xl md:text-3xl mb-4 font-medium text-amber-50"
          >
            Producing Best Quality Natural Brown Sugar
          </p>
          
          {/* Description */}
          <p 
            ref={descriptionRef}
            className="text-base sm:text-lg md:text-xl mb-10 max-w-[700px] mx-auto leading-relaxed"
            style={{ color: 'rgba(236, 253, 245, 0.8)' }}
          >
            Experience the journey from farm to factory. Discover how sugar is made at Sri Lanka's premier sugar production facility since 1986.
          </p>
          
          {/* CTA Buttons */}
          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/tour">
              <Button 
                size="lg" 
                className="w-full sm:w-auto text-base md:text-lg px-8 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-400 hover:to-emerald-500 transition-all duration-300"
                style={{ boxShadow: '0 0 30px rgba(34, 197, 94, 0.3)' }}
              >
                Start Virtual Tour
                <FaArrowRight className="ml-2" />
              </Button>
            </Link>
            <Link href="/booking">
              <Button 
                size="lg" 
                className="w-full sm:w-auto text-base md:text-lg px-8 py-3 rounded-lg bg-transparent text-amber-50 border-2 border-amber-400 hover:bg-amber-600/20 hover:border-amber-300 hover:text-amber-100 transition-all duration-300"
              >
                Book Physical Tour
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
          <div 
            className="stat-card backdrop-blur-md rounded-lg p-6 border border-white/20 transition-all duration-300 cursor-pointer hover:scale-105"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, {
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)',
                borderColor: 'rgba(74, 222, 128, 0.3)',
                boxShadow: '0 8px 30px rgba(34, 197, 94, 0.2)',
                duration: 0.3
              })
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, {
                background: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                duration: 0.3
              })
            }}
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-2 text-amber-400">1,250</h3>
            <p className="text-sm text-green-50/70">TCD Capacity</p>
          </div>
          
          <div 
            className="stat-card backdrop-blur-md rounded-lg p-6 border border-white/20 transition-all duration-300 cursor-pointer hover:scale-105"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, {
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)',
                borderColor: 'rgba(74, 222, 128, 0.3)',
                boxShadow: '0 8px 30px rgba(34, 197, 94, 0.2)',
                duration: 0.3
              })
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, {
                background: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                duration: 0.3
              })
            }}
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-2 text-amber-400">38+</h3>
            <p className="text-sm text-green-50/70">Years Strong</p>
          </div>
          
          <div 
            className="stat-card backdrop-blur-md rounded-lg p-6 border border-white/20 transition-all duration-300 cursor-pointer hover:scale-105"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, {
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)',
                borderColor: 'rgba(74, 222, 128, 0.3)',
                boxShadow: '0 8px 30px rgba(34, 197, 94, 0.2)',
                duration: 0.3
              })
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, {
                background: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                duration: 0.3
              })
            }}
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-2 text-amber-400">25,000+</h3>
            <p className="text-sm text-green-50/70">Families</p>
          </div>
          
          <div 
            className="stat-card backdrop-blur-md rounded-lg p-6 border border-white/20 transition-all duration-300 cursor-pointer hover:scale-105"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, {
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)',
                borderColor: 'rgba(74, 222, 128, 0.3)',
                boxShadow: '0 8px 30px rgba(34, 197, 94, 0.2)',
                duration: 0.3
              })
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, {
                background: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                duration: 0.3
              })
            }}
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-2 text-amber-400">100%</h3>
            <p className="text-sm text-green-50/70">Natural</p>
          </div>
        </div>
      </div>
    </section>
  )
}
