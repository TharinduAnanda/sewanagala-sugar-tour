'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FaArrowRight } from 'react-icons/fa'

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/90 to-yellow-900/90 z-10" />
        <motion.div
          className="w-full h-full bg-[url('/images/hero.jpg')] bg-cover bg-center"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        />
      </div>

      <div className="container relative z-20 mx-auto px-4 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            Sewanagala Sugar Factory
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Experience the journey from farm to factory. Discover how sugar is made at Sri Lanka's premier sugar production facility.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link href="/tour">
              <Button size="lg" className="w-full sm:w-auto bg-white text-black hover:bg-gray-100">
                Start Virtual Tour
                <FaArrowRight className="ml-2" />
              </Button>
            </Link>
            <Link href="/booking">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent text-white border-white hover:bg-white/10">
                Book Physical Tour
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">12</h3>
            <p className="text-base sm:text-lg">Interactive Stations</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">40+</h3>
            <p className="text-base sm:text-lg">Years of Heritage</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">100%</h3>
            <p className="text-base sm:text-lg">Local Production</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
