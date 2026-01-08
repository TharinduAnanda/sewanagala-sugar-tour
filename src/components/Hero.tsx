'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePos = useRef({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Advanced Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setCanvasSize()
    window.addEventListener('resize', setCanvasSize)

    // Particle system
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
      color: string
      life: number
      maxLife: number

      constructor() {
        this.x = 0
        this.y = 0
        this.size = 0
        this.speedX = 0
        this.speedY = 0
        this.opacity = 0
        this.color = ''
        this.life = 0
        this.maxLife = 0
        this.reset()
      }

      reset() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 2 + 1
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = Math.random() * -0.3 - 0.2
        this.opacity = Math.random() * 0.5 + 0.2
        this.color = Math.random() > 0.5 ? 'rgba(251, 191, 36,' : 'rgba(34, 197, 94,'
        this.life = Math.random() * 200 + 100
        this.maxLife = this.life
      }

      update() {
        this.x += this.speedX + (mousePos.current.x - 0.5) * 2
        this.y += this.speedY + (mousePos.current.y - 0.5) * 0.5
        this.life--
        this.opacity = (this.life / this.maxLife) * 0.6

        if (this.life <= 0 || this.y < 0 || this.x < 0 || this.x > canvas.width) {
          this.reset()
          this.y = canvas.height + 10
        }
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color + this.opacity + ')'
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()

        // Glow effect
        ctx.shadowBlur = 15
        ctx.shadowColor = this.color + '0.8)'
      }
    }

    // Wave distortion lines
    class WaveLine {
      baseY: number
      speed: number
      amplitude: number
      color: string
      offset: number

      constructor(y: number, speed: number, amplitude: number, color: string) {
        this.baseY = y
        this.speed = speed
        this.amplitude = amplitude
        this.color = color
        this.offset = Math.random() * Math.PI * 2
      }

      draw(time: number) {
        if (!ctx) return
        ctx.beginPath()
        ctx.strokeStyle = this.color
        ctx.lineWidth = 2
        ctx.globalAlpha = 0.15

        for (let x = 0; x < canvas.width; x += 5) {
          const y = this.baseY + Math.sin((x * 0.01) + (time * this.speed) + this.offset) * this.amplitude
          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.stroke()
        ctx.globalAlpha = 1
      }
    }

    const particles = Array.from({ length: 80 }, () => new Particle())
    const waves = [
      new WaveLine(canvas.height * 0.3, 0.001, 30, 'rgba(251, 191, 36, 0.6)'),
      new WaveLine(canvas.height * 0.5, 0.0015, 40, 'rgba(34, 197, 94, 0.5)'),
      new WaveLine(canvas.height * 0.7, 0.0008, 25, 'rgba(251, 146, 60, 0.4)')
    ]

    let animationFrameId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const time = Date.now() * 0.001

      // Draw waves
      waves.forEach(wave => wave.draw(time))

      // Draw connection lines between nearby particles
      ctx.globalAlpha = 0.1
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)'
            ctx.lineWidth = 1
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        })
      })
      ctx.globalAlpha = 1

      // Update and draw particles
      ctx.shadowBlur = 0
      particles.forEach(particle => {
        particle.update()
        particle.draw()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', setCanvasSize)
    }
  }, [])

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden cursor-white">
      
      {/* Hero Image with Parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="parallax-image absolute inset-0 w-full h-full transition-transform duration-100 ease-out"
          style={{
            backgroundImage: 'url("/images/sugarcane-field.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translate(${mousePos.current.x * 20 - 10}px, ${mousePos.current.y * 20 - 10}px) scale(1.1)`,
            filter: 'brightness(0.65) saturate(1.1)'
          }}
        />
      </div>

      {/* Animated Canvas Overlay */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-10"
      />

      {/* Dynamic Gradient Layers */}
      <div className="absolute inset-0 z-20">
        <div 
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            background: `radial-gradient(circle at ${mousePos.current.x * 100}% ${mousePos.current.y * 100}%, rgba(251, 191, 36, 0.15) 0%, transparent 60%)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/50 via-emerald-900/40 to-green-950/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
      </div>

      {/* Animated Scanlines */}
      <div className="absolute inset-0 z-25 pointer-events-none opacity-20">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34, 197, 94, 0.1) 2px, rgba(34, 197, 94, 0.1) 4px)',
            animation: 'scanlines 8s linear infinite'
          }}
        />
      </div>

      {/* Lens Flare Effect */}
      <div 
        className="absolute z-30 pointer-events-none transition-all duration-300"
        style={{
          left: `${mousePos.current.x * 100}%`,
          top: `${mousePos.current.y * 100}%`,
          width: '300px',
          height: '300px',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
          opacity: isLoaded ? 0.6 : 0
        }}
      />

      {/* Depth Field Blur Bokeh */}
      <div className="absolute inset-0 z-35 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${(i * 73 + 10) % 100}%`,
              top: `${(i * 47 + 15) % 100}%`,
              width: `${20 + i * 8}px`,
              height: `${20 + i * 8}px`,
              background: i % 3 === 0 
                ? 'radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(34, 197, 94, 0.25) 0%, transparent 70%)',
              filter: `blur(${15 + i * 2}px)`,
              opacity: isLoaded ? 0.4 : 0,
              transition: `all ${1 + i * 0.1}s ease-out ${i * 0.1}s`,
              animation: `bokehFloat ${8 + i * 2}s ease-in-out infinite ${i * 0.5}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-40 container mx-auto px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          
          {/* Animated Badge */}
          <div 
            className="inline-flex items-center gap-2 px-5 py-2.5 mb-8 rounded-full border border-emerald-400/50 backdrop-blur-xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.06))',
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
              transition: 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s',
              boxShadow: '0 0 60px rgba(34, 197, 94, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.3)'
            }}
          >
            <Sparkles className="w-4 h-4 text-amber-300 relative z-10" 
              style={{ animation: 'sparkle 2s ease-in-out infinite' }} />
            <span className="text-sm text-white font-semibold relative z-10">Est. 1986 • Premium Quality</span>
          </div>

          {/* Main Headline with Advanced Text Effects */}
          <h1 
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(40px)',
              transition: 'all 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.4s'
            }}
          >
            <span className="relative inline-block">
              <span 
                className="relative z-10 bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent"
                style={{
                  backgroundSize: '200% auto',
                  animation: 'gradientShift 4s ease-in-out infinite',
                  filter: 'drop-shadow(0 0 40px rgba(251, 191, 36, 0.6)) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.8))'
                }}
              >
                Sevanagala
              </span>
              <span 
                className="absolute inset-0 bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent blur-2xl opacity-50"
                style={{
                  backgroundSize: '200% auto',
                  animation: 'gradientShift 4s ease-in-out infinite'
                }}
              >
                Sevanagala
              </span>
            </span>
            <br />
            <span 
              className="text-white relative inline-block"
              style={{
                filter: 'drop-shadow(0 0 60px rgba(255, 255, 255, 0.4)) drop-shadow(0 6px 20px rgba(0, 0, 0, 0.9))'
              }}
            >
              Sugar Factory
            </span>
          </h1>

          {/* Subheading */}
          <p 
            className="text-xl sm:text-2xl md:text-3xl mb-4 font-semibold"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1) 0.8s',
              color: 'rgba(255, 255, 255, 0.95)',
              textShadow: '0 0 30px rgba(34, 197, 94, 0.5), 0 4px 15px rgba(0, 0, 0, 0.7)',
              animation: 'subtleGlow 4s ease-in-out infinite'
            }}
          >
            Producing Best Quality Natural Brown Sugar
          </p>

          {/* Description */}
          <p 
            className="text-base sm:text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 1s ease-out 1s',
              color: 'rgba(255, 255, 255, 0.85)',
              textShadow: '0 2px 15px rgba(0, 0, 0, 0.8)'
            }}
          >
            Experience the journey from farm to factory. Discover how sugar is made at Sri Lanka's premier sugar production facility.
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-20"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1) 1.2s'
            }}
          >
            <Link href="/tour">
              <button
                className="group relative px-8 py-4 rounded-xl overflow-hidden transition-all duration-500 hover:scale-110 hover:shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.9), rgba(16, 185, 129, 0.9))',
                  boxShadow: '0 0 40px rgba(34, 197, 94, 0.4), 0 10px 30px rgba(0, 0, 0, 0.5)'
                }}
              >
                <span className="relative flex items-center gap-2 text-white font-bold text-lg">
                  Start Virtual Tour
                  <ArrowRight className="w-5 h-5 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-125" />
                </span>
              </button>
            </Link>

            <Link href="/booking">
              <button
                className="group relative px-8 py-4 rounded-xl border-2 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:scale-110"
                style={{
                  borderColor: 'rgba(251, 191, 36, 0.6)',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
                  boxShadow: '0 0 30px rgba(251, 191, 36, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.3)'
                }}
              >
                <span className="relative text-white font-bold text-lg transition-all duration-300 group-hover:text-amber-100">
                  Book Physical Tour
                </span>
              </button>
            </Link>
          </div>

          {/* Stats Grid - WIDER CARDS */}
          <div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 xl:gap-8 max-w-7xl mx-auto"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(40px)',
              transition: 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1) 1.4s'
            }}
          >
            {[
              { value: '1,250', label: 'TCD Capacity' },
              { value: '38+', label: 'Years Strong' },
              { value: '25,000+', label: 'Families' },
              { value: '100%', label: 'Natural' }
            ].map((stat, i) => (
              <div
                key={i}
                className="group relative backdrop-blur-xl rounded-2xl py-4 px-8 border transition-all duration-700 hover:scale-105 cursor-pointer overflow-hidden text-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
                  transitionDelay: `${i * 100}ms`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.5)'
                  e.currentTarget.style.boxShadow = '0 0 60px rgba(34, 197, 94, 0.4), 0 8px 32px rgba(0, 0, 0, 0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.2)'
                }}
              >
                <h3 
                  className="relative text-3xl md:text-4xl font-bold mb-1"
                  style={{
                    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.5))'
                  }}
                >
                  {stat.value}
                </h3>
                <p className="relative text-sm text-white/80 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes subtleGlow {
          0%, 100% { text-shadow: 0 0 30px rgba(34, 197, 94, 0.5), 0 4px 15px rgba(0, 0, 0, 0.7); }
          50% { text-shadow: 0 0 40px rgba(34, 197, 94, 0.7), 0 4px 15px rgba(0, 0, 0, 0.7); }
        }

        @keyframes bokehFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, -30px) scale(1.1); }
          66% { transform: translate(-20px, -15px) scale(0.9); }
        }

        @keyframes scanlines {
          0% { transform: translateY(0); }
          100% { transform: translateY(20px); }
        }

        @keyframes sparkle {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
          50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
        }
      `}</style>
    </section>
  )
}
