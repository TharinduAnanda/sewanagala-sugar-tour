'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FaCheckCircle, FaTimesCircle, FaFileAlt, FaClock, FaUsers, FaCalendarAlt } from 'react-icons/fa'
import axios from 'axios'
import LoadingSpinner from '@/components/LoadingSpinner'

interface SpecialBooking {
  id: number
  booking_reference: string
  name: string
  email: string
  phone: string
  visit_date: string
  visit_time: string
  requested_capacity: number
  special_request_reason: string
  special_booking_status: string
  status: string
  admin_review_notes: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string
  document_count: number
  slot_capacity: number
}

export default function SpecialBookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<SpecialBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const [selectedBooking, setSelectedBooking] = useState<SpecialBooking | null>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [reviewNotes, setReviewNotes] = useState('')
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | null>(null)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    fetchSpecialBookings()
  }, [filter])

  const fetchSpecialBookings = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('adminToken')
      const response = await axios.get(`/api/admin/special-bookings?status=${filter}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setBookings(response.data.data)
    } catch (error) {
      console.error('Error fetching special bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const viewBookingDetails = async (booking: SpecialBooking) => {
    setSelectedBooking(booking)
    
    // Fetch documents
    try {
      const token = localStorage.getItem('adminToken')
      const response = await axios.get(`/api/bookings/${booking.id}/documents`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setDocuments(response.data.data || [])
    } catch (error) {
      console.error('Error fetching documents:', error)
      setDocuments([])
    }
  }

  const handleReview = (action: 'approve' | 'reject') => {
    setReviewAction(action)
    setShowReviewDialog(true)
  }

  const submitReview = async () => {
    if (!selectedBooking || !reviewAction) return

    if (!reviewNotes.trim()) {
      alert('Please provide review notes')
      return
    }

    try {
      setProcessing(true)
      const token = localStorage.getItem('adminToken')
      
      await axios.post(
        `/api/admin/special-bookings/${selectedBooking.id}/approve`,
        {
          action: reviewAction,
          admin_review_notes: reviewNotes,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      alert(`Booking ${reviewAction === 'approve' ? 'approved' : 'rejected'} successfully!`)
      setShowReviewDialog(false)
      setSelectedBooking(null)
      setReviewNotes('')
      setReviewAction(null)
      fetchSpecialBookings()
    } catch (error: any) {
      console.error('Error reviewing booking:', error)
      alert(error.response?.data?.error || 'Failed to process booking')
    } finally {
      setProcessing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: any = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    }
    return (
      <Badge className={variants[status] || 'bg-gray-100 text-gray-800'}>
        {status.toUpperCase()}
      </Badge>
    )
  }

  if (loading) return <LoadingSpinner />

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Special Bookings Management</h1>
          <div className="flex gap-2">
            <Button
              variant={filter === 'pending' ? 'default' : 'outline'}
              onClick={() => setFilter('pending')}
            >
              Pending
            </Button>
            <Button
              variant={filter === 'approved' ? 'default' : 'outline'}
              onClick={() => setFilter('approved')}
            >
              Approved
            </Button>
            <Button
              variant={filter === 'rejected' ? 'default' : 'outline'}
              onClick={() => setFilter('rejected')}
            >
              Rejected
            </Button>
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
            >
              All
            </Button>
          </div>
        </div>

        {bookings.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500">No special bookings found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <Card key={booking.id} className="border-l-4 border-l-amber-500">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{booking.name}</CardTitle>
                      <p className="text-sm text-gray-500">
                        Ref: {booking.booking_reference}
                      </p>
                    </div>
                    {getStatusBadge(booking.special_booking_status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <FaUsers className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Capacity</p>
                        <p className="font-semibold">{booking.requested_capacity}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="font-semibold">{booking.visit_date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Time</p>
                        <p className="font-semibold">{booking.visit_time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaFileAlt className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Documents</p>
                        <p className="font-semibold">{booking.document_count}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold mb-1">Request Reason:</p>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {booking.special_request_reason}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewBookingDetails(booking)}
                    >
                      View Details
                    </Button>
                    {booking.special_booking_status === 'pending' && (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => {
                            setSelectedBooking(booking)
                            handleReview('approve')
                          }}
                        >
                          <FaCheckCircle className="mr-2" />
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setSelectedBooking(booking)
                            handleReview('reject')
                          }}
                        >
                          <FaTimesCircle className="mr-2" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Booking Details Dialog */}
        {selectedBooking && !showReviewDialog && (
          <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Special Booking Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold">Name</p>
                    <p>{selectedBooking.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Email</p>
                    <p>{selectedBooking.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Phone</p>
                    <p>{selectedBooking.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Requested Capacity</p>
                    <p className="text-lg font-bold text-amber-600">
                      {selectedBooking.requested_capacity} visitors
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold mb-2">Request Reason</p>
                  <p className="text-sm bg-gray-50 p-3 rounded">
                    {selectedBooking.special_request_reason}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold mb-2">
                    Supporting Documents ({documents.length})
                  </p>
                  {documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded mb-2"
                    >
                      <span className="text-sm">{doc.file_name}</span>
                      <a
                        href={doc.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View
                      </a>
                    </div>
                  ))}
                </div>

                {selectedBooking.admin_review_notes && (
                  <div>
                    <p className="text-sm font-semibold mb-2">Admin Review Notes</p>
                    <p className="text-sm bg-blue-50 p-3 rounded">
                      {selectedBooking.admin_review_notes}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Reviewed by {selectedBooking.reviewed_by} on{' '}
                      {new Date(selectedBooking.reviewed_at!).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Review Dialog */}
        {showReviewDialog && (
          <Dialog open={showReviewDialog} onOpenChange={() => setShowReviewDialog(false)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {reviewAction === 'approve' ? 'Approve' : 'Reject'} Special Booking
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm">
                  Booking Reference: <strong>{selectedBooking?.booking_reference}</strong>
                </p>
                <p className="text-sm">
                  Requested Capacity: <strong>{selectedBooking?.requested_capacity} visitors</strong>
                </p>
                <div>
                  <label className="text-sm font-semibold block mb-2">
                    Review Notes <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    rows={4}
                    placeholder={
                      reviewAction === 'approve'
                        ? 'Add any special instructions or notes for the visitor...'
                        : 'Provide reason for rejection...'
                    }
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={submitReview}
                    disabled={processing}
                    className={
                      reviewAction === 'approve'
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-red-600 hover:bg-red-700'
                    }
                  >
                    {processing ? 'Processing...' : reviewAction === 'approve' ? 'Approve' : 'Reject'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminLayout>
  )
}
