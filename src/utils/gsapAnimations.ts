import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export const fadeInUp = (element: string | Element, delay: number = 0) => {
  return gsap.from(element, {
    y: 60,
    opacity: 0,
    duration: 0.8,
    delay,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: element,
      start: 'top 85%',
      toggleActions: 'play none none none'
    }
  })
}

export const fadeIn = (element: string | Element, delay: number = 0) => {
  return gsap.from(element, {
    opacity: 0,
    duration: 0.8,
    delay,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: element,
      start: 'top 85%',
      toggleActions: 'play none none none'
    }
  })
}

export const slideInLeft = (element: string | Element, delay: number = 0) => {
  return gsap.from(element, {
    x: -100,
    opacity: 0,
    duration: 0.8,
    delay,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: element,
      start: 'top 85%',
      toggleActions: 'play none none none'
    }
  })
}

export const slideInRight = (element: string | Element, delay: number = 0) => {
  return gsap.from(element, {
    x: 100,
    opacity: 0,
    duration: 0.8,
    delay,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: element,
      start: 'top 85%',
      toggleActions: 'play none none none'
    }
  })
}

export const scaleIn = (element: string | Element, delay: number = 0) => {
  return gsap.from(element, {
    scale: 0.8,
    opacity: 0,
    duration: 0.6,
    delay,
    ease: 'back.out(1.7)',
    scrollTrigger: {
      trigger: element,
      start: 'top 85%',
      toggleActions: 'play none none none'
    }
  })
}

export const staggerFadeIn = (elements: string | Element[], delay: number = 0) => {
  return gsap.from(elements, {
    y: 40,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    delay,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: elements,
      start: 'top 85%',
      toggleActions: 'play none none none'
    }
  })
}

export const rotateIn = (element: string | Element, delay: number = 0) => {
  return gsap.from(element, {
    rotation: 180,
    opacity: 0,
    duration: 0.8,
    delay,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: element,
      start: 'top 85%',
      toggleActions: 'play none none none'
    }
  })
}

export const hoverScale = (element: Element) => {
  const tl = gsap.timeline({ paused: true })
  tl.to(element, {
    scale: 1.05,
    y: -5,
    duration: 0.3,
    ease: 'power2.out'
  })
  return tl
}

export const hoverRotate = (element: Element) => {
  const tl = gsap.timeline({ paused: true })
  tl.to(element, {
    rotation: 360,
    scale: 1.1,
    duration: 0.5,
    ease: 'power2.out'
  })
  return tl
}

export const createParallax = (element: string | Element, speed: number = 0.5) => {
  return gsap.to(element, {
    y: (i, target) => -ScrollTrigger.maxScroll(window) * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      invalidateOnRefresh: true
    }
  })
}

export const drawSVGAnimation = (element: string | Element, delay: number = 0) => {
  return gsap.from(element, {
    drawSVG: '0%',
    duration: 2,
    delay,
    ease: 'power2.inOut',
    scrollTrigger: {
      trigger: element,
      start: 'top 85%',
      toggleActions: 'play none none none'
    }
  })
}

export default {
  fadeInUp,
  fadeIn,
  slideInLeft,
  slideInRight,
  scaleIn,
  staggerFadeIn,
  rotateIn,
  hoverScale,
  hoverRotate,
  createParallax,
  drawSVGAnimation
}
