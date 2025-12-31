'use client'

export const dynamic = 'force-dynamic'


import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, DollarSign, Clock, Calendar as CalendarIcon, 
  TrendingUp, CheckCircle, XCircle, ArrowRight
} from 'lucide-react'
import { fetchWithAuth, isAuthenticated } from '@/lib/authClient'

interface Stats {
  totalBookings: number
  totalVisitors: number
  upcomingBookings: number
  todayBookings: number
  thisMonthBookings: number
  completedBookings: number
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

function AdminDashboardContent() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({
    totalBookings: 0,
    totalVisitors: 0,
    upcomingBookings: 0,
    todayBookings: 0,
    thisMonthBookings: 0,
    completedBookings: 0
  })
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/admin/login')
      return
    }
    fetchDashboardData()
    setLoading(false)
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetchWithAuth('/api/admin/dashboard')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setStats({
            totalBookings: data.data.totalBookings || 0,
            totalVisitors: data.data.totalVisitors || 0,
            upcomingBookings: data.data.upcomingBookings || 0,
            todayBookings: data.data.todayBookings || 0,
            thisMonthBookings: data.data.thisMonthBookings || 0,
            completedBookings: data.data.completedBookings || 0
          })
          setRecentBookings(data.data.recentBookings || [])
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Hero Section - matching homepage gradient */}
      <section className="relative bg-gradient-to-br from-green-900/90 to-yellow-900/90 text-white overflow-hidden w-screen -ml-[calc(50vw-50%)] mb-8">
        <div className="absolute inset-0 bg-[url('/images/hero.jpg')] bg-cover bg-center opacity-20"></div>
        
        <div className="container relative mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Welcome Back!
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto opacity-90">
              Manage your tour bookings, calendar, and station media
            </p>
          </motion.div>

          {/* Stats Cards - matching homepage style */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <Users className="h-8 w-8 mb-2" />
              <h3 className="text-3xl font-bold mb-1">{stats.totalBookings}</h3>
              <p className="text-sm opacity-80">Total Bookings</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <Users className="h-8 w-8 mb-2" />
              <h3 className="text-3xl font-bold mb-1">{stats.totalVisitors}</h3>
              <p className="text-sm opacity-80">Total Visitors</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <TrendingUp className="h-8 w-8 mb-2" />
              <h3 className="text-3xl font-bold mb-1">{stats.upcomingBookings}</h3>
              <p className="text-sm opacity-80">Upcoming Tours</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <CalendarIcon className="h-8 w-8 mb-2" />
              <h3 className="text-3xl font-bold mb-1">{stats.todayBookings}</h3>
              <p className="text-sm opacity-80">Today's Tours</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="lg:col-span-1 space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/admin/bookings" className="block">
                  <Button className="w-full justify-between" variant="outline">
                    Manage Bookings
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/admin/calendar" className="block">
                  <Button className="w-full justify-between" variant="outline">
                    View Calendar
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/admin/stations" className="block">
                  <Button className="w-full justify-between" variant="outline">
                    Station Media
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/admin/reports" className="block">
                  <Button className="w-full justify-between" variant="outline">
                    View Reports
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/admin/slots" className="block">
                  <Button className="w-full justify-between" variant="outline">
                    Manage Slots
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Latest booking requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No bookings yet</p>
                  ) : (
                    recentBookings.map((booking) => (
                      <div
                        key={booking.booking_id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold">{booking.name}</h4>
                          <p className="text-sm text-muted-foreground">{booking.email}</p>
                        </div>
                        
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {new Date(booking.visit_date).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-muted-foreground">{booking.visit_time}</p>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {booking.visitor_count} visitors
                            </p>
                            <p className="text-xs text-muted-foreground">Rs. {booking.visitor_count * 1500}</p>
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
                                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                                  onClick={() => handleUpdateStatus(booking.booking_id, 'confirmed')}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                  onClick={() => handleUpdateStatus(booking.booking_id, 'cancelled')}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default function AdminDashboard() {
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
      title="Dashboard"
      description="Overview of tour bookings and statistics"
      adminEmail={adminEmail}
      onLogout={handleLogout}
      hideHero={true}
    >
      <AdminDashboardContent />
    </AdminLayout>
  )
}



