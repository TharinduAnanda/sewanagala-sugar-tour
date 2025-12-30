'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarIcon, Users, DollarSign, Clock, Plus, X, AlertCircle, CalendarDays } from 'lucide-react'
import { FaIndustry, FaUser, FaSignOutAlt, FaCheckCircle, FaTimesCircle, FaCalendarDay, FaChartLine, FaClipboardList, FaCalendarAlt, FaClock, FaBell, FaBolt, FaInfoCircle, FaCheckDouble, FaImage } from 'react-icons/fa'
import { GiSugarCane } from 'react-icons/gi'
import { useRouter } from 'next/navigation'
import { fetchWithAuth, isAuthenticated } from '@/lib/authClient'
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isBefore, startOfDay } from 'date-fns'
import { motion } from 'framer-motion'

interface Stats {
  totalBookings: number
  totalRevenue: number
  pendingBookings: number
  todayBookings: number
  confirmedBookings: number
  cancelledBookings: number
  upcomingVisits: number
  todayVisits: number
}

interface FactoryClosure {
  id: number
  date: string
  reason: string
  type: 'maintenance' | 'holiday' | 'other'
  createdAt: string
}

interface GoogleHoliday {
  date: string
  name: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    todayBookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0,
    upcomingVisits: 0,
    todayVisits: 0
  })
  const [adminEmail, setAdminEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [factoryClosures, setFactoryClosures] = useState<FactoryClosure[]>([])
  const [googleHolidays, setGoogleHolidays] = useState<GoogleHoliday[]>([])
  const [isAddingClosure, setIsAddingClosure] = useState(false)
  const [newClosure, setNewClosure] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    reason: '',
    type: 'maintenance' as 'maintenance' | 'holiday' | 'other'
  })

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

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/admin/login')
      return
    }
    fetchStats()
    fetchFactoryClosures()
    fetchGoogleHolidays()
    setLoading(false)
  }, [])

  useEffect(() => {
    // Fetch closures when month changes
    fetchFactoryClosures()
    fetchGoogleHolidays()
  }, [currentMonth])

  const fetchStats = async () => {
    try {
      const response = await fetchWithAuth('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats({
          totalBookings: data.totalBookings || 0,
          totalRevenue: data.totalRevenue || 0,
          pendingBookings: data.pendingBookings || 0,
          todayBookings: data.todayBookings || 0,
          confirmedBookings: (data.totalBookings - data.pendingBookings) || 0,
          cancelledBookings: 0,
          upcomingVisits: data.todayBookings || 0,
          todayVisits: data.todayBookings || 0
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchFactoryClosures = async () => {
    try {
      const start = format(startOfMonth(currentMonth), 'yyyy-MM-dd')
      const end = format(endOfMonth(currentMonth), 'yyyy-MM-dd')
      const response = await fetch(`/api/calendar/closures?start=${start}&end=${end}`)
      if (response.ok) {
        const data = await response.json()
        setFactoryClosures(data)
      }
    } catch (error) {
      console.error('Error fetching factory closures:', error)
    }
  }

  const fetchGoogleHolidays = async () => {
    try {
      const start = format(startOfMonth(currentMonth), 'yyyy-MM-dd')
      const end = format(endOfMonth(currentMonth), 'yyyy-MM-dd')
      const response = await fetch(`/api/calendar/holidays?start=${start}&end=${end}`)
      if (response.ok) {
        const data = await response.json()
        setGoogleHolidays(data)
      }
    } catch (error) {
      console.error('Error fetching holidays:', error)
    }
  }

  const handleAddClosure = async () => {
    try {
      const response = await fetchWithAuth('/api/calendar/closures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClosure)
      })

      if (response.ok) {
        setIsAddingClosure(false)
        setNewClosure({
          date: format(new Date(), 'yyyy-MM-dd'),
          reason: '',
          type: 'maintenance'
        })
        fetchFactoryClosures()
      }
    } catch (error) {
      console.error('Error adding closure:', error)
    }
  }

  const handleDeleteClosure = async (id: number) => {
    try {
      const response = await fetch(`/api/calendar/closures/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchFactoryClosures()
      }
    } catch (error) {
      console.error('Error deleting closure:', error)
    }
  }

  const isDateClosed = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return factoryClosures.some(closure => closure.date === dateStr)
  }

  const isDateHoliday = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return googleHolidays.some(holiday => holiday.date === dateStr)
  }

  const getClosureForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return factoryClosures.find(closure => closure.date === dateStr)
  }

  const getHolidayForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return googleHolidays.find(holiday => holiday.date === dateStr)
  }
  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    router.push('/admin/login')
  }

  const selectedDateClosure = selectedDate ? getClosureForDate(selectedDate) : null
  const selectedDateHoliday = selectedDate ? getHolidayForDate(selectedDate) : null

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-yellow-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-50">
      {/* Enhanced Header with Hero Style */}
      <motion.header 
        className="bg-gradient-to-br from-green-900 to-green-700 text-white shadow-xl"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <motion.div 
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm">
                <GiSugarCane className="text-white text-3xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-green-100">Sewanagala Sugar Factory Tour Management</p>
              </div>
            </motion.div>
            <motion.div 
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="hidden md:flex items-center gap-2 text-sm bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <FaUser className="text-green-200" />
                <span className="text-white">{adminEmail}</span>
              </div>
              <Button onClick={handleLogout} variant="outline" size="sm" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                <FaSignOutAlt className="mr-2" />
                Logout
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">All time bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. {stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingBookings}</div>
            <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today&apos;s Bookings</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayBookings}</div>
            <p className="text-xs text-muted-foreground">Scheduled for today</p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Section */}
      <Card className="col-span-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Booking Calendar</CardTitle>
              <CardDescription>View bookings, holidays, and manage factory closures</CardDescription>
            </div>
            <Dialog open={isAddingClosure} onOpenChange={setIsAddingClosure}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Factory Closure
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Factory Closure</DialogTitle>
                  <DialogDescription>
                    Mark a date when the factory will be closed for maintenance or other reasons.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="closure-date">Date</Label>
                    <Input
                      id="closure-date"
                      type="date"
                      value={newClosure.date}
                      onChange={(e) => setNewClosure({ ...newClosure, date: e.target.value })}
                      min={format(startOfDay(new Date()), 'yyyy-MM-dd')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="closure-type">Type</Label>
                    <Select
                      value={newClosure.type}
                      onValueChange={(value: 'maintenance' | 'holiday' | 'other') => 
                        setNewClosure({ ...newClosure, type: value })
                      }
                    >
                      <SelectTrigger id="closure-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="holiday">Special Holiday</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="closure-reason">Reason</Label>
                    <Textarea
                      id="closure-reason"
                      placeholder="Enter reason for closure..."
                      value={newClosure.reason}
                      onChange={(e) => setNewClosure({ ...newClosure, reason: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddingClosure(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddClosure} disabled={!newClosure.reason.trim()}>
                    Add Closure
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="md:col-span-2">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                className="rounded-md border"
                modifiers={{
                  closed: (date) => isDateClosed(date),
                  holiday: (date) => isDateHoliday(date)
                }}
                modifiersStyles={{
                  closed: { 
                    backgroundColor: '#fee2e2',
                    color: '#991b1b',
                    fontWeight: 'bold'
                  },
                  holiday: {
                    backgroundColor: '#dbeafe',
                    color: '#1e40af',
                    fontWeight: 'bold'
                  }
                }}
              />
              
              {/* Legend */}
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-100 border border-red-200"></div>
                  <span>Factory Closure</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-blue-100 border border-blue-200"></div>
                  <span>Public Holiday</span>
                </div>
              </div>
            </div>

            {/* Details Panel */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">
                  {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
                </h3>
                
                {selectedDateHoliday && (
                  <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <CalendarDays className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900">Public Holiday</p>
                        <p className="text-sm text-blue-700">{selectedDateHoliday.name}</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedDateClosure && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-red-900">Factory Closed</p>
                          <Badge variant="outline" className="mt-1 capitalize">
                            {selectedDateClosure.type}
                          </Badge>
                          <p className="text-sm text-red-700 mt-2">{selectedDateClosure.reason}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClosure(selectedDateClosure.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-100"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {!selectedDateHoliday && !selectedDateClosure && selectedDate && (
                  <p className="text-sm text-muted-foreground">No closures or holidays on this date.</p>
                )}
              </div>

              {/* Upcoming Closures */}
              <div>
                <h3 className="font-semibold mb-2">Upcoming Closures</h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {factoryClosures
                    .filter(closure => new Date(closure.date) >= startOfDay(new Date()))
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .slice(0, 10)
                    .map((closure) => (
                      <div
                        key={closure.id}
                        className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedDate(new Date(closure.date))}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {format(new Date(closure.date), 'MMM d, yyyy')}
                            </p>
                            <Badge variant="outline" className="mt-1 capitalize text-xs">
                              {closure.type}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              {closure.reason}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteClosure(closure.id)
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  {factoryClosures.filter(closure => new Date(closure.date) >= startOfDay(new Date())).length === 0 && (
                    <p className="text-sm text-muted-foreground">No upcoming closures</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>


        {/* Media Management Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-8"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <FaImage className="h-6 w-6 text-purple-600" />
                    Station Media Management
                  </CardTitle>
                  <CardDescription>Upload and manage photos & videos for tour stations</CardDescription>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => router.push('/admin/stations')}>
                  <FaIndustry className="h-4 w-4 mr-2" />
                  Manage Stations
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-purple-100 flex items-center justify-center">
                  <FaImage className="text-purple-600 text-4xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Station Media Gallery</h3>
                <p className="text-gray-600 mb-6">
                  Upload photos and videos for each tour station using Cloudinary
                </p>
                <div className="flex gap-4 justify-center">
                  <Button 
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={() => router.push('/admin/stations')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Media to Stations
                  </Button>
                </div>
                <div className="mt-8 grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border-2 border-purple-200">
                    <FaImage className="text-purple-600 text-2xl mb-2 mx-auto" />
                    <p className="text-sm font-medium text-gray-900">Photo Upload</p>
                    <p className="text-xs text-gray-600">JPG, PNG, WebP</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200">
                    <FaImage className="text-blue-600 text-2xl mb-2 mx-auto" />
                    <p className="text-sm font-medium text-gray-900">Video Upload</p>
                    <p className="text-xs text-gray-600">MP4, MOV, AVI</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border-2 border-green-200">
                    <FaIndustry className="text-green-600 text-2xl mb-2 mx-auto" />
                    <p className="text-sm font-medium text-gray-900">14 Stations</p>
                    <p className="text-xs text-gray-600">Ready for media</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications & Activity */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <FaBell className="text-blue-600 text-2xl" />
            <h2 className="text-2xl font-bold text-gray-900">System Status & Notifications</h2>
          </div>
          <Card className="shadow-lg border-2">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-4">
                <motion.div 
                  className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center flex-shrink-0">
                      <FaInfoCircle className="text-blue-600 text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Today's Schedule</h4>
                      <p className="text-sm text-gray-700">{stats.todayVisits} confirmed tour(s) scheduled for today</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center flex-shrink-0">
                      <FaCalendarDay className="text-green-600 text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Upcoming Tours</h4>
                      <p className="text-sm text-gray-700">{stats.upcomingVisits} tour(s) in the next 7 days</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center flex-shrink-0">
                      <FaCheckDouble className="text-purple-600 text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">System Status</h4>
                      <p className="text-sm text-gray-700">All systems operational</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  )
}






















