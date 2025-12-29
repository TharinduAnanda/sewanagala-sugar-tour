'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import { motion } from 'framer-motion'
import axios from 'axios'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  FaChartBar, FaArrowLeft, FaDownload, FaCalendarAlt, 
  FaUsers, FaCheckCircle, FaTimesCircle, FaClock,
  FaArrowUp, FaArrowDown, FaFileExport, FaChartLine
} from 'react-icons/fa'

interface ReportData {
  overview: {
    totalBookings: number
    confirmedBookings: number
    pendingBookings: number
    cancelledBookings: number
    totalVisitors: number

  }
  trends: {
    bookingsByMonth: { month: string; count: number }[]
    bookingsByDay: { day: string; count: number }[]
  }
  topDates: { date: string; bookings: number; visitors: number }[]
}

function AdminReportsPageContent() {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    fetchReportData()
  }, [dateRange])

  const fetchReportData = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        router.push('/admin/login')
        return
      }

      // Fetch real data from API
      const response = await axios.get(
        `/api/admin/reports?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.data.success) {
        setReportData(response.data.data)
      } else {
        setError(response.data.message || 'Failed to fetch report data')
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push('/admin/login')
      } else {
        setError('Failed to fetch report data')
      }
    } finally {
      setLoading(false)
    }
  }

  const exportReport = (format: 'csv' | 'pdf') => {
    if (!reportData) return

    if (format === 'csv') {
      const csv = [
        ['Sewanagala Sugar Factory Tour - Report'],
        ['Date Range', `${dateRange.startDate} to ${dateRange.endDate}`],
        [''],
        ['Overview'],
        ['Total Bookings', reportData.overview.totalBookings],
        ['Confirmed', reportData.overview.confirmedBookings],
        ['Upcoming', reportData.overview.upcomingBookings],
        ['Cancelled', reportData.overview.cancelledBookings],
        ['Total Visitors', reportData.overview.totalVisitors],

        [''],
        ['Top Dates'],
        ['Date', 'Bookings', 'Visitors'],
        ...reportData.topDates.map(d => [d.date, d.bookings, d.visitors])
      ].map(row => row.join(',')).join('\n')

      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `report_${dateRange.startDate}_to_${dateRange.endDate}.csv`
      a.click()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reports...</p>
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
                <FaChartBar className="text-orange-600 text-2xl" />
                <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => exportReport('csv')} variant="outline" size="sm">
                <FaFileExport className="mr-2" />
                Export CSV
              </Button>
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
        {/* Date Range Filter */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Start Date</label>
                <Input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End Date</label>
                <Input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={fetchReportData} className="w-full">
                  Generate Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {reportData && (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Bookings</p>
                        <p className="text-3xl font-bold">{reportData.overview.totalBookings}</p>
                        <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                          <FaArrowUp />
                          12% from last period
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <FaChartLine className="text-blue-600 text-xl" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-600">Confirmed</p>
                        <p className="text-3xl font-bold text-green-600">{reportData.overview.confirmedBookings}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {Math.round((reportData.overview.confirmedBookings / reportData.overview.totalBookings) * 100)}% success rate
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <FaCheckCircle className="text-green-600 text-xl" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Visitors</p>
                        <p className="text-3xl font-bold">{reportData.overview.totalVisitors}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Avg: {Math.round(reportData.overview.totalVisitors / reportData.overview.totalBookings)} per booking
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <FaUsers className="text-purple-600 text-xl" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-yellow-600">Pending</p>
                        <p className="text-3xl font-bold text-yellow-600">{reportData.overview.pendingBookings}</p>
                        <p className="text-sm text-gray-500 mt-1">Awaiting confirmation</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                        <FaClock className="text-yellow-600 text-xl" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-red-600">Cancelled</p>
                        <p className="text-3xl font-bold text-red-600">{reportData.overview.cancelledBookings}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {Math.round((reportData.overview.cancelledBookings / reportData.overview.totalBookings) * 100)}% cancellation rate
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                        <FaTimesCircle className="text-red-600 text-xl" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bookings by Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reportData.trends.bookingsByMonth.map((item, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{item.month}</span>
                          <span className="text-sm text-gray-600">{item.count} bookings</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${(item.count / 60) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bookings by Day of Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reportData.trends.bookingsByDay.map((item, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{item.day}</span>
                          <span className="text-sm text-gray-600">{item.count} bookings</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all"
                            style={{ width: `${(item.count / 35) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Dates */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Dates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bookings</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Visitors</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {reportData.topDates.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(item.date).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.bookings}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.visitors}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}


function AdminReportsPage() {
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
      title="Reports & Analytics"
      description="View booking statistics and reports"
      adminEmail={adminEmail}
      onLogout={handleLogout}
    >
      <AdminReportsPageContent />
    </AdminLayout>
  )
}
export default AdminReportsPage


