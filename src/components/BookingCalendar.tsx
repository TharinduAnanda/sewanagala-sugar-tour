'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FaChevronLeft, FaChevronRight, FaClock, FaLock, FaStar } from 'react-icons/fa'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isBefore, startOfToday, getDay } from 'date-fns'

interface TimeSlot {
  id: number
  date: string
  time_slot: string
  available_spots: number
  max_capacity: number
}

interface ClosureLike {
  date: string // 'YYYY-MM-DD'
  reason?: string
}

interface BookingCalendarProps {
  onDateSelect: (date: string) => void
  onSlotSelect: (slot: TimeSlot) => void
  selectedDate?: string
  selectedSlot?: TimeSlot
  closures?: ClosureLike[] // optional external closures (manual)
}

export default function BookingCalendar({ onDateSelect, onSlotSelect, selectedDate, selectedSlot, closures }: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [apiClosures, setApiClosures] = useState<ClosureLike[]>([])
  const [apiHolidays, setApiHolidays] = useState<ClosureLike[]>([])
  const today = startOfToday()

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })
  
  // Add empty cells at the beginning to align with the correct day of week
  const startDayOfWeek = getDay(monthStart) // 0 = Sunday, 1 = Monday, etc.
  const emptyDays = Array(startDayOfWeek).fill(null)
  const days = [...emptyDays, ...monthDays]

  // Fetch public calendar overview to mark closures and holidays (DB-backed)
  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const year = currentMonth.getFullYear()
        const month = currentMonth.getMonth() + 1
        const res = await axios.get('/api/calendar/overview/public', { params: { year, month } })
        const calendar = res.data?.calendar
        if (calendar?.days?.length) {
          const closuresFromDays: ClosureLike[] = []
          const holidaysFromDays: ClosureLike[] = []
          for (const d of calendar.days) {
            if (d.isHoliday) {
              holidaysFromDays.push({ date: d.date, reason: d.closureReason || 'Holiday' })
            } else if (d.isClosed) {
              closuresFromDays.push({ date: d.date, reason: d.closureReason || 'Closed' })
            }
          }
          setApiClosures(closuresFromDays)
          setApiHolidays(holidaysFromDays)
        } else {
          setApiClosures([])
          setApiHolidays([])
        }
      } catch (err) {
        console.warn('Could not fetch public calendar overview', err)
        setApiClosures([])
        setApiHolidays([])
      }
    }
    fetchCalendar()
  }, [currentMonth])

  // Build maps for fast lookup (props closures override API closures, holidays only from API)
  const closureMap = useMemo(() => {
    const map = new Map<string, string | undefined>()
    const source = closures && closures.length ? closures : apiClosures
    for (const c of source) map.set(c.date, c.reason)
    return map
  }, [closures, apiClosures])

  const holidayMap = useMemo(() => {
    const map = new Map<string, string | undefined>()
    for (const h of apiHolidays) map.set(h.date, h.reason)
    return map
  }, [apiHolidays])

  const fetchSlotsForDate = async (date: string) => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/slots?date=${date}`)
      setSlots(response.data.data || [])
    } catch (error) {
      console.error('Error fetching slots:', error)
      setSlots([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedDate) fetchSlotsForDate(selectedDate)
  }, [selectedDate])

  const handleDateClick = (date: Date) => {
    if (isBefore(date, today)) return
    const dateStr = format(date, 'yyyy-MM-dd')
    // Prevent selecting closed or holiday dates
    if (closureMap.has(dateStr) || holidayMap.has(dateStr)) return
    onDateSelect(dateStr)
  }

  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  return (
    <div className="space-y-4">
      {/* Calendar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{format(currentMonth, 'MMMM yyyy')}</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={previousMonth}>
                <FaChevronLeft />
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <FaChevronRight />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-semibold text-xs sm:text-sm text-muted-foreground p-2">
                {day}
              </div>
            ))}
            {days.map((day, idx) => {
              if (!day) return <div key={`empty-${idx}`} className="p-2" />

              const dateStr = format(day, 'yyyy-MM-dd')
              const isPast = isBefore(day, today)
              const isSelected = selectedDate === dateStr
              const isCurrentMonth = isSameMonth(day, currentMonth)
              const closureReason = closureMap.get(dateStr)
              const holidayReason = holidayMap.get(dateStr)
              const isClosed = !!closureReason
              const isHoliday = !!holidayReason

              // Build classes
              const base = 'relative p-2 rounded-lg text-center transition-colors'
              const monthTone = !isCurrentMonth ? 'text-muted-foreground/30' : ''
              const pastTone = isPast ? 'text-muted-foreground/30 cursor-not-allowed' : 'cursor-pointer'
              const todayRing = isToday(day) ? 'border-2 border-primary' : ''
              const selectedTone = isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
              const closedTone = 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-50 cursor-not-allowed'
              const holidayTone = 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-50 cursor-not-allowed'

              const tone = isHoliday ? holidayTone : (isClosed ? closedTone : selectedTone)

              return (
                <motion.button
                  key={idx}
                  onClick={() => handleDateClick(day)}
                  disabled={isPast || !isCurrentMonth || isClosed || isHoliday}
                  whileHover={!isPast && isCurrentMonth && !isClosed && !isHoliday ? { scale: 1.1 } : {}}
                  whileTap={!isPast && isCurrentMonth && !isClosed && !isHoliday ? { scale: 0.95 } : {}}
                  className={[base, monthTone, pastTone, todayRing, tone].join(' ')}
                  title={isHoliday ? (holidayReason ? `Holiday: ${holidayReason}` : 'Holiday') : (isClosed ? (closureReason ? `Closed: ${closureReason}` : 'Closed') : undefined)}
                >
                  {format(day, 'd')}
                  {isHoliday && (
                    <span className="absolute top-1 right-1 text-blue-600" aria-label="Holiday" title={holidayReason || 'Holiday'}>
                      <FaStar size={10} />
                    </span>
                  )}
                  {!isHoliday && isClosed && (
                    <span className="absolute top-1 right-1 text-red-600" aria-label="Closed" title={closureReason || 'Closed'}>
                      <FaLock size={10} />
                    </span>
                  )}
                </motion.button>
              )
            })}
          </div>

          {/* Legend */}
          <div className="mt-3 flex flex-wrap gap-3 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded bg-accent" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded bg-red-200 border border-red-300" />
              <span>Factory Closed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded bg-blue-200 border border-blue-300" />
              <span>Holiday</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Slots */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaClock />
              Available Time Slots for {format(new Date(selectedDate), 'MMMM d, yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-muted-foreground">Loading slots...</p>
            ) : slots.length === 0 ? (
              <p className="text-center text-muted-foreground">No slots available for this date</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {slots.map((slot) => (
                  <motion.div
                    key={slot.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant={selectedSlot?.id === slot.id ? 'default' : 'outline'}
                      className="w-full h-auto flex flex-col items-start p-4"
                      onClick={() => onSlotSelect(slot)}
                      disabled={slot.available_spots === 0}
                    >
                      <span className="font-bold text-lg">{slot.time_slot}</span>
                      <span className="text-xs sm:text-sm">
                        {slot.available_spots > 0 
                          ? `${slot.available_spots} spots left`
                          : 'Fully Booked'}
                      </span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
