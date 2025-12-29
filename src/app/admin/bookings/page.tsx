'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import axios from 'axios'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  FaClipboardList, FaArrowLeft, FaCheckCircle, FaTimesCircle, 
  FaCalendarAlt, FaEye, FaSearch, FaFilter, FaDownload, 
  FaSync, FaFileExport, FaUsers, FaClock, FaEdit, FaUser,
  FaPhone, FaEnvelope
} from 'react-icons/fa'
import AdminLayout from '@/components/AdminLayout'

interface Booking {
  id: number
  booking_id: string
  name: string
  email: string
  phone: string
  visit_date: string
  visit_time: string
  visitor_count: number
  status: string
  created_at: string
}

interface Stats {
  total: number
  confirmed: number
  Confirmed: number
  cancelled: number
}

function AdminBookingsPageContent() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'view' | 'cancel' | 'reschedule'>('view')
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [stats, setStats] = useState<Stats>({
    total: 0,
    confirmed: 0,
    Confirmed: 0,
    cancelled: 0
  })

  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    search: '',
    date: ''
  })

  const [rescheduleData, setRescheduleData] = useState({
    visit_date: '',
    visit_time: ''
  })

  const [cancellationReason, setCancellationReason] = useState('')

  useEffect(() => {
    fetchBookings()
  }, [filters])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [success])

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        router.push('/admin/login')
        return
      }

      const params = new URLSearchParams()
      if (filters.status) params.append('status', filters.status)
      if (filters.search) params.append('search', filters.search)
      if (filters.date) params.append('date', filters.date)

      const response = await axios.get(`/api/bookings?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.data.success) {
        const bookingsList = response.data.data || []
        setBookings(bookingsList)
        
        // Calculate stats
        const total = bookingsList.length
        const confirmed = bookingsList.filter((b: Booking) => b.status === 'confirmed').length
        const Confirmed = bookingsList.filter((b: Booking) => b.status === 'confirmed').length
        const cancelled = bookingsList.filter((b: Booking) => b.status === 'cancelled').length
        
        setStats({ total, confirmed, Confirmed, cancelled })
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken')
        router.push('/admin/login')
      } else {
        setError('Failed to fetch bookings')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking)
    setModalType('view')
    setShowModal(true)
  }

  const handleCancelBooking = (booking: Booking) => {
    setSelectedBooking(booking)
    setModalType('cancel')
    setShowModal(true)
  }

  const handleRescheduleBooking = (booking: Booking) => {
    setSelectedBooking(booking)
    setRescheduleData({
      visit_date: booking.visit_date,
      visit_time: booking.visit_time
    })
    setModalType('reschedule')
    setShowModal(true)
  }

  const confirmCancellation = async () => {
    if (!selectedBooking) return

    try {
      const token = localStorage.getItem('adminToken')
      await axios.patch(`/api/bookings/${selectedBooking.id}`, {
        status: 'cancelled',
        cancellationReason
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      setSuccess('Booking cancelled successfully')
      setShowModal(false)
      setCancellationReason('')
      fetchBookings()
    } catch (err) {
      setError('Failed to cancel booking')
    }
  }

  const confirmReschedule = async () => {
    if (!selectedBooking) return

    try {
      const token = localStorage.getItem('adminToken')
      await axios.patch(`/api/bookings/${selectedBooking.id}`, {
        visit_date: rescheduleData.visit_date,
        visit_time: rescheduleData.visit_time
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      setSuccess('Booking rescheduled successfully')
      setShowModal(false)
      fetchBookings()
    } catch (err) {
      setError('Failed to reschedule booking')
    }
  }

  const exportBookings = () => {
    const csv = [
      ['Booking ID', 'Name', 'Email', 'Phone', 'Date', 'Time', 'Visitors', 'Status'].join(','),
      ...bookings.map(b => [
        b.booking_id,
        b.name,
        b.email,
        b.phone,
        b.visit_date,
        b.visit_time,
        b.visitor_count,
        b.status
      ].join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bookings_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard">
                <Button variant="outline" size="sm">
                  <FaArrowLeft className="mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <FaClipboardList className="text-blue-600 text-2xl" />
                <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={fetchBookings} variant="outline" size="sm">
                <FaSync className="mr-2" />
                Refresh
              </Button>
              <Button onClick={exportBookings} variant="outline" size="sm">
                <FaFileExport className="mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      )}

      {success && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <FaClipboardList className="text-3xl text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Confirmed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
                </div>
                <FaCheckCircle className="text-3xl text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600">Confirmed</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.Confirmed}</p>
                </div>
                <FaClock className="text-3xl text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600">Cancelled</p>
                  <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
                </div>
                <FaTimesCircle className="text-3xl text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaSearch className="inline mr-2" />
                  Search
                </label>
                <Input
                  placeholder="Name, email, phone, booking ID..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaFilter className="inline mr-2" />
                  Status
                </label>
                <select
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <option value="">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalendarAlt className="inline mr-2" />
                  Date
                </label>
                <Input
                  type="date"
                  value={filters.date}
                  onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                />
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setFilters({ status: '', search: '', date: '' })}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visit Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visitors
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <motion.tr
                      key={booking.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {booking.booking_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{booking.name}</div>
                        <div className="text-sm text-gray-500">{booking.email}</div>
                        <div className="text-sm text-gray-500">{booking.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(booking.visit_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.visit_time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.visitor_count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewBooking(booking)}
                          >
                            <FaEye />
                          </Button>
                          {booking.status !== 'cancelled' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRescheduleBooking(booking)}
                              >
                                <FaEdit />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCancelBooking(booking)}
                              >
                                <FaTimesCircle />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">
                {modalType === 'view' && 'Booking Details'}
                {modalType === 'cancel' && 'Cancel Booking'}
                {modalType === 'reschedule' && 'Reschedule Booking'}
              </h3>

              {modalType === 'view' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Booking ID</p>
                      <p className="font-medium">{selectedBooking.booking_id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-medium capitalize">{selectedBooking.status}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{selectedBooking.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{selectedBooking.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{selectedBooking.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Visitors</p>
                      <p className="font-medium">{selectedBooking.visitor_count}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Visit Date</p>
                      <p className="font-medium">{new Date(selectedBooking.visit_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Visit Time</p>
                      <p className="font-medium">{selectedBooking.visit_time}</p>
                    </div>
                  </div>
                </div>
              )}

              {modalType === 'cancel' && (
                <div className="space-y-4">
                  <p className="text-gray-600">Are you sure you want to cancel this booking?</p>
                  <div>
                    <label className="block text-sm font-medium mb-2">Cancellation Reason (Optional)</label>
                    <textarea
                      className="w-full px-3 py-2 border rounded-md"
                      rows={3}
                      value={cancellationReason}
                      onChange={(e) => setCancellationReason(e.target.value)}
                      placeholder="Enter reason for cancellation..."
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setShowModal(false)}>
                      Cancel
                    </Button>
                    <Button onClick={confirmCancellation} className="bg-red-600 hover:bg-red-700">
                      Confirm Cancellation
                    </Button>
                  </div>
                </div>
              )}

              {modalType === 'reschedule' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">New Date</label>
                    <Input
                      type="date"
                      value={rescheduleData.visit_date}
                      onChange={(e) => setRescheduleData({ ...rescheduleData, visit_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">New Time</label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={rescheduleData.visit_time}
                      onChange={(e) => setRescheduleData({ ...rescheduleData, visit_time: e.target.value })}
                    >
                      <option value="08:00">08:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="14:00">02:00 PM</option>
                    </select>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setShowModal(false)}>
                      Cancel
                    </Button>
                    <Button onClick={confirmReschedule}>
                      Confirm Reschedule
                    </Button>
                  </div>
                </div>
              )}

              {modalType === 'view' && (
                <div className="flex justify-end mt-6">
                  <Button onClick={() => setShowModal(false)}>
                    Close
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}


export default function AdminBookingsPage() {
  const router = useRouter()
  const [adminEmail, setAdminEmail] = useState('')
  useEffect(() => {
    const email = localStorage.getItem('adminUser')
    if (email) {
      try {
        const user = JSON.parse(email)
        setAdminEmail(user.email || user.username)
      } catch {
        setAdminEmail(email)
      }
    }
  }, [])
  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    router.push('/admin/login')
  }
  return (
    <AdminLayout
      title="Booking Management"
      description="View and manage all tour bookings"
      adminEmail={adminEmail}
      onLogout={handleLogout}
    >
      <AdminBookingsPageContent />
    </AdminLayout>
  )
}
