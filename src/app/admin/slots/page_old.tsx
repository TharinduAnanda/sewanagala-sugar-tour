'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import axios from 'axios'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  FaClock, FaArrowLeft, FaPlus, FaEdit, FaTrash, FaSave,
  FaTimes, FaCheckCircle, FaUsers, FaCalendarAlt, FaInfoCircle
} from 'react-icons/fa'

interface TimeSlot {
  id?: number
  start_time: string
  end_time: string
  max_capacity: number
  is_active: boolean
}

export default function AdminSlotsPage() {
  const [slots, setSlots] = useState<TimeSlot[]>([
    { start_time: '08:00', end_time: '10:00', max_capacity: 30, is_active: true },
    { start_time: '10:00', end_time: '12:00', max_capacity: 30, is_active: true },
    { start_time: '12:00', end_time: '14:00', max_capacity: 30, is_active: true },
    { start_time: '14:00', end_time: '16:00', max_capacity: 30, is_active: true }
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const router = useRouter()

  const [newSlot, setNewSlot] = useState<TimeSlot>({
    start_time: '',
    end_time: '',
    max_capacity: 30,
    is_active: true
  })

  const [editSlot, setEditSlot] = useState<TimeSlot | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
    }
  }, [])

  const handleAddSlot = () => {
    if (!newSlot.start_time || !newSlot.end_time || !newSlot.max_capacity) {
      setError('Please fill in all fields')
      return
    }

    if (newSlot.max_capacity < 1 || newSlot.max_capacity > 100) {
      setError('Capacity must be between 1 and 100')
      return
    }

    setSlots([...slots, { ...newSlot }])
    setNewSlot({ start_time: '', end_time: '', max_capacity: 30, is_active: true })
    setShowAddForm(false)
    setSuccess('Slot added successfully')
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleEditSlot = (index: number) => {
    setEditingIndex(index)
    setEditSlot({ ...slots[index] })
  }

  const handleSaveEdit = () => {
    if (editingIndex !== null && editSlot) {
      const updatedSlots = [...slots]
      updatedSlots[editingIndex] = editSlot
      setSlots(updatedSlots)
      setEditingIndex(null)
      setEditSlot(null)
      setSuccess('Slot updated successfully')
      setTimeout(() => setSuccess(''), 3000)
    }
  }

  const handleCancelEdit = () => {
    setEditingIndex(null)
    setEditSlot(null)
  }

  const handleDeleteSlot = (index: number) => {
    if (window.confirm('Are you sure you want to delete this slot?')) {
      const updatedSlots = slots.filter((_, i) => i !== index)
      setSlots(updatedSlots)
      setSuccess('Slot deleted successfully')
      setTimeout(() => setSuccess(''), 3000)
    }
  }

  const toggleSlotStatus = (index: number) => {
    const updatedSlots = [...slots]
    updatedSlots[index].is_active = !updatedSlots[index].is_active
    setSlots(updatedSlots)
    setSuccess(`Slot ${updatedSlots[index].is_active ? 'activated' : 'deactivated'} successfully`)
    setTimeout(() => setSuccess(''), 3000)
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
                <FaClock className="text-purple-600 text-2xl" />
                <h1 className="text-2xl font-bold text-gray-900">Tour Slots Management</h1>
              </div>
            </div>
            <Button onClick={() => setShowAddForm(true)} disabled={showAddForm}>
              <FaPlus className="mr-2" />
              Add New Slot
            </Button>
          </div>
        </div>
      </header>

      {/* Messages */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between"
          >
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-red-700 hover:text-red-900">
              <FaTimes />
            </button>
          </motion.div>
        </div>
      )}

      {success && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <FaCheckCircle />
              <span>{success}</span>
            </div>
            <button onClick={() => setSuccess('')} className="text-green-700 hover:text-green-900">
              <FaTimes />
            </button>
          </motion.div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Card */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <FaInfoCircle className="text-blue-600 text-xl mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Dynamic Slot System</h3>
                <p className="text-sm text-blue-800">
                  This system uses dynamic slot generation. The slots configured here define the available time slots 
                  for each day. Slots are generated automatically based on factory operating hours and holiday schedules.
                </p>
                <ul className="mt-2 text-sm text-blue-800 list-disc list-inside space-y-1">
                  <li>Weekends (Saturday & Sunday) are automatically blocked</li>
                  <li>Sri Lankan public holidays are automatically blocked</li>
                  <li>Maximum capacity per slot can be customized</li>
                  <li>Slots can be temporarily disabled without deletion</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Slot Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Add New Time Slot</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Time</label>
                    <Input
                      type="time"
                      value={newSlot.start_time}
                      onChange={(e) => setNewSlot({ ...newSlot, start_time: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">End Time</label>
                    <Input
                      type="time"
                      value={newSlot.end_time}
                      onChange={(e) => setNewSlot({ ...newSlot, end_time: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Max Capacity</label>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      value={newSlot.max_capacity}
                      onChange={(e) => setNewSlot({ ...newSlot, max_capacity: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <Button onClick={handleAddSlot} className="flex-1">
                      <FaSave className="mr-2" />
                      Save
                    </Button>
                    <Button onClick={() => setShowAddForm(false)} variant="outline">
                      <FaTimes />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Slots List */}
        <Card>
          <CardHeader>
            <CardTitle>Configured Time Slots ({slots.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {slots.map((slot, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 border rounded-lg ${
                    slot.is_active ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  {editingIndex === index && editSlot ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Start Time</label>
                        <Input
                          type="time"
                          value={editSlot.start_time}
                          onChange={(e) => setEditSlot({ ...editSlot, start_time: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">End Time</label>
                        <Input
                          type="time"
                          value={editSlot.end_time}
                          onChange={(e) => setEditSlot({ ...editSlot, end_time: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Max Capacity</label>
                        <Input
                          type="number"
                          min="1"
                          max="100"
                          value={editSlot.max_capacity}
                          onChange={(e) => setEditSlot({ ...editSlot, max_capacity: parseInt(e.target.value) })}
                        />
                      </div>
                      <div className="flex items-end gap-2">
                        <Button onClick={handleSaveEdit} size="sm" className="flex-1">
                          <FaSave className="mr-2" />
                          Save
                        </Button>
                        <Button onClick={handleCancelEdit} size="sm" variant="outline">
                          <FaTimes />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <FaClock className={slot.is_active ? 'text-green-600' : 'text-gray-400'} />
                          <span className="text-lg font-semibold">
                            {slot.start_time} - {slot.end_time}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaUsers />
                          <span>Max: {slot.max_capacity} visitors</span>
                        </div>
                        <div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            slot.is_active 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {slot.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => toggleSlotStatus(index)}
                          size="sm"
                          variant="outline"
                          className={slot.is_active ? 'text-yellow-600' : 'text-green-600'}
                        >
                          {slot.is_active ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          onClick={() => handleEditSlot(index)}
                          size="sm"
                          variant="outline"
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          onClick={() => handleDeleteSlot(index)}
                          size="sm"
                          variant="outline"
                          className="text-red-600"
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}

              {slots.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <FaClock className="text-4xl mx-auto mb-4 text-gray-300" />
                  <p>No time slots configured</p>
                  <p className="text-sm">Click "Add New Slot" to create your first time slot</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Slots</p>
                  <p className="text-3xl font-bold">{slots.length}</p>
                </div>
                <FaClock className="text-4xl text-gray-300" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Active Slots</p>
                  <p className="text-3xl font-bold text-green-600">
                    {slots.filter(s => s.is_active).length}
                  </p>
                </div>
                <FaCheckCircle className="text-4xl text-green-300" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Total Daily Capacity</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {slots.filter(s => s.is_active).reduce((sum, s) => sum + s.max_capacity, 0)}
                  </p>
                </div>
                <FaUsers className="text-4xl text-blue-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tips */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Best Practices</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <FaCheckCircle className="text-green-600 mt-1" />
                <span>Ensure time slots do not overlap to avoid scheduling conflicts</span>
              </li>
              <li className="flex items-start gap-2">
                <FaCheckCircle className="text-green-600 mt-1" />
                <span>Set realistic capacity limits based on available tour guides and resources</span>
              </li>
              <li className="flex items-start gap-2">
                <FaCheckCircle className="text-green-600 mt-1" />
                <span>Consider peak hours and adjust capacity accordingly</span>
              </li>
              <li className="flex items-start gap-2">
                <FaCheckCircle className="text-green-600 mt-1" />
                <span>Use the deactivate feature instead of deleting slots to preserve historical data</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
