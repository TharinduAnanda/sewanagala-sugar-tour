'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Leaf, Droplets, Recycle, Sun } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { animations, timings, easings, staggers, createScrollAnimation } from '@/lib/animations'
import ImpactSilhouette from '@/components/svgs/ImpactSilhouette'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function ImpactSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  const impacts = [
    {
      icon: Leaf,
      title: 'Employment Generation',
      description: 'Providing jobs for permanent, casual, and seasonal workers throughout the year, supporting rural livelihoods.',
      stat: '25,000+',
      statLabel: 'Families Supported',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Droplets,
      title: 'Rural Transformation',
      description: 'Transforming Sevanagala from a dismissed village to a thriving agricultural hub with modern infrastructure.',
      stat: '1980',
      statLabel: 'Started Development',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Recycle,
      title: 'Zero Waste Initiative',
      description: 'Converting agricultural by-products into bio-compost and renewable energy, minimizing environmental impact.',
      stat: '100%',
      statLabel: 'By-products Utilized',
      color: 'from-amber-500 to-orange-600'
    },
    {
      icon: Sun,
      title: 'Sustainable Energy',
      description: 'Generating clean power from bagasse and supporting environmental goals through renewable energy production.',
      stat: 'Clean',
      statLabel: 'Energy Generated',
      color: 'from-yellow-500 to-orange-500'
    }
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      if (titleRef.current) {
        const children = Array.from(titleRef.current.children)
        if (children.length > 0) {
          gsap.fromTo(children,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: timings.standard,
              stagger: staggers.tight,
              ease: easings.smooth,
              scrollTrigger: {
                trigger: titleRef.current,
                start: 'top 80%',
                toggleActions: 'play none none none'
              }
            }
          )
        }
      }

      // Image reveal
      if (imageRef.current) {
        createScrollAnimation(
          imageRef.current,
          animations.imageReveal,
          imageRef.current
        )

        // Parallax on image
        gsap.to(imageRef.current, {
          y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: imageRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5
          }
        })
      }

      // Cards animation
      if (cardsRef.current) {
        const cards = Array.from(cardsRef.current.children)
        
        if (cards.length > 0) {
          gsap.fromTo(cards,
            { y: 60, opacity: 0, scale: 0.95 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: timings.standard,
              stagger: staggers.relaxed,
              ease: easings.smooth,
              scrollTrigger: {
                trigger: cardsRef.current,
                start: 'top 80%',
                toggleActions: 'play none none none'
              }
            }
          )

          cards.forEach((card) => {
            const icon = card.querySelector('.impact-icon')
            if (icon) {
              gsap.fromTo(icon,
                { scale: 0.5, opacity: 0, rotation: -20 },
                {
                  scale: 1,
                  opacity: 1,
                  rotation: 0,
                  duration: timings.standard,
                  ease: easings.smooth,
                  scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                  }
                }
              )
            }
          })
        }
      }

      // Background silhouette animation
      const bgSvg = document.querySelector('.impact-bg-svg')
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

  const handleCardHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const icon = e.currentTarget.querySelector('.impact-icon')
    
    gsap.to(e.currentTarget, {
      y: -10,
      scale: 1.05,
      rotation: 2,
      duration: timings.fast,
      ease: easings.smooth
    })
    
    if (icon) {
      gsap.to(icon, {
        scale: 1.2,
        rotation: 10,
        duration: timings.fast,
        ease: easings.smooth
      })
    }
  }

  const handleCardHoverOut = (e: React.MouseEvent<HTMLDivElement>) => {
    const icon = e.currentTarget.querySelector('.impact-icon')
    
    gsap.to(e.currentTarget, {
      y: 0,
      scale: 1,
      rotation: 0,
      duration: timings.fast,
      ease: easings.smooth
    })
    
    if (icon) {
      gsap.to(icon, {
        scale: 1,
        rotation: 0,
        duration: timings.fast,
        ease: easings.smooth
      })
    }
  }

  return (
    <section ref={sectionRef} className="relative py-20 md:py-32 bg-gradient-to-b from-blue-50/30 via-green-50/20 to-blue-50/30 overflow-hidden">
      {/* Impact Silhouette Full Background */}
      <div className="impact-bg-svg absolute inset-0 pointer-events-none opacity-0">
        <ImpactSilhouette className="w-full h-full text-blue-900" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-green-900">
            Our Impact
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Creating lasting positive change in rural Sri Lanka through sustainable development
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent mx-auto mt-6"></div>
        </div>

        {/* Hero Image */}
        <div ref={imageRef} className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-2xl mb-16">
          <Image
            src="/images/sustainable-future.jpg"
            alt="Sustainable farming practices"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-green-900/70 via-green-900/30 to-transparent"></div>
          <div className="absolute bottom-8 left-8 text-white">
            <h3 className="text-3xl md:text-4xl font-bold mb-2">Building a Sustainable Future</h3>
            <p className="text-lg md:text-xl">Community, Environment, and Prosperity</p>
          </div>
        </div>

        {/* Impact Cards - DIAMOND/RHOMBUS DESIGN */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 py-12">
          {impacts.map((impact) => (
            <div
              key={impact.title}
              onMouseEnter={handleCardHover}
              onMouseLeave={handleCardHoverOut}
              className="cursor-pointer flex justify-center items-center py-8"
            >
              <div 
                className="relative w-full max-w-sm h-96 border-2 border-blue-100 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm"
                style={{
                  transform: 'rotate(45deg)',
                  transformOrigin: 'center'
                }}
              >
                <div 
                  className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 py-8"
                  style={{
                    transform: 'rotate(-45deg)'
                  }}
                >
                  <div className={`impact-icon w-16 h-16 rounded-full bg-gradient-to-br ${impact.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <impact.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-lg md:text-xl font-bold text-green-900 mb-3 max-w-[180px]">{impact.title}</h3>
                  <p className="text-gray-700 text-xs md:text-sm leading-relaxed mb-4 max-w-[200px]">{impact.description}</p>
                  
                  <div className="pt-4 border-t-2 border-blue-200 w-full max-w-[180px]">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-2xl md:text-3xl font-bold text-blue-600">{impact.stat}</span>
                      <span className="text-gray-600 text-xs">{impact.statLabel}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Context */}
        <div className="mt-8 text-center max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl md:text-3xl font-bold text-green-900 mb-4">
            Creating Shared Value
          </h3>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Our factory represents more than sugar production—it embodies the <strong>transformation of rural Sri Lanka</strong>, 
            the empowerment of farming families, and the pursuit of agricultural self-sufficiency for our nation.
          </p>
          <p className="text-base text-gray-600 leading-relaxed">
            From providing stable incomes to building infrastructure, from generating renewable energy to fostering 
            peaceful, harmonious communities—we create lasting positive change that extends far beyond our factory walls.
          </p>
        </div>
      </div>
    </section>
  )
}


