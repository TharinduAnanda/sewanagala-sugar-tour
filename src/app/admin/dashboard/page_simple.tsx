'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X, CalendarDays } from 'lucide-react'
import { format, startOfMonth, endOfMonth, startOfDay } from 'date-fns'
import { 
  Users, DollarSign, Clock, Calendar as CalendarIcon, 
  TrendingUp, AlertCircle, CheckCircle, XCircle 
} from 'lucide-react'
import { FaIndustry, FaUser, FaSignOutAlt } from 'react-icons/fa'
import { GiSugarCane } from 'react-icons/gi'
import { fetchWithAuth, isAuthenticated } from '@/lib/authClient'

interface Stats {
  totalBookings: number
  totalRevenue: number
  pendingBookings: number
  todayBookings: number
  confirmedBookings: number
  cancelledBookings: number
}

interface Booking {
  booking_id: number
  name: string
  email: string
  phone: string
  visit_date: string
  visit_time: string
  visitor_count: number
  status: string
  created_at: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    todayBookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0
  })
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])
  const [adminEmail, setAdminEmail] = useState('')
  const [loading, setLoading] = useState(true)

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
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetchWithAuth('/api/admin/dashboard')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setStats({
            totalBookings: data.data.totalBookings || 0,
            totalRevenue: data.data.totalRevenue || 0,
            pendingBookings: data.data.pendingBookings || 0,
            todayBookings: data.data.todayBookings || 0,
            confirmedBookings: (data.data.totalBookings - data.data.pendingBookings) || 0,
            cancelledBookings: 0
          })
          setRecentBookings(data.data.recentBookings || [])
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    router.push('/admin/login')
  }

  const handleUpdateStatus = async (bookingId: number, newStatus: string) => {
    try {
      const response = await fetchWithAuth(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        fetchDashboardData()
      }
    } catch (error) {
      console.error('Error updating booking status:', error)
    }
  }

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
      {/* Header */}
      <motion.header 
        className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-green-900 to-green-700 text-white shadow-lg"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <GiSugarCane className="h-8 w-8" />
            <span className="font-bold text-xl">Admin Dashboard</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
              <FaUser />
              <span>{adminEmail}</span>
            </div>
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              size="sm" 
              className="bg-white/10 text-white border-white/30 hover:bg-white/20"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back!</h1>
          <p className="text-gray-600">Here's what's happening with your tours today.</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.totalBookings}</div>
              <p className="text-xs text-gray-600 mt-1">All time bookings</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">Rs. {stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-gray-600 mt-1">All time revenue</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.pendingBookings}</div>
              <p className="text-xs text-gray-600 mt-1">Awaiting confirmation</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Tours</CardTitle>
              <CalendarIcon className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.todayBookings}</div>
              <p className="text-xs text-gray-600 mt-1">Scheduled for today</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-2">
            <CardHeader>
              <CardTitle className="text-2xl">Recent Bookings</CardTitle>
              <CardDescription>Latest booking requests and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No bookings yet</p>
                ) : (
                  recentBookings.map((booking) => (
                    <motion.div
                      key={booking.booking_id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            <Users className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{booking.name}</h4>
                            <p className="text-sm text-gray-600">{booking.email}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(booking.visit_date).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-600">{booking.visit_time}</p>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {booking.visitor_count} visitors
                          </p>
                          <p className="text-xs text-gray-600">Rs. {booking.visitor_count * 1500}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              booking.status === 'confirmed' ? 'default' :
                              booking.status === 'pending' ? 'secondary' : 'destructive'
                            }
                            className="capitalize"
                          >
                            {booking.status}
                          </Badge>
                          
                          {booking.status === 'pending' && (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => handleUpdateStatus(booking.booking_id, 'confirmed')}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleUpdateStatus(booking.booking_id, 'cancelled')}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="mt-8 grid md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-green-600" />
                View All Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Manage all tour bookings and reservations</p>
              <Button className="mt-4 w-full bg-green-600 hover:bg-green-700" onClick={() => router.push('/admin/bookings')}>
                Go to Bookings
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                View Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Analytics and booking statistics</p>
              <Button className="mt-4 w-full bg-blue-600 hover:bg-blue-700" onClick={() => router.push('/admin/reports')}>
                View Reports
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaIndustry className="h-5 w-5 text-purple-600" />
                Manage Stations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Update station information and media</p>
              <Button className="mt-4 w-full bg-purple-600 hover:bg-purple-700" onClick={() => router.push('/admin/stations')}>
                Manage Stations
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

