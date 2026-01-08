import { useEffect, useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export const useGSAPAnimation = () => {
  const element = useRef<HTMLDivElement>(null)

  return { element, gsap, ScrollTrigger }
}

export const useGSAPContext = (callback: (context: gsap.Context) => void, deps: any[] = []) => {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      callback(ctx)
    }, ref)

    return () => ctx.revert()
  }, deps)

  return ref
}

export default useGSAPAnimation
