'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Package, Droplet, Zap, Leaf } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { animations, timings, easings, staggers, createScrollAnimation } from '@/lib/animations'
import ProductsSilhouette from '@/components/svgs/ProductsSilhouette'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function ProductsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const productsRef = useRef<HTMLDivElement>(null)

  const products = [
    {
      icon: Package,
      title: 'Natural Brown Sugar',
      description: 'Sri Lanka\'s finest natural brown sugar from the first crystallization of sugarcane. Free from additional dyes and chemicals, maintaining natural qualities and superior taste.',
      stat: '~8 tons',
      statLabel: 'Per 100 tons of cane',
      color: 'from-amber-500 to-yellow-600'
    },
    {
      icon: Droplet,
      title: 'Potable Alcohol & Ethanol',
      description: 'High-quality potable alcohol (ethyl) and ethanol for industrial use, produced through advanced distillation processes meeting international standards.',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Zap,
      title: 'Power Generation',
      description: 'Sustainable energy production utilizing bagasse and other by-products, contributing to environmental goals and supporting sustainable operations.',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      icon: Leaf,
      title: 'Bio-Compost',
      description: 'Organic fertilizer produced from agricultural by-products, supporting sustainable farming practices and enhancing soil health.',
      color: 'from-green-500 to-emerald-600'
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

      // Hero image reveal
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

      // Products cards animation
      if (productsRef.current) {
        const cards = Array.from(productsRef.current.children)
        
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
                trigger: productsRef.current,
                start: 'top 80%',
                toggleActions: 'play none none none'
              }
            }
          )

          // Animate icons
          cards.forEach((card) => {
            const icon = card.querySelector('.product-icon')
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
      const bgSvg = document.querySelector('.products-bg-svg')
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
    const icon = e.currentTarget.querySelector('.product-icon')
    
    gsap.to(e.currentTarget, {
      y: -10,
      scale: 1.03,
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
    const icon = e.currentTarget.querySelector('.product-icon')
    
    gsap.to(e.currentTarget, {
      y: 0,
      scale: 1,
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
    <section ref={sectionRef} className="relative py-20 md:py-32 bg-gradient-to-b from-amber-50/30 via-yellow-50/20 to-amber-50/30 overflow-hidden">
      {/* Products Silhouette Full Background */}
      <div className="products-bg-svg absolute inset-0 pointer-events-none opacity-0">
        <ProductsSilhouette className="w-full h-full text-amber-900" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-green-900">
            Our Products & Services
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Premium quality sugar and sustainable by-products from our diversified production facility
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mt-6"></div>
        </div>

        {/* Hero Image */}
        <div ref={imageRef} className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-2xl mb-16">
          <Image
            src="/images/sections/sugar-products.jpg"
            alt="Sugar products from Sevanagala"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-amber-900/70 via-amber-900/30 to-transparent"></div>
          <div className="absolute bottom-8 left-8 text-white">
            <h3 className="text-3xl md:text-4xl font-bold mb-2">Premium Natural Brown Sugar</h3>
            <p className="text-lg md:text-xl">Sweetness from Nature, Quality from Tradition</p>
          </div>
        </div>

        {/* Products Grid - ORGANIC BLOB SHAPES */}
        <div ref={productsRef} className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {products.map((product, index) => (
            <div
              key={product.title}
              onMouseEnter={handleCardHover}
              onMouseLeave={handleCardHoverOut}
              className="cursor-pointer flex items-center justify-center"
            >
              <div 
                className="w-full border-2 border-amber-100 shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white/90 backdrop-blur-sm overflow-hidden"
                style={{
                  borderRadius: index % 2 === 0 
                    ? '60% 40% 30% 70% / 60% 30% 70% 40%' 
                    : '40% 60% 70% 30% / 40% 70% 30% 60%',
                  minHeight: '400px'
                }}
              >
                <div className="p-10 h-full flex flex-col justify-center">
                  <div className={`product-icon w-16 h-16 rounded-full bg-gradient-to-br ${product.color} flex items-center justify-center mb-5 shadow-lg mx-auto`}>
                    <product.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl md:text-2xl font-bold text-green-900 mb-3 text-center">{product.title}</h3>
                  <p className="text-gray-700 text-base leading-relaxed mb-4 text-center">{product.description}</p>
                  
                  {product.stat && (
                    <div className="mt-auto pt-5 border-t border-amber-200">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-2xl font-bold text-amber-600">{product.stat}</span>
                        <span className="text-gray-600 text-sm">{product.statLabel}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Context */}
        <div className="mt-16 text-center max-w-4xl mx-auto">
          <p className="text-lg text-gray-700 leading-relaxed">
            Beyond sugar, our extensive facility houses <strong>subsidiary companies</strong> that maximize the 
            value of every ton of sugarcane processed, ensuring sustainable operations and minimal waste.
          </p>
        </div>
      </div>
    </section>
  )
}
