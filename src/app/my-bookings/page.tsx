'use client'

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

  const handleCancelEdit = () => {
    setEditingBooking(null)
    setCurrentView('bookings')
    setError('')
    setSuccess('')
  }

  const handleSaveEdit = async () => {
    if (!editingBooking) return

    setError('')
    setSuccess('')

    // Validate required fields
    if (!editForm.name || !editForm.email || !editForm.visit_date || !editForm.visit_time) {
      setError('Please fill in all required fields')
      return
    }

    if (editForm.visitor_count < 1 || editForm.visitor_count > 30) {
      setError('Visitor count must be between 1 and 30')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/bookings/${editingBooking.id}/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: editForm.name,
          email: editForm.email,
          visitor_count: editForm.visitor_count,
          visit_date: editForm.visit_date,
          visit_time: editForm.visit_time,
          special_requirements: editForm.special_requirements
        })
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.message || 'Failed to update booking')
        return
      }

      setSuccess('Booking updated successfully!')
      
      // Update local bookings list
      const updatedBookings = bookings.map(b => 
        b.id === editingBooking.id 
          ? { ...b, ...editForm }
          : b
      )
      setBookings(updatedBookings)
      
      // Return to bookings view after a short delay
      setTimeout(() => {
        setCurrentView('bookings')
        setEditingBooking(null)
      }, 1500)
    } catch (err: any) {
      setError('Failed to update booking: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (booking: Booking) => {
    setDeleteConfirm(booking)
    setError('')
  }

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return

    setError('')
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
    const styles = {
      pending: 'bg-amber-500 hover:bg-amber-600 text-white',
      confirmed: 'bg-green-600 hover:bg-green-700 text-white',
      completed: 'bg-blue-600 hover:bg-blue-700 text-white',
      cancelled: 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
    }
    return styles[status as keyof typeof styles] || 'bg-muted text-muted-foreground'
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary/5 to-background">
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
              <Card className="shadow-xl border-primary/20">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl sm:text-3xl text-center">
                    Check Your Bookings
                  </CardTitle>
                  <p className="text-center text-muted-foreground text-sm">
                    Enter your phone number to view and manage your tour bookings
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePhoneLogin} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <FaPhone className="inline mr-2 text-primary" />
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
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm"
                      >
                        {error}
                      </motion.div>
                    )}

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full text-lg py-6"
                      size="lg"
                    >
                      {loading ? (
                        <>
                          <span className="animate-spin mr-2">Ã¢ÂÂ³</span>
                          Searching...
                        </>
                      ) : (
                        <>
                          <FaSearch className="mr-2" />
                          Find My Bookings
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground flex items-start gap-2">
                      <FaInfoCircle className="text-primary mt-0.5 flex-shrink-0" />
                      <span>
                        Enter the phone number you used when booking. You can view, edit, or cancel your bookings from here.
                      </span>
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
              className="max-w-4xl mx-auto"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">My Bookings</h1>
                  <p className="text-muted-foreground text-sm mt-1">Phone: {phone}</p>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                >
                  <FaArrowLeft className="mr-2" />
                  Back to Search
                </Button>
              </div>

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg"
                >
                  <FaCheckCircle className="inline mr-2" />
                  {success}
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg"
                >
                  {error}
                </motion.div>
              )}

              <div className="grid grid-cols-1 gap-4">
                {bookings.map((booking) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="shadow-lg hover:shadow-xl transition-shadow border-border">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                          <div>
                            <h3 className="text-xl font-bold mb-1">{booking.name}</h3>
                            <p className="font-mono text-sm text-muted-foreground">
                              Booking ID: {booking.booking_id}
                            </p>
                          </div>
                          <span className={cn(
                            'px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide transition-colors',
                            getStatusBadge(booking.status)
                          )}>
                            {booking.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-start gap-3">
                            <FaCalendar className="text-primary mt-1 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-muted-foreground uppercase tracking-wide">Date</p>
                              <p className="font-semibold">{formatDate(booking.visit_date)}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <FaClock className="text-primary mt-1 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-muted-foreground uppercase tracking-wide">Time</p>
                              <p className="font-semibold">{booking.visit_time}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <FaUsers className="text-primary mt-1 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-muted-foreground uppercase tracking-wide">Visitors</p>
                              <p className="font-semibold">{booking.visitor_count} person(s)</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <FaEnvelope className="text-primary mt-1 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-muted-foreground uppercase tracking-wide">Email</p>
                              <p className="font-semibold text-sm break-all">{booking.email}</p>
                            </div>
                          </div>
                        </div>

                        {booking.special_requirements && (
                          <div className="mb-4 p-3 bg-accent/50 rounded-lg border border-border">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1 flex items-center gap-1">
                              <FaInfoCircle className="text-primary" />
                              Special Requirements
                            </p>
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
                                size="sm" 
                                className="w-full sm:w-auto"
                              >
                                <FaEdit className="mr-2" />
                                Edit
                              </Button>
                              <Button
                                onClick={() => handleDeleteClick(booking)}
                                disabled={loading}
                                variant="destructive"
                                size="sm" 
                                className="w-full sm:w-auto"
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
                ))}
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
              <Card className="shadow-xl border-primary/20">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl">
                    Edit Booking: {editingBooking.booking_id}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Full Name *</label>
                        <Input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          placeholder="Enter full name"
                          disabled={loading}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email *</label>
                        <Input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          placeholder="Enter email"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Visit Date *</label>
                        <Input
                          type="date"
                          value={editForm.visit_date}
                          onChange={(e) => setEditForm({ ...editForm, visit_date: e.target.value })}
                          disabled={loading}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Visit Time *</label>
                        <Input
                          type="time"
                          value={editForm.visit_time}
                          onChange={(e) => setEditForm({ ...editForm, visit_time: e.target.value })}
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <FaUsers className="inline mr-2 text-primary" />
                        Number of Visitors *
                      </label>
                      <Input
                        type="number"
                        min="1"
                        max="30"
                        value={editForm.visitor_count}
                        onChange={(e) => setEditForm({ ...editForm, visitor_count: parseInt(e.target.value) || 1 })}
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <FaInfoCircle className="inline mr-2 text-primary" />
                        Special Requirements (Optional)
                      </label>
                      <textarea
                        value={editForm.special_requirements}
                        onChange={(e) => setEditForm({ ...editForm, special_requirements: e.target.value })}
                        placeholder="Any special requirements..."
                        rows={3}
                        className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                        disabled={loading}
                      />
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm"
                      >
                        {error}
                      </motion.div>
                    )}

                    {success && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg"
                      >
                        <FaCheckCircle className="inline mr-2" />
                        {success}
                      </motion.div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button
                        onClick={handleCancelEdit}
                        disabled={loading}
                        variant="outline"
                        className="w-full sm:w-auto"
                      >
                        <FaArrowLeft className="mr-2" />
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveEdit}
                        className="w-full sm:flex-1"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="animate-spin mr-2">Ã¢ÂÂ³</span>
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
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={handleCancelDelete}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-md w-full"
              >
                <Card className="shadow-2xl border-destructive/20">
                  <CardHeader>
                    <CardTitle className="text-xl text-destructive flex items-center gap-2">
                      <FaTrash />
                      Cancel Booking?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-muted-foreground">Are you sure you want to cancel this booking?</p>
                    <div className="bg-muted/50 p-4 rounded-lg mb-4 border border-border">
                      <p className="font-mono text-sm mb-2">Booking ID: <span className="font-bold">{deleteConfirm.booking_id}</span></p>
                      <p className="text-sm font-semibold flex items-center gap-2">
                        <FaCalendar className="text-primary" />
                        {formatDate(deleteConfirm.visit_date)} at {deleteConfirm.visit_time}
                      </p>
                    </div>
                    
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-4 text-sm"
                      >
                        {error}
                      </motion.div>
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
                            <span className="animate-spin mr-2">Ã¢ÂÂ³</span>
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
