'use client'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FaPhone, FaSearch, FaEdit, FaTrash, FaCalendar, FaClock, FaUsers, FaEnvelope, FaInfoCircle, FaArrowLeft, FaCheckCircle } from 'react-icons/fa'
import { cn } from '@/lib/utils'

interface Booking {
  id: number
  booking_id: string
  name: string
  email: string
  phone: string
  visitor_count: number
  visit_date: string
  visit_time: string
  special_requirements?: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
}

export default function MyBookingsPage() {
  const [currentView, setCurrentView] = useState<'login' | 'bookings' | 'edit'>('login')
  const [phone, setPhone] = useState('')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Edit state
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null)
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    visitor_count: 1,
    visit_date: '',
    visit_time: '',
    special_requirements: ''
  })

  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState<Booking | null>(null)

  const validatePhone = (phoneNum: string) => {
    const cleaned = phoneNum.replace(/\D/g, '')
    return cleaned.length >= 9 && cleaned.length <= 15
  }

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validatePhone(phone)) {
      setError('Please enter a valid phone number (9-15 digits)')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/bookings/phone/${phone}`)
      const data = await response.json()

      if (!data.success) {
        setError(data.message || 'Failed to retrieve bookings')
        setBookings([])
        return
      }

      if (data.count === 0) {
        setError('No bookings found for this phone number')
        setBookings([])
        return
      }

      setBookings(data.bookings)
      setCurrentView('bookings')
      setSuccess(`Found ${data.count} booking(s)`)
    } catch (err: any) {
      setError('Failed to connect to server: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setPhone('')
    setBookings([])
    setCurrentView('login')
    setError('')
    setSuccess('')
    setEditingBooking(null)
    setDeleteConfirm(null)
  }

  const handleEditClick = (booking: Booking) => {
    setEditingBooking(booking)
    setEditForm({
      name: booking.name,
      email: booking.email,
      visitor_count: booking.visitor_count,
      visit_date: booking.visit_date,
      visit_time: booking.visit_time,
      special_requirements: booking.special_requirements || ''
    })
    setCurrentView('edit')
    setError('')
    setSuccess('')
  }

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditForm(prev => ({
      ...prev,
      [name]: name === 'visitor_count' ? parseInt(value) || 1 : value
    }))
  }

  const handleSaveEdit = async () => {
    setError('')
    setSuccess('')

    if (!editForm.name || !editForm.email || !editForm.visitor_count || !editForm.visit_date || !editForm.visit_time) {
      setError('Please fill in all required fields')
      return
    }

    if (editForm.visitor_count < 1 || editForm.visitor_count > 50) {
      setError('Visitor count must be between 1 and 50')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/bookings/${editingBooking?.id}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.message || 'Failed to update booking')
        return
      }

      setSuccess('Booking updated successfully!')
      
      // Update local bookings list
      const updatedBookings = bookings.map(b => 
        b.id === editingBooking?.id 
          ? { ...b, ...editForm }
          : b
      )
      setBookings(updatedBookings)
      
      setCurrentView('bookings')
      setEditingBooking(null)
    } catch (err: any) {
      setError('Failed to update booking: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setCurrentView('bookings')
    setEditingBooking(null)
    setError('')
    setSuccess('')
  }

  const handleDeleteClick = (booking: Booking) => {
    setDeleteConfirm(booking)
    setError('')
    setSuccess('')
  }

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return

    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await fetch(`/api/bookings/${deleteConfirm.id}/cancel`, {
        method: 'PATCH'
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.message || 'Failed to cancel booking')
        return
      }

      setSuccess('Booking cancelled successfully!')
      
      // Update local bookings list
      const updatedBookings = bookings.map(b => 
        b.id === deleteConfirm.id 
          ? { ...b, status: 'cancelled' as const }
          : b
      )
      setBookings(updatedBookings)
      
      setDeleteConfirm(null)
    } catch (err: any) {
      setError('Failed to cancel booking: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelDelete = () => {
    setDeleteConfirm(null)
    setError('')
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-orange-500',
      confirmed: 'bg-green-500',
      completed: 'bg-blue-500',
      cancelled: 'bg-red-500'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-500'
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">
        <AnimatePresence mode="wait">
          {/* Login View */}
          {currentView === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-md mx-auto mt-8 sm:mt-12 md:mt-16"
            >
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl sm:text-3xl text-center text-green-700">
                    Check Your Bookings
                  </CardTitle>
                  <p className="text-center text-muted-foreground mt-2">
                    Enter your phone number to view and manage your tour bookings
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePhoneLogin} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <FaPhone className="inline mr-2" />
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        placeholder="Enter your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={loading}
                        className="text-lg"
                      />
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                      </div>
                    )}

                    {success && (
                      <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                        {success}
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={loading}
                      size="lg"
                    >
                      {loading ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Searching...
                        </>
                      ) : (
                        <>
                          <FaSearch className="mr-2" />
                          Search Bookings
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <FaInfoCircle className="inline mr-2" />
                      <strong>Info:</strong> Enter the phone number used when booking your tour.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Bookings List View */}
          {currentView === 'bookings' && (
            <motion.div
              key="bookings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-5xl mx-auto"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-700">Your Tour Bookings</h1>
                <Button onClick={handleLogout} variant="outline">
                  <FaArrowLeft className="mr-2" />
                  Back
                </Button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                  {success}
                </div>
              )}

              <div className="space-y-4">
                {bookings.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 sm:p-12 text-center">
                      <p className="text-muted-foreground text-lg">No bookings found for this phone number</p>
                    </CardContent>
                  </Card>
                ) : (
                  bookings.map((booking) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0 mb-4">
                            <div>
                              <h3 className="text-xl sm:text-2xl font-bold text-green-700">{booking.name}</h3>
                              <p className="text-sm text-muted-foreground font-mono">
                                Booking ID: {booking.booking_id}
                              </p>
                            </div>
                            <span className={cn(
                              'px-4 py-2 rounded-full text-white text-xs font-semibold uppercase',
                              getStatusBadge(booking.status)
                            )}>
                              {booking.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="flex items-start gap-2">
                              <FaCalendar className="text-green-600 mt-1" />
                              <div>
                                <p className="text-xs text-muted-foreground uppercase">Date</p>
                                <p className="font-semibold">{formatDate(booking.visit_date)}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <FaClock className="text-green-600 mt-1" />
                              <div>
                                <p className="text-xs text-muted-foreground uppercase">Time</p>
                                <p className="font-semibold">{booking.visit_time}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <FaUsers className="text-green-600 mt-1" />
                              <div>
                                <p className="text-xs text-muted-foreground uppercase">Visitors</p>
                                <p className="font-semibold">{booking.visitor_count} person(s)</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <FaEnvelope className="text-green-600 mt-1" />
                              <div>
                                <p className="text-xs text-muted-foreground uppercase">Email</p>
                                <p className="font-semibold text-sm break-all">{booking.email}</p>
                              </div>
                            </div>
                          </div>

                          {booking.special_requirements && (
                            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                              <p className="text-xs text-muted-foreground uppercase mb-1">Special Requirements</p>
                              <p className="text-sm">{booking.special_requirements}</p>
                            </div>
                          )}

                          <div className="flex flex-col sm:flex-row gap-2">
                            {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                              <>
                                <Button
                                  onClick={() => handleEditClick(booking)}
                                  disabled={loading}
                                  variant="outline"
                                  size="sm" className="w-full sm:w-auto"
                                >
                                  <FaEdit className="mr-2" />
                                  Edit
                                </Button>
                                <Button
                                  onClick={() => handleDeleteClick(booking)}
                                  disabled={loading}
                                  variant="destructive"
                                  size="sm" className="w-full sm:w-auto"
                                >
                                  <FaTrash className="mr-2" />
                                  Cancel
                                </Button>
                              </>
                            )}
                            {(booking.status === 'cancelled' || booking.status === 'completed') && (
                              <span className="text-sm text-muted-foreground italic">
                                Cannot modify {booking.status} bookings
                              </span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* Edit View */}
          {currentView === 'edit' && editingBooking && (
            <motion.div
              key="edit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto"
            >
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl text-green-700">
                    Edit Booking: {editingBooking.booking_id}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Full Name *</label>
                        <Input
                          name="name"
                          value={editForm.name}
                          onChange={handleEditFormChange}
                          disabled={loading}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email *</label>
                        <Input
                          type="email"
                          name="email"
                          value={editForm.email}
                          onChange={handleEditFormChange}
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Number of Visitors (1-50) *</label>
                        <Input
                          type="number"
                          name="visitor_count"
                          value={editForm.visitor_count}
                          onChange={handleEditFormChange}
                          min="1"
                          max="50"
                          disabled={loading}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Visit Date *</label>
                        <Input
                          type="date"
                          name="visit_date"
                          value={editForm.visit_date}
                          onChange={handleEditFormChange}
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Visit Time *</label>
                      <select
                        name="visit_time"
                        value={editForm.visit_time}
                        onChange={handleEditFormChange}
                        disabled={loading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Select a time slot</option>
                        <option value="09:00 AM">9:00 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="12:00 PM">12:00 PM</option>
                        <option value="1:00 PM">1:00 PM</option>
                        <option value="2:00 PM">2:00 PM</option>
                        <option value="3:00 PM">3:00 PM</option>
                        <option value="4:00 PM">4:00 PM</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Special Requirements</label>
                      <textarea
                        name="special_requirements"
                        value={editForm.special_requirements}
                        onChange={handleEditFormChange}
                        placeholder="Any special requirements or accessibility needs?"
                        rows={3}
                        disabled={loading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                      </div>
                    )}

                    {success && (
                      <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                        {success}
                      </div>
                    )}

                    <div className="flex gap-3 justify-end pt-4 border-t">
                      <Button
                        onClick={handleCancelEdit}
                        disabled={loading}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveEdit}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="animate-spin mr-2">⏳</span>
                            Saving...
                          </>
                        ) : (
                          <>
                            <FaCheckCircle className="mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={handleCancelDelete}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-md w-full"
              >
                <Card className="shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-xl text-red-600">Cancel Booking?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">Are you sure you want to cancel this booking?</p>
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <p className="font-mono text-sm mb-2">Booking ID: {deleteConfirm.booking_id}</p>
                      <p className="text-sm text-green-600 font-semibold">
                        {formatDate(deleteConfirm.visit_date)} at {deleteConfirm.visit_time}
                      </p>
                    </div>
                    
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                        {error}
                      </div>
                    )}

                    <div className="flex gap-3 justify-end">
                      <Button
                        onClick={handleCancelDelete}
                        disabled={loading}
                        variant="outline"
                      >
                        Keep Booking
                      </Button>
                      <Button
                        onClick={handleConfirmDelete}
                        disabled={loading}
                        variant="destructive"
                      >
                        {loading ? (
                          <>
                            <span className="animate-spin mr-2">⏳</span>
                            Cancelling...
                          </>
                        ) : (
                          <>
                            <FaTrash className="mr-2" />
                            Cancel Booking
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      <Footer />
    </div>
  )
}
