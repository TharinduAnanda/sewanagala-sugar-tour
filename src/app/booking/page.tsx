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

interface TimeSlot {
  id: string
  date: string
  time_slot: string
  available_spots: number
  max_capacity: number
}

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

    if (!formData.agree_terms) {
      setError('Please agree to the terms and conditions')
      return
    }

    const totalVisitors = formData.adults + formData.children
    if (totalVisitors > 30) {
      setError('Maximum 30 visitors per booking. For larger groups, please contact us directly.')
      return
    }

    setLoading(true)

    try {
      const response = await axios.post('/api/bookings', {
        ...formData,
        visitor_count: totalVisitors
      })
      setBookingRef(response.data.data.booking_reference)
      setSuccess(true)
    } catch (error: any) {
      setError(error.response?.data?.message || 'Booking failed. Please try again.')
      console.error('Booking error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Success/Confirmation Page
  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 sm:py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <Card className="shadow-lg">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="text-center mb-6"
                >
                  <FaCheckCircle className="text-green-600 text-7xl mx-auto mb-4" />
                  <h2 className="text-lg sm:text-xl md:text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Booking Confirmed!</h2>
                  <p className="text-muted-foreground">Your free factory tour has been successfully reserved</p>
                </motion.div>
                
                <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-6 mb-6">
                  <p className="text-sm text-muted-foreground mb-2 text-center">Your Booking Reference Number:</p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-mono font-bold text-primary text-center tracking-wider">
                    {bookingRef}
                  </p>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Please save this reference number for your records
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center">
                        <FaUser className="mr-2" />
                        Booking Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name:</span>
                        <span className="font-semibold">{formData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phone:</span>
                        <span className="font-semibold">{formData.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="font-semibold text-xs">{formData.email}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center">
                        <FaCalendarCheck className="mr-2" />
                        Tour Schedule
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-semibold">{formData.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time:</span>
                        <span className="font-semibold">{formData.time_slot}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Visitors:</span>
                        <span className="font-semibold">
                          {formData.adults + formData.children} person(s)
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="mb-6">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3 flex items-center">
                      <FaInfoCircle className="mr-2" />
                      Confirmation Sent
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2 flex items-center">
                      <MdEmail className="mr-2 flex-shrink-0" />
                      Email confirmation sent to <strong className="ml-1">{formData.email}</strong>
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <MdPhone className="mr-2 flex-shrink-0" />
                      SMS confirmation sent to <strong className="ml-1">{formData.phone}</strong>
                    </p>
                  </CardContent>
                </Card>

                <Card className="mb-6 border-primary/20">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3 flex items-center">
                      <FaExclamationTriangle className="mr-2" />
                      Important Reminders
                    </h3>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li className="flex items-start">
                        <FaClock className="mr-2 mt-0.5 flex-shrink-0" />
                        <span>Please arrive <strong>15 minutes before</strong> your scheduled time</span>
                      </li>
                      <li className="flex items-start">
                        <FaClipboardList className="mr-2 mt-0.5 flex-shrink-0" />
                        <span>Bring your <strong>booking reference number</strong></span>
                      </li>
                      <li className="flex items-start">
                        <FaCheckCircle className="mr-2 mt-0.5 flex-shrink-0" />
                        <span>Wear <strong>comfortable closed-toe shoes</strong></span>
                      </li>
                      <li className="flex items-start">
                        <FaInfoCircle className="mr-2 mt-0.5 flex-shrink-0" />
                        <span>Tours may be cancelled due to factory maintenance or holidays</span>
                      </li>
                      <li className="flex items-start">
                        <FaGift className="mr-2 mt-0.5 flex-shrink-0" />
                        <span>This is a <strong>FREE tour</strong> - no payment required</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button 
                    onClick={() => window.print()} 
                    variant="outline"
                    className="w-full"
                  >
                    <FaDownload className="mr-2" />
                    Print Confirmation
                  </Button>
                  <Button 
                    onClick={() => window.location.href = '/my-bookings'} 
                    variant="outline"
                    className="w-full"
                  >
                    <FaClipboardList className="mr-2" />
                    View My Bookings
                  </Button>
                </div>

                <div className="mt-4">
                  <Button 
                    onClick={() => window.location.reload()} 
                    className="w-full"
                  >
                    Make Another Booking
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
        <Footer />
      </div>
    )
  }

  // Main Booking Form Page
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header Section */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="flex justify-center mb-4"
            >
              <GiSugarCane className="text-4xl sm:text-5xl md:text-6xl text-primary" />
            </motion.div>
            <h1 className="text-4xl sm:text-4xl md:text-5xl font-bold mb-3">Book Your FREE Factory Tour</h1>
            <p className="text-xl text-muted-foreground mb-2">
              Experience the fascinating journey from sugarcane to sugar
            </p>
            <div className="inline-block bg-primary/10 border border-primary/20 rounded-full px-6 py-2 mt-2">
              <p className="font-semibold text-lg flex items-center justify-center gap-2">
                <FaStar className="text-primary" />
                Completely FREE - No Payment Required
                <FaStar className="text-primary" />
              </p>
            </div>
          </div>

          {/* Tour Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <FaClock className="text-lg sm:text-xl md:text-2xl sm:text-3xl md:text-4xl text-primary mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Duration</h3>
                <p className="text-muted-foreground">Approximately 2 hours</p>
                <p className="text-sm text-muted-foreground mt-1">Guided factory tour</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <GiFactory className="text-lg sm:text-xl md:text-2xl sm:text-3xl md:text-4xl text-primary mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Tour Includes</h3>
                <p className="text-muted-foreground">13 Interactive Stations</p>
                <p className="text-sm text-muted-foreground mt-1">Full production process</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <FaMapMarkerAlt className="text-lg sm:text-xl md:text-2xl sm:text-3xl md:text-4xl text-primary mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Location</h3>
                <p className="text-muted-foreground">Sewanagala Sugar Factory</p>
                <p className="text-sm text-muted-foreground mt-1">Monaragala, Sri Lanka</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calendar Section */}
            <div>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <FaCalendarCheck className="mr-2" />
                    Select Date & Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BookingCalendar
                    onDateSelect={handleDateSelect}
                    onSlotSelect={handleSlotSelect}
                    selectedDate={formData.date}
                    selectedSlot={selectedSlot}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Booking Form Section */}
            <div className="space-y-4 sm:space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <FaUser className="mr-2" />
                    Your Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg flex items-start"
                      >
                        <FaExclamationTriangle className="mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{error}</span>
                      </motion.div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          <FaUser className="inline mr-2 text-primary" />
                          Full Name *
                        </label>
                        <Input
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          <FaPhone className="inline mr-2 text-primary" />
                          Phone Number *
                        </label>
                        <Input
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="0771234567"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <FaEnvelope className="inline mr-2 text-primary" />
                        Email Address *
                      </label>
                      <Input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          <FaUsers className="inline mr-2 text-primary" />
                          Adults *
                        </label>
                        <Input
                          required
                          type="number"
                          min="1"
                          max="30"
                          value={formData.adults}
                          onChange={(e) => setFormData({ ...formData, adults: parseInt(e.target.value) || 1 })}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          <FaUsers className="inline mr-2 text-primary" />
                          Children
                        </label>
                        <Input
                          type="number"
                          min="0"
                          max="30"
                          value={formData.children}
                          onChange={(e) => setFormData({ ...formData, children: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <FaInfoCircle className="inline mr-2 text-primary" />
                        Special Requirements (Optional)
                      </label>
                      <textarea
                        value={formData.special_requirements}
                        onChange={(e) => setFormData({ ...formData, special_requirements: e.target.value })}
                        placeholder="Any accessibility needs, dietary restrictions, or special requests..."
                        rows={3}
                        className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>

                    {selectedSlot && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <Card className="border-primary/20">
                          <CardContent className="p-4">
                            <h4 className="font-semibold mb-3 flex items-center">
                              <FaCheckCircle className="mr-2 text-green-600" />
                              Selected Time Slot
                            </h4>
                            <div className="space-y-2 text-sm text-muted-foreground">
                              <p className="flex items-center">
                                <FaCalendarAlt className="mr-2 flex-shrink-0" />
                                <strong className="mr-1">Date:</strong> {formData.date}
                              </p>
                              <p className="flex items-center">
                                <MdAccessTime className="mr-2 flex-shrink-0" />
                                <strong className="mr-1">Time:</strong> {formData.time_slot}
                              </p>
                              <p className="flex items-center">
                                <MdPeople className="mr-2 flex-shrink-0" />
                                <strong className="mr-1">Total Visitors:</strong> {formData.adults + formData.children} person(s)
                              </p>
                              <p className="flex items-center">
                                <MdCheck className="mr-2 flex-shrink-0" />
                                <strong className="mr-1">Available Spots:</strong> {selectedSlot.available_spots}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}

                    <Card className="border-primary/20">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-lg">Tour Fee:</p>
                            <p className="text-sm text-muted-foreground">No payment required</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl sm:text-2xl md:text-3xl font-bold flex items-center">
                              <FaGift className="mr-2" />
                              FREE
                            </p>
                            <p className="text-xs text-muted-foreground">Complimentary Tour</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <label className="flex items-start cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.agree_terms}
                            onChange={(e) => setFormData({ ...formData, agree_terms: e.target.checked })}
                            className="mt-1 mr-3 h-4 w-4 rounded border-input"
                          />
                          <span className="text-sm text-muted-foreground">
                            I agree to the terms and conditions and understand that:
                            <ul className="list-disc ml-5 mt-2 space-y-1 text-xs">
                              <li>This is a free factory tour with no charges</li>
                              <li>I will arrive 15 minutes before the scheduled time</li>
                              <li>I will follow all safety guidelines during the tour</li>
                              <li>Tours may be cancelled due to factory operations or holidays</li>
                              <li>Photography may be restricted in certain areas</li>
                            </ul>
                          </span>
                        </label>
                      </CardContent>
                    </Card>

                    <Button 
                      type="submit" 
                      className="w-full text-lg py-6" 
                      disabled={loading || !formData.date || !formData.time_slot || !formData.agree_terms}
                      size="lg"
                    >
                      {loading ? (
                        <>
                          <FaClock className="mr-2 animate-spin" />
                          Processing Your Booking...
                        </>
                      ) : (
                        <>
                          <FaCheckCircle className="mr-2" />
                          Confirm FREE Booking
                        </>
                      )}
                    </Button>

                    {!formData.date && (
                      <p className="text-sm text-center text-muted-foreground">
                        Please select a date and time slot from the calendar
                      </p>
                    )}

                    {!formData.agree_terms && formData.date && (
                      <p className="text-sm text-center text-destructive">
                        Please agree to the terms and conditions to proceed
                      </p>
                    )}
                  </form>
                </CardContent>
              </Card>

              {/* What to Expect Card */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <FaInfoCircle className="mr-2" />
                    What to Expect
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                      <FaCheckCircle className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Guided tour through 13 interactive stations</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Learn about sugar production from farm to factory</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>See state-of-the-art processing equipment</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Educational experience for all ages</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Safety equipment provided if needed</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Duration: Approximately 2 hours</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Important Information Section */}
          <Card className="mt-8 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <FaExclamationTriangle className="mr-2" />
                Important Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Before You Arrive:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                      <FaCheckCircle className="text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>Wear comfortable closed-toe shoes (no sandals or flip-flops)</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>Dress appropriately for a factory environment</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>Please ensure all adult visitors bring their NICs for verification.</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>Arrive 15 minutes early for check-in</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>Children under 12 must be accompanied by an adult</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3">During the Tour:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                      <FaCheckCircle className="text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>Follow all safety instructions from guides</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>Stay with your group at all times</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>Photography allowed in designated areas only</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>Food and drinks not permitted in production areas</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>Tours may be adjusted based on factory operations</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  )
}





