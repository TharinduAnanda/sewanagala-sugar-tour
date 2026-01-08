'use client'

import Link from 'next/link'
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'
import { motion } from 'framer-motion'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="border-t bg-gradient-to-br from-green-900 to-emerald-900 text-white cursor-white">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="font-bold text-xl mb-4 text-yellow-300">Sevanagala Sugar Factory</h3>
            <p className="text-sm text-gray-200 leading-relaxed mb-4">
              Producing the finest natural brown sugar since 1986. A cornerstone of Sri Lanka's sugar industry and agrarian economy.
            </p>
            <p className="text-xs text-gray-300 italic">
              Sweetening Sri Lanka's Future
            </p>
          </motion.div>
          
          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="font-semibold text-lg mb-4 text-yellow-300">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-200 hover:text-yellow-300 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-200 hover:text-yellow-300 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/tour" className="text-sm text-gray-200 hover:text-yellow-300 transition-colors">
                  Virtual Tour
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-sm text-gray-200 hover:text-yellow-300 transition-colors">
                  Book Tour
                </Link>
              </li>
              <li>
                <Link href="/my-bookings" className="text-sm text-gray-200 hover:text-yellow-300 transition-colors">
                  My Bookings
                </Link>
              </li>
            </ul>
          </motion.div>
          
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="font-semibold text-lg mb-4 text-yellow-300">Contact Us</h4>
            <ul className="space-y-3 text-sm text-gray-200">
              <li className="flex items-start">
                <FaMapMarkerAlt className="w-4 h-4 mr-2 mt-1 text-yellow-300 flex-shrink-0" />
                <span>Sevanagala, Moneragala District<br />Uva Province, Sri Lanka<br />155 km east of Colombo</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="w-4 h-4 mr-2 text-yellow-300" />
                <span>+94 55 227 5271</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="w-4 h-4 mr-2 text-yellow-300" />
                <span>info@lankasugar.lk</span>
              </li>
            </ul>
          </motion.div>
          
          {/* Social & Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="font-semibold text-lg mb-4 text-yellow-300">Connect With Us</h4>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="text-gray-200 hover:text-yellow-300 transition-colors transform hover:scale-110">
                <FaFacebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-200 hover:text-yellow-300 transition-colors transform hover:scale-110">
                <FaTwitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-200 hover:text-yellow-300 transition-colors transform hover:scale-110">
                <FaInstagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-200 hover:text-yellow-300 transition-colors transform hover:scale-110">
                <FaYoutube className="h-6 w-6" />
              </a>
            </div>
            <div className="text-sm text-gray-200">
              <p className="font-semibold mb-2">Tour Hours</p>
              <p>Monday - Friday: 9:00 AM - 4:00 PM</p>
              <p>Saturday: 9:00 AM - 12:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </motion.div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-green-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-300">
            <p className="mb-4 md:mb-0">
              &copy; {currentYear} Lanka Sugar Company (Pvt) Ltd - Sevanagala. All rights reserved.
            </p>
            <p className="text-xs">
              Managed by Ministry of Industry and Entrepreneurship Development
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
