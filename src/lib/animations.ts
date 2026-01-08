import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Professional easing configurations inspired by reference sites
export const easings = {
  // Smooth, professional eases
  smooth: 'power2.out',
  smoothIn: 'power2.in',
  smoothInOut: 'power2.inOut',
  
  // Elegant eases for hero sections
  elegant: 'power3.out',
  elegantIn: 'power3.in',
  
  // Subtle eases for backgrounds
  subtle: 'power1.out',
  
  // Bounce for playful elements (use sparingly)
  bounce: 'back.out(1.2)',
  
  // Elastic for attention-grabbing (use very sparingly)
  elastic: 'elastic.out(1, 0.6)',
}

// Animation timing configurations
export const timings = {
  // Fast transitions for micro-interactions
  fast: 0.3,
  
  // Standard transitions for most UI elements
  standard: 0.6,
  
  // Slow transitions for hero sections and important reveals
  slow: 1.2,
  
  // Very slow for dramatic effects
  dramatic: 2,
}

// Stagger configurations for sequential animations
export const staggers = {
  tight: 0.05,
  normal: 0.1,
  relaxed: 0.15,
  loose: 0.2,
}

// ScrollTrigger configurations
export const scrollTriggerDefaults = {
  start: 'top 80%',
  end: 'bottom 20%',
  toggleActions: 'play none none none',
  // markers: true, // Enable for debugging
}

// Common animation presets
export const animations = {
  // Fade in from bottom (most common, professional)
  fadeInUp: {
    from: {
      y: 60,
      opacity: 0,
    },
    to: {
      y: 0,
      opacity: 1,
      duration: timings.standard,
      ease: easings.smooth,
    },
  },
  
  // Fade in from bottom (subtle, fast)
  fadeInUpSubtle: {
    from: {
      y: 30,
      opacity: 0,
    },
    to: {
      y: 0,
      opacity: 1,
      duration: timings.fast,
      ease: easings.subtle,
    },
  },
  
  // Fade in from left (for images, cards)
  fadeInLeft: {
    from: {
      x: -60,
      opacity: 0,
    },
    to: {
      x: 0,
      opacity: 1,
      duration: timings.standard,
      ease: easings.smooth,
    },
  },
  
  // Fade in from right (for alternating content)
  fadeInRight: {
    from: {
      x: 60,
      opacity: 0,
    },
    to: {
      x: 0,
      opacity: 1,
      duration: timings.standard,
      ease: easings.smooth,
    },
  },
  
  // Scale up fade in (for important elements)
  scaleUp: {
    from: {
      scale: 0.9,
      opacity: 0,
    },
    to: {
      scale: 1,
      opacity: 1,
      duration: timings.standard,
      ease: easings.smooth,
    },
  },
  
  // Hero title animation (dramatic)
  heroTitle: {
    from: {
      y: 100,
      opacity: 0,
      scale: 0.95,
    },
    to: {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: timings.slow,
      ease: easings.elegant,
    },
  },
  
  // Background pattern animation (very subtle)
  backgroundPattern: {
    from: {
      opacity: 0,
      scale: 1.1,
    },
    to: {
      opacity: 0.05,
      scale: 1,
      duration: timings.dramatic,
      ease: easings.subtle,
    },
  },
  
  // Image reveal (professional)
  imageReveal: {
    from: {
      scale: 1.1,
      opacity: 0,
    },
    to: {
      scale: 1,
      opacity: 1,
      duration: timings.slow,
      ease: easings.smooth,
    },
  },
}

// Helper function to create scroll-triggered animations
export const createScrollAnimation = (
  element: gsap.TweenTarget,
  animation: typeof animations[keyof typeof animations],
  trigger?: Element,
  options?: gsap.TweenVars
) => {
  return gsap.fromTo(
    element,
    animation.from,
    {
      ...animation.to,
      scrollTrigger: {
        trigger: trigger || element,
        ...scrollTriggerDefaults,
        ...options,
      },
    }
  )
}

// Parallax effect for backgrounds
export const createParallax = (
  element: gsap.TweenTarget,
  speed: number = 0.5,
  trigger?: Element
) => {
  return gsap.to(element, {
    y: () => window.innerHeight * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: trigger || element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  })
}

// Smooth reveal animation for text lines
export const createTextReveal = (
  lines: NodeListOf<Element> | Element[],
  stagger: number = staggers.normal
) => {
  return gsap.fromTo(
    lines,
    {
      y: 50,
      opacity: 0,
    },
    {
      y: 0,
      opacity: 1,
      duration: timings.standard,
      ease: easings.smooth,
      stagger,
    }
  )
}
