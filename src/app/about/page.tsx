'use client'

export const dynamic = 'force-dynamic'


import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Card, CardContent } from '@/components/ui/card'

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-center mb-8">About Sewanagala Sugar Factory</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Our History</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The Sewanagala Sugar Factory has been a cornerstone of Sri Lanka's sugar industry 
                  for over 60 years. Established in the 1960s, our factory has continuously evolved 
                  to incorporate modern technology while maintaining traditional values of quality and sustainability.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To produce high-quality sugar while promoting sustainable agriculture practices 
                  and supporting local farming communities. We are committed to transparency, 
                  education, and environmental responsibility.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Production Process</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our factory processes sugarcane through 14 distinct stations, each playing a crucial 
                role in transforming raw sugarcane into refined sugar. From harvesting to packaging, 
                every step is carefully monitored to ensure the highest quality standards.
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Modern crushing and extraction technology</li>
                <li>Advanced purification and crystallization processes</li>
                <li>Sustainable by-product utilization (bagasse for energy, molasses for feed)</li>
                <li>Quality control at every stage</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Visit Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                Experience our factory tour to see firsthand how sugar is made. Our guided tours 
                provide an educational and engaging experience for visitors of all ages. Book your 
                tour today to learn about sustainable sugar production and the rich heritage of 
                Sewanagala Sugar Factory.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  )
}
