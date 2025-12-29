'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import axios from 'axios'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  FaCalendarAlt, FaArrowLeft, FaChevronLeft, FaChevronRight,
  FaCheckCircle, FaClock, FaTimesCircle, FaUsers, FaPlus, FaStar
} from 'react-icons/fa'

interface Booking {
  id: number
  booking_id: string
  name: string
  visit_date: string
  visit_time: string
  visitor_count: number
  status: string
}

interface DayBookings {
  [key: string]: Booking[]
}

interface Holiday {
  date: string
  name: string
  description?: string
}

export default function AdminCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [bookings, setBookings] = useState<DayBookings>({})
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedDayBookings, setSelectedDayBookings] = useState<Booking[]>([])
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchMonthBookings()
    fetchHolidays()
  }, [currentDate])

  const fetchMonthBookings = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        router.push('/admin/login')
        return
      }

      const year = currentDate.getFullYear()
      const month = currentDate.getMonth() + 1
      
      const response = await axios.get(`/api/bookings?month=${year}-${month.toString().padStart(2, '0')}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.data.success) {
        const bookingsList = response.data.data || []
        
        // Group bookings by date
        const grouped: DayBookings = {}
        bookingsList.forEach((booking: Booking) => {
          const date = booking.visit_date.split('T')[0]
          if (!grouped[date]) {
            grouped[date] = []
          }
          grouped[date].push(booking)
        })
        
        setBookings(grouped)
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push('/admin/login')
      } else {
        setError('Failed to fetch bookings')
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchHolidays = async () => {
    try {
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth() + 1
      
      const response = await axios.get('/api/holidays', {
        params: { year, month }
      })

      if (response.data.success) {
        setHolidays(response.data.data || [])
      }
    } catch (err) {
      console.error('Failed to fetch holidays:', err)
      setHolidays([])
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const getDateString = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const getBookingsForDate = (date: Date) => {
    const dateStr = getDateString(date)
    return bookings[dateStr] || []
  }

  const getHolidayForDate = (date: Date) => {
    const dateStr = getDateString(date)
    return holidays.find(h => h.date === dateStr)
  }

  const handleDayClick = (date: Date) => {
    const dateStr = getDateString(date)
    setSelectedDate(dateStr)
    setSelectedDayBookings(bookings[dateStr] || [])
    setSelectedHoliday(getHolidayForDate(date) || null)
  }

  const getBookingStats = (dateBookings: Booking[]) => {
    const confirmed = dateBookings.filter(b => b.status === 'confirmed').length
    const pending = dateBookings.filter(b => b.status === 'pending').length
    const totalVisitors = dateBookings.reduce((sum, b) => sum + b.visitor_count, 0)
    return { confirmed, pending, totalVisitors }
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const days = getDaysInMonth(currentDate)
  const today = new Date().toISOString().split('T')[0]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading calendar...</p>
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
                <FaCalendarAlt className="text-blue-600 text-2xl" />
                <h1 className="text-2xl font-bold text-gray-900">Calendar View</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={previousMonth}>
                      <FaChevronLeft />
                    </Button>
                    <Button variant="outline" size="sm" onClick={nextMonth}>
                      <FaChevronRight />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {dayNames.map(day => (
                    <div key={day} className="text-center font-semibold text-sm text-gray-600 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-2">
                  {days.map((day, index) => {
                    if (!day) {
                      return <div key={`empty-${index}`} className="aspect-square" />
                    }

                    const dateStr = getDateString(day)
                    const dayBookings = getBookingsForDate(day)
                    const holiday = getHolidayForDate(day)
                    const isToday = dateStr === today
                    const isSelected = dateStr === selectedDate
                    const stats = getBookingStats(dayBookings)

                    return (
                      <motion.div
                        key={dateStr}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => handleDayClick(day)}
                        className={`
                          aspect-square p-2 rounded-lg cursor-pointer border-2 transition-all
                          ${isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                          ${isSelected ? 'ring-2 ring-blue-400 bg-blue-100' : ''}
                          ${holiday ? 'bg-red-50 border-red-300' : (dayBookings.length > 0 ? 'bg-green-50' : 'bg-white')}
                          hover:shadow-md
                        `}
                        title={holiday ? `Holiday: ${holiday.name}` : undefined}
                      >
                        <div className="text-sm font-semibold text-gray-900 flex items-center justify-between">
                          <span>{day.getDate()}</span>
                          {holiday && <FaStar className="text-red-600 text-xs" />}
                        </div>
                        {holiday && (
                          <div className="mt-1">
                            <div className="text-xs text-red-600 font-medium truncate">
                              🇱🇰 {holiday.name}
                            </div>
                          </div>
                        )}
                        {!holiday && dayBookings.length > 0 && (
                          <div className="mt-1 space-y-1">
                            <div className="text-xs text-green-600 font-medium">
                              {stats.confirmed} confirmed
                            </div>
                            {stats.pending > 0 && (
                              <div className="text-xs text-yellow-600">
                                {stats.pending} pending
                              </div>
                            )}
                            <div className="text-xs text-gray-500">
                              {stats.totalVisitors} visitors
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Legend */}
            <Card className="mt-4">
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded border-2 border-blue-500 bg-blue-50"></div>
                    <span>Today</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded border-2 border-gray-200 bg-green-50"></div>
                    <span>Has Bookings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded border-2 border-red-300 bg-red-50"></div>
                    <span>🇱🇰 Holiday</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded border-2 border-gray-200 bg-white"></div>
                    <span>No Bookings</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Selected Day Details */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedDate ? (
                    <>Selected Date Details</>
                  ) : (
                    <>Select a Date</>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDate ? (
                  <div className="space-y-4">
                    <div className="text-lg font-semibold text-gray-900">
                      {new Date(selectedDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>

                    {selectedHoliday && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FaStar className="text-red-600" />
                          <span className="font-semibold text-red-900">🇱🇰 Sri Lankan Holiday</span>
                        </div>
                        <p className="text-sm text-red-700">{selectedHoliday.name}</p>
                        {selectedHoliday.description && (
                          <p className="text-xs text-red-600 mt-1">{selectedHoliday.description}</p>
                        )}
                      </div>
                    )}

                    {selectedDayBookings.length === 0 && !selectedHoliday ? (
                      <div className="text-center py-8 text-gray-500">
                        No bookings for this date
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedDayBookings.map((booking) => (
                          <motion.div
                            key={booking.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 border rounded-lg hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="font-medium text-gray-900">
                                {booking.name}
                              </div>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {booking.status}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <div className="flex items-center gap-2">
                                <FaClock className="text-gray-400" />
                                {booking.visit_time}
                              </div>
                              <div className="flex items-center gap-2">
                                <FaUsers className="text-gray-400" />
                                {booking.visitor_count} visitors
                              </div>
                              <div className="text-xs text-gray-500">
                                ID: {booking.booking_id}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {selectedDayBookings.length > 0 && (
                      <div className="pt-4 border-t">
                        <Link href={`/admin/bookings?date=${selectedDate}`}>
                          <Button className="w-full" variant="outline">
                            View All Bookings for This Date
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Click on a date in the calendar to view bookings
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Bookings</span>
                    <span className="font-bold text-lg">
                      {Object.values(bookings).flat().length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Confirmed</span>
                    <span className="font-bold text-lg text-green-600">
                      {Object.values(bookings).flat().filter(b => b.status === 'confirmed').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Pending</span>
                    <span className="font-bold text-lg text-yellow-600">
                      {Object.values(bookings).flat().filter(b => b.status === 'pending').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Visitors</span>
                    <span className="font-bold text-lg text-blue-600">
                      {Object.values(bookings).flat().reduce((sum, b) => sum + b.visitor_count, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm text-gray-600">🇱🇰 Holidays</span>
                    <span className="font-bold text-lg text-red-600">
                      {holidays.length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
