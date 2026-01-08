'use client'

import { useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { History, TrendingUp, Award } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TimelineSilhouette from '@/components/svgs/TimelineSilhouette'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function OurStorySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const featuredRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      if (titleRef.current) {
        const children = Array.from(titleRef.current.children)
        if (children.length > 0) {
          gsap.from(children, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          })
        }
      }

      // Cards slide from sides
      if (cardsRef.current) {
        const cards = Array.from(cardsRef.current.children)
        
        if (cards[0]) {
          gsap.from(cards[0], {
            x: -100,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          })
        }

        if (cards[1]) {
          gsap.from(cards[1], {
            x: 100,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          })
        }
      }

      // Featured card animation
      if (featuredRef.current) {
        gsap.from(featuredRef.current, {
          y: 60,
          opacity: 0,
          scale: 0.95,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: featuredRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        })
      }

      // Background silhouette animation
      const bgSvg = document.querySelector('.timeline-bg-svg')
      if (bgSvg && sectionRef.current) {
        gsap.fromTo(bgSvg,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 2,
            ease: 'power1.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-20 md:py-32 bg-gradient-to-b from-green-50/30 via-amber-50/20 to-green-50/30 overflow-hidden">
      {/* Timeline Silhouette Full Background */}
      <div className="timeline-bg-svg absolute inset-0 pointer-events-none opacity-0">
        <TimelineSilhouette className="w-full h-full text-amber-900" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-green-900">
            Our Story
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            From a remote rural village to Sri Lanka's premier sugar production center
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mt-6"></div>
        </div>

        {/* Timeline Cards - SKEWED/SLANTED DESIGN */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Left card - skewed right */}
          <div className="relative group">
            <div 
              className="relative overflow-hidden border-amber-100 border-2 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm"
              style={{
                transform: 'skewY(-2deg)',
                transformOrigin: 'top left'
              }}
            >
              <div 
                className="p-8"
                style={{
                  transform: 'skewY(2deg)'
                }}
              >
                <div className="w-16 h-16 mb-6 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                  <History className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-green-900 mb-4">Established 1986</h3>
                <p className="text-gray-700 text-lg leading-relaxed mb-4">
                  The Sevanagala Sugar Factory was established in 1986 in what was once a remote rural village. 
                  Originally operated as the Sri Lanka Sugar Corporation (SLSC) under government management with a 
                  production capacity of <strong>1,430 TCD</strong>.
                </p>
                <p className="text-gray-600 text-base">
                  The region was identified as ideal for sugarcane cultivation in 1980, transforming Sevanagala 
                  into a thriving agricultural community.
                </p>
              </div>
            </div>
          </div>

          {/* Right card - skewed left */}
          <div className="relative group">
            <div 
              className="relative overflow-hidden border-amber-100 border-2 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm"
              style={{
                transform: 'skewY(2deg)',
                transformOrigin: 'top right'
              }}
            >
              <div 
                className="p-8"
                style={{
                  transform: 'skewY(-2deg)'
                }}
              >
                <div className="w-16 h-16 mb-6 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-green-900 mb-4">Transformation & Growth</h3>
                <p className="text-gray-700 text-lg leading-relaxed mb-4">
                  Following privatization in <strong>2002</strong> and subsequent government recapture in <strong>2011</strong> 
                  under the Revival of Underperforming Enterprises Act, the facility was reborn as <strong>Lanka Sugar Company 
                  Private Limited</strong> in 2012.
                </p>
                <p className="text-gray-600 text-base">
                  Today, we operate at 1,250 TCD, continuing our legacy of excellence.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Achievement - SKEWED DESIGN */}
        <div ref={featuredRef}>
          <div 
            className="relative overflow-hidden border-green-100 border-2 shadow-2xl bg-gradient-to-br from-white via-green-50/40 to-amber-50/30 backdrop-blur-sm"
            style={{
              transform: 'skewY(-1deg)',
              transformOrigin: 'center'
            }}
          >
            <div 
              className="p-10 md:p-12"
              style={{
                transform: 'skewY(1deg)'
              }}
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-600 to-amber-600 flex items-center justify-center shadow-2xl flex-shrink-0">
                  <Award className="w-12 h-12 text-white" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">
                    Legacy of Excellence
                  </h3>
                  <p className="text-gray-700 text-xl leading-relaxed mb-4">
                    Operating under Lanka Sugar Company (Pvt) Ltd, a fully government-owned company managed 
                    by the Ministry of Industry and Entrepreneurship Development, we maintain the highest 
                    standards of quality, sustainability, and community responsibility.
                  </p>
                  <p className="text-gray-600 text-lg">
                    Our factory represents more than sugar production—it embodies the transformation of rural 
                    Sri Lanka, the empowerment of farming families, and the pursuit of agricultural self-sufficiency 
                    for our nation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
