'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BookingCalendar from '@/components/BookingCalendar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FaUser, FaPhone, FaEnvelope, FaUsers, FaCheckCircle, FaClock, FaMapMarkerAlt, FaInfoCircle, FaExclamationTriangle, FaClipboardList, FaDownload, FaCalendarCheck, FaCalendarAlt, FaStar, FaGift } from 'react-icons/fa'
import { GiFactory, GiSugarCane } from 'react-icons/gi'
import { MdEmail, MdPhone, MdLocationOn, MdAccessTime, MdPeople, MdCheck } from 'react-icons/md'
import { TimeSlot } from '@/types/booking'

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'

export default function BookingPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time_slot: '',
    adults: 1,
    children: 0,
    special_requirements: '',
    agree_terms: false
  })
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [bookingRef, setBookingRef] = useState('')
  const [error, setError] = useState('')

  const handleDateSelect = (date: string) => {
    setFormData({ ...formData, date, time_slot: '' })
    setSelectedSlot(null)
    setError('')
  }

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot)
    setFormData({ ...formData, time_slot: slot.time_slot })
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.date || !formData.time_slot) {
      setError('Please fill in all required fields')
      return
    }

    if (!formData.agree_terms) {
      setError('Please agree to the terms and conditions')
      return
    }

    setLoading(true)

    try {
      const response = await axios.post('/api/bookings', {
        ...formData,
        total_visitors: formData.adults + formData.children
      })

      setBookingRef(response.data.booking_reference)
      setSuccess(true)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create booking. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const downloadPDF = async () => {
    try {
      const response = await axios.get(`/api/bookings/${bookingRef}/download-pdf`, {
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `booking-${bookingRef}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      console.error('Failed to download PDF:', err)
    }
  }

  if (success) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto"
            >
              <Card className="border-2 border-green-500">
                <CardHeader className="text-center bg-green-500 text-white">
                  <div className="flex justify-center mb-4">
                    <FaCheckCircle className="w-20 h-20" />
                  </div>
                  <CardTitle className="text-3xl">Booking Confirmed!</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="text-center">
                      <p className="text-gray-600 mb-2">Your booking reference:</p>
                      <p className="text-4xl font-bold text-green-600">{bookingRef}</p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <FaInfoCircle className="text-blue-500 text-xl mt-1 flex-shrink-0" />
                        <div className="text-sm text-blue-800">
                          <p className="font-semibold mb-2">Important Information:</p>
                          <ul className="list-disc list-inside space-y-1">
                            <li>A confirmation email has been sent to {formData.email}</li>
                            <li>Please arrive 15 minutes before your tour time</li>
                            <li>Bring a valid ID for verification</li>
                            <li>Save your booking reference for future reference</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <FaClipboardList className="text-green-600" />
                        Booking Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <FaUser className="text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Name</p>
                            <p className="font-medium">{formData.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <FaCalendarAlt className="text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Date</p>
                            <p className="font-medium">{formData.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <FaClock className="text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Time</p>
                            <p className="font-medium">{formData.time_slot}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <FaUsers className="text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Visitors</p>
                            <p className="font-medium">
                              {formData.adults} {formData.adults === 1 ? 'Adult' : 'Adults'}
                              {formData.children > 0 && `, ${formData.children} ${formData.children === 1 ? 'Child' : 'Children'}`}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        onClick={downloadPDF}
                        className="flex-1 flex items-center justify-center gap-2"
                        variant="outline"
                      >
                        <FaDownload />
                        Download Confirmation PDF
                      </Button>
                      <Button
                        onClick={() => window.location.href = '/'}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        Back to Home
                      </Button>
                    </div>

                    <div className="text-center pt-4 border-t">
                      <p className="text-sm text-gray-600">
                        Need to make changes?{' '}
                        <a href="/my-bookings" className="text-green-600 hover:underline font-medium">
                          Manage your bookings
                        </a>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-12 md:py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <GiSugarCane className="w-16 h-16 mx-auto mb-4" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Book Your Factory Tour</h1>
              <p className="text-lg md:text-xl text-green-100">
                Experience the fascinating journey from sugarcane to sugar
              </p>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Booking Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <FaCalendarCheck className="text-green-600" />
                      Select Your Tour Date & Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
                        <FaExclamationTriangle className="flex-shrink-0 mt-1" />
                        <span>{error}</span>
                      </div>
                    )}

                    <BookingCalendar
                      onDateSelect={handleDateSelect}
                      onSlotSelect={handleSlotSelect}
                      selectedDate={formData.date}
                      selectedSlot={selectedSlot}
                    />

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <FaUser className="text-green-600" />
                          Your Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Full Name *
                            </label>
                            <Input
                              type="text"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              placeholder="Enter your full name"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Email Address *
                            </label>
                            <Input
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              placeholder="your.email@example.com"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Phone Number *
                            </label>
                            <Input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              placeholder="+94 XX XXX XXXX"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <FaUsers className="text-green-600" />
                          Number of Visitors
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Adults (18+)
                            </label>
                            <Input
                              type="number"
                              min="1"
                              max="50"
                              value={formData.adults}
                              onChange={(e) => setFormData({ ...formData, adults: parseInt(e.target.value) || 1 })}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Children (under 18)
                            </label>
                            <Input
                              type="number"
                              min="0"
                              max="50"
                              value={formData.children}
                              onChange={(e) => setFormData({ ...formData, children: parseInt(e.target.value) || 0 })}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Special Requirements (Optional)
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          rows={3}
                          value={formData.special_requirements}
                          onChange={(e) => setFormData({ ...formData, special_requirements: e.target.value })}
                          placeholder="Any special requirements or dietary restrictions..."
                        />
                      </div>

                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                        <input
                          type="checkbox"
                          id="terms"
                          checked={formData.agree_terms}
                          onChange={(e) => setFormData({ ...formData, agree_terms: e.target.checked })}
                          className="mt-1"
                          required
                        />
                        <label htmlFor="terms" className="text-sm text-gray-700">
                          I agree to the terms and conditions and understand that I must arrive 15 minutes before the scheduled tour time
                        </label>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
                        disabled={loading || !formData.date || !formData.time_slot}
                      >
                        {loading ? 'Processing...' : 'Confirm Booking'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column - Info Cards */}
            <div className="space-y-6">
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <FaStar className="text-yellow-500" />
                      Tour Highlights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {[
                        '14 interactive stations',
                        'Expert guide included',
                        '2-3 hour duration',
                        'Free refreshments',
                        'Photo opportunities'
                      ].map((item, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <MdCheck className="text-green-600 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <FaInfoCircle className="text-blue-500" />
                      Important Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <MdAccessTime className="text-blue-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium">Arrive Early</p>
                        <p className="text-gray-600">Please arrive 15 minutes before your tour time</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MdLocationOn className="text-blue-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-gray-600">Sewanagala Sugar Factory, Monaragala</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MdPhone className="text-blue-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium">Contact</p>
                        <p className="text-gray-600">+94 XX XXX XXXX</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <FaGift className="text-purple-500" />
                      What's Included
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {[
                        'Guided factory tour',
                        'Safety equipment',
                        'Welcome refreshments',
                        'Souvenir sugar pack',
                        'Digital tour certificate'
                      ].map((item, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <MdCheck className="text-purple-600 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
