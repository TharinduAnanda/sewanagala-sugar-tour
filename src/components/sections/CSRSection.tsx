'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, Home, Droplets, Building, TrendingUp, Users, ShoppingCart, GraduationCap, Stethoscope, Zap, Trees, Bus, Recycle } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CSRSilhouette from '@/components/svgs/CSRSilhouette'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function CSRSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const heroImageRef = useRef<HTMLDivElement>(null)
  const topCardsRef = useRef<HTMLDivElement>(null)
  const facilitiesRef = useRef<HTMLDivElement>(null)
  const bannerRef = useRef<HTMLDivElement>(null)
  const initiativesImageRef = useRef<HTMLDivElement>(null)
  const initiativesRef = useRef<HTMLDivElement>(null)
  const environmentRef = useRef<HTMLDivElement>(null)
  const envImageRef = useRef<HTMLDivElement>(null)

  const facilities = [
    {
      icon: ShoppingCart,
      title: 'Shopping',
      description: 'Commercial facilities',
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: GraduationCap,
      title: 'Education',
      description: 'Schools & support',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Stethoscope,
      title: 'Healthcare',
      description: 'Medical services',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Home,
      title: 'Housing',
      description: 'Accommodation',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      icon: Bus,
      title: 'Transport',
      description: 'Reliable services',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      icon: Zap,
      title: 'Utilities',
      description: 'Power & water',
      color: 'from-pink-500 to-rose-600'
    }
  ]

  const initiatives = [
    {
      icon: Home,
      title: 'Housing',
      description: 'Building homes for families',
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: Droplets,
      title: 'Water Access',
      description: 'Drinking water sources',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Building,
      title: 'Irrigation',
      description: 'Supporting agriculture',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: TrendingUp,
      title: 'Roads',
      description: 'Better connectivity',
      color: 'from-purple-500 to-indigo-600'
    }
  ]

  const environmental = [
    {
      icon: Recycle,
      title: 'Waste Recycling',
      description: 'Production wastes recycled for beneficial use',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Zap,
      title: 'Power Generation',
      description: 'Converting waste to energy',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      icon: Trees,
      title: 'Green World Concept',
      description: 'Maintaining green estates',
      color: 'from-green-600 to-teal-600'
    }
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title with wave effect
      if (titleRef.current) {
        const children = Array.from(titleRef.current.children)
        if (children.length > 0) {
          gsap.from(children, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 90%',
              toggleActions: 'play none none reverse'
            }
          })
        }
      }

      // Hero image reveal
      if (heroImageRef.current) {
        gsap.from(heroImageRef.current, {
          scale: 1.1,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: heroImageRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        })

        gsap.to(heroImageRef.current, {
          y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: heroImageRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5
          }
        })
      }

      // Top cards slide in
      if (topCardsRef.current) {
        const topCards = Array.from(topCardsRef.current.children)
        
        if (topCards[0]) {
          gsap.from(topCards[0], {
            x: -120,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: topCardsRef.current,
              start: 'top 90%',
              toggleActions: 'play none none reverse'
            }
          })
        }

        if (topCards[1]) {
          gsap.from(topCards[1], {
            x: 120,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: topCardsRef.current,
              start: 'top 90%',
              toggleActions: 'play none none reverse'
            }
          })
        }
      }

      // Facilities grid
      if (facilitiesRef.current) {
        const cards = Array.from(facilitiesRef.current.children)
        if (cards.length > 0) {
          gsap.from(cards, {
            y: 60,
            opacity: 0,
            scale: 0.9,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: facilitiesRef.current,
              start: 'top 90%',
              toggleActions: 'play none none reverse'
            }
          })
        }
      }

      // Banner scale in
      if (bannerRef.current) {
        gsap.from(bannerRef.current, {
          scale: 0.9,
          opacity: 0,
          y: 40,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: bannerRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        })
      }

      // Initiatives image
      if (initiativesImageRef.current) {
        gsap.from(initiativesImageRef.current, {
          scale: 1.1,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: initiativesImageRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        })

        gsap.to(initiativesImageRef.current, {
          y: -30,
          ease: 'none',
          scrollTrigger: {
            trigger: initiativesImageRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5
          }
        })
      }

      // Initiatives grid
      if (initiativesRef.current) {
        const cards = Array.from(initiativesRef.current.children)
        if (cards.length > 0) {
          gsap.from(cards, {
            y: 60,
            opacity: 0,
            scale: 0.9,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: initiativesRef.current,
              start: 'top 90%',
              toggleActions: 'play none none reverse'
            }
          })
        }
      }

      // Environmental image reveal
      if (envImageRef.current) {
        gsap.from(envImageRef.current, {
          scale: 0.95,
          opacity: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: envImageRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none'
          }
        })
      }


      // Background silhouette
      const bgSvg = document.querySelector('.csr-bg-svg')
      if (bgSvg && sectionRef.current) {
        gsap.fromTo(bgSvg,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 2,
            ease: 'power1.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 90%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleCircleHover = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      scale: 1.08,
      rotation: 5,
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  const handleCircleHoverOut = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      rotation: 0,
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  return (
    <section ref={sectionRef} className="relative py-20 md:py-32 bg-gradient-to-b from-green-50/30 via-blue-50/20 to-green-50/30 overflow-hidden">
      {/* CSR Silhouette Full Background */}
      <div className="csr-bg-svg absolute inset-0 pointer-events-none opacity-0">
        <CSRSilhouette className="w-full h-full text-green-900" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-green-900">
            Corporate Social Responsibility
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            At Lanka Sugar Company Limited - Sevanagala, our entire operation is fundamentally directed toward 
            corporate social responsibility. From our inception, we have been committed to providing comprehensive 
            facilities and support for all our stakeholders—farmers, employees, and the broader community.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-green-600 to-transparent mx-auto mt-6"></div>
        </div>

        {/* Hero Image */}
        <div ref={heroImageRef} className="relative h-[300px] md:h-[450px] rounded-2xl overflow-hidden shadow-2xl mb-16">
          <Image
            src="/images/community-empowerment.jpg"
            alt="Community engagement and CSR activities"
            fill
            className="object-cover"
            style={{ objectPosition: 'center 20%' }}
            sizes="(max-width: 768px) 100vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-green-900/70 via-green-900/30 to-transparent"></div>
          <div className="absolute bottom-8 left-8 text-white">
            <h3 className="text-3xl md:text-4xl font-bold mb-2">Community Empowerment</h3>
            <p className="text-lg md:text-xl">Comprehensive Support for All Stakeholders</p>
          </div>
        </div>

        {/* CSR Philosophy */}
        <div className="mb-16 bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-10 shadow-lg">
          <h3 className="text-2xl md:text-3xl font-bold text-green-900 mb-6 text-center">
            Our CSR Philosophy
          </h3>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            We believe in <strong>generating income and adding value</strong> not just for our business, but for 
            sugarcane farmers, the community, and the environment in which we operate. Our approach ensures 
            <strong> sustainable development with minimum social and environmental consequences</strong>.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed text-center">
            Every facility we build and every service we provide is part of our commitment to the prosperity 
            of the agrarian economy of Sri Lanka.
          </p>
        </div>

        {/* Top Cards - CIRCULAR DESIGN */}
        <div ref={topCardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 max-w-5xl mx-auto">
          <div className="flex justify-center">
            <div 
              className="relative w-72 h-72 md:w-80 md:h-80 rounded-full border-4 border-green-100 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-green-50/30 flex items-center justify-center cursor-pointer"
              onMouseEnter={handleCircleHover}
              onMouseLeave={handleCircleHoverOut}
            >
              <div className="text-center px-8 py-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-5 shadow-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-green-900 mb-3">Direct Impact</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  <strong>15,000+ farmer families</strong> supported directly and an additional 
                  <strong> 10,000 families</strong> indirectly throughout the region.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div 
              className="relative w-72 h-72 md:w-80 md:h-80 rounded-full border-4 border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50/30 flex items-center justify-center cursor-pointer"
              onMouseEnter={handleCircleHover}
              onMouseLeave={handleCircleHoverOut}
            >
              <div className="text-center px-8 py-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-5 shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-green-900 mb-3">No Barriers</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Building infrastructure with <strong>no limitations or differentiation</strong> based 
                  on nationality, religion, or ethnicity.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Community Facilities Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">
              Community Infrastructure & Essential Services
            </h3>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Comprehensive facilities to support farmer families and employees of the industry
            </p>
          </div>

          {/* Facilities Grid - SMALL CIRCULAR CARDS */}
          <div ref={facilitiesRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto mb-12">
            {facilities.map((facility) => (
              <div 
                key={facility.title}
                className="flex justify-center"
              >
                <div 
                  className="relative w-32 h-32 md:w-36 md:h-36 rounded-full border-2 border-green-100 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm flex items-center justify-center cursor-pointer"
                  onMouseEnter={handleCircleHover}
                  onMouseLeave={handleCircleHoverOut}
                >
                  <div className="text-center px-3 py-2">
                    <div className={`w-10 h-10 mx-auto rounded-full bg-gradient-to-br ${facility.color} flex items-center justify-center mb-2 shadow-lg`}>
                      <facility.icon className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-xs md:text-sm font-bold text-green-900 mb-1">
                      {facility.title}
                    </h4>
                    <p className="text-gray-600 text-xs leading-tight">
                      {facility.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Facilities Details */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 shadow-lg">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-2 text-xl">•</span>
                <span><strong>Shopping Complexes:</strong> Commercial facilities for daily needs</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 text-xl">•</span>
                <span><strong>Educational Facilities:</strong> Schools with focus on uplifting rural youth</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 text-xl">•</span>
                <span><strong>Healthcare Services:</strong> Hospitals for community wellbeing</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 text-xl">•</span>
                <span><strong>Housing & Hostels:</strong> Accommodation for employees and families</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 text-xl">•</span>
                <span><strong>Transportation Services:</strong> Reliable transport for the community</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 text-xl">•</span>
                <span><strong>Utilities:</strong> Electricity and water supply facilities</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 text-xl">•</span>
                <span><strong>Recreation Facilities:</strong> Spaces for leisure and social activities</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Education as Empowerment */}
        <div className="mb-16 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border-2 border-blue-100">
          {/* Education Image */}
          <div className="relative h-[300px] md:h-[400px] w-full">
            <Image
              src="/images/education-empowerment.jpg"
              alt="Education as Empowerment - Supporting rural youth"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/40 to-transparent"></div>
            <div className="absolute bottom-8 left-8 text-white">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold">
                  Education as Empowerment
                </h3>
              </div>
            </div>
          </div>
          
          {/* Education Content */}
          <div className="p-8 md:p-10">
            <p className="text-lg text-gray-700 leading-relaxed">
              We identified very early that people need access to key ways of building a life for themselves and 
              their families. There is a <strong>definite focus on education as a means of uplifting rural youth</strong> and 
              providing them with opportunities to seek lucrative futures. This responds directly to the characteristics 
              and nature of our rural location.
            </p>
          </div>
        </div>

        {/* Banner - PILL SHAPE */}
        <div ref={bannerRef} className="mb-16">
          <div className="rounded-full border-0 shadow-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white">
            <div className="p-10 md:p-12 text-center">
              <h3 className="text-3xl md:text-4xl font-bold mb-3">
                Economic Empowerment Through Fair Compensation
              </h3>
              <p className="text-lg md:text-xl opacity-90">
                Paying millions of rupees directly to sugarcane farmers, transforming the economic landscape and 
                enabling families to invest in education, healthcare, and better living conditions
              </p>
            </div>
          </div>
        </div>

        {/* Infrastructure Development Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">
              Infrastructure Development Without Barriers
            </h3>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              We build infrastructure where it's needed, creating lasting positive change for entire communities
            </p>
          </div>

          {/* Initiatives Image */}
          <div ref={initiativesImageRef} className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-2xl mb-12">
            <Image
              src="/images/lasting-impact.jpg"
              alt="CSR initiatives and community projects"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 via-blue-900/30 to-transparent"></div>
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">Creating Lasting Impact</h3>
              <p className="text-base md:text-lg">Infrastructure, Education, and Healthcare</p>
            </div>
          </div>

          {/* Infrastructure Cards - CIRCULAR */}
          <div ref={initiativesRef} className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {initiatives.map((initiative) => (
              <div 
                key={initiative.title}
                className="flex justify-center"
              >
                <div 
                  className="relative w-40 h-40 md:w-44 md:h-44 rounded-full border-2 border-green-100 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm flex items-center justify-center cursor-pointer"
                  onMouseEnter={handleCircleHover}
                  onMouseLeave={handleCircleHoverOut}
                >
                  <div className="text-center px-4 py-3">
                    <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-br ${initiative.color} flex items-center justify-center mb-3 shadow-lg`}>
                      <initiative.icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-sm md:text-base font-bold text-green-900 mb-1">
                      {initiative.title}
                    </h4>
                    <p className="text-gray-600 text-xs leading-tight">
                      {initiative.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Environmental Stewardship */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">
              Environmental Stewardship
            </h3>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Making the "green world concept" a reality through responsible land management and waste utilization
            </p>
          </div>

          {/* Environmental Content - Image and Cards Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 items-start">
            {/* Environmental Image - Left Side */}
            <div ref={envImageRef} className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl bg-white p-4">
              <div className="relative w-full h-full">
                <Image
                  src="/images/environmental-stewardship.png"
                  alt="Environmental Stewardship"
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* Environmental Cards - Right Side */}
            <div ref={environmentRef} className="flex flex-col gap-6 justify-center">
              {environmental.map((env) => (
                <div
                  key={env.title}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-green-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${env.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                      <env.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-green-900 mb-1">{env.title}</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">{env.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-8 shadow-lg">
            <p className="text-lg text-gray-700 leading-relaxed text-center">
              Lanka Sugar Company Limited - Sevanagala <strong>maintains its lands and surrounding areas by allocating 
              adequate budget every year</strong> to ensure environmental compliance, following strict regulations for 
              discarding production wastes, and keeping our estates green and environmentally responsible.
            </p>
          </div>
        </div>

        {/* Comprehensive Support - WHITE CARD STYLE */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-10 shadow-lg">
          <h3 className="text-2xl md:text-3xl font-bold text-green-900 mb-6 text-center">
            Comprehensive Stakeholder Support
          </h3>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Our comprehensive assistance includes <strong>land allocation, land preparation, weedicides, fertilizers, 
            and ongoing agricultural support</strong>—ensuring sustainable development for all our farming partners.
          </p>
          <p className="text-base text-gray-600 leading-relaxed text-center">
            We recognize that our success is built on the hard work and dedication of our farmers and employees. 
            Creating shared value for all stakeholders is not just good ethics—it's essential for sustainable 
            business and community prosperity.
          </p>
        </div>
      </div>
    </section>
  )
}









