'use client'

import Link from 'next/link'
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-4">Sewanagala Sugar Factory</h3>
            <p className="text-sm text-muted-foreground">
              Experience the journey from farm to factory. Discover how sugar is made at Sri Lanka's premier sugar production facility.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-muted-foreground hover:text-primary">Home</Link></li>
              <li><Link href="/tour" className="text-sm text-muted-foreground hover:text-primary">Virtual Tour</Link></li>
              <li><Link href="/booking" className="text-sm text-muted-foreground hover:text-primary">Book Tour</Link></li>
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary">About Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Sewanagala, Monaragala</li>
              <li>Sri Lanka</li>
              <li>Phone: +94 XX XXX XXXX</li>
              <li>Email: info@sewanagalasugar.lk</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary">
                <FaFacebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <FaTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <FaInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <FaYoutube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Sewanagala Sugar Factory. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
