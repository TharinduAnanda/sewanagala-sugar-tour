'use client'

import { useEffect, useState } from 'react'
import { Calendar as CalendarIcon, MapPin, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import dynamic from 'next/dynamic'

const FullCalendar = dynamic(() => import('@fullcalendar/react'), { ssr: false })

interface CalendarEvent {
  id: string
  title: string
  start: string
  end?: string
  allDay?: boolean
  backgroundColor?: string
  borderColor?: string
}

export default function SimpleCalendarDisplay() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [plugins, setPlugins] = useState<any[]>([])

  useEffect(() => {
    // Load plugins dynamically
    const loadPlugins = async () => {
      const dayGrid = (await import('@fullcalendar/daygrid')).default
      const timeGrid = (await import('@fullcalendar/timegrid')).default
      const interaction = (await import('@fullcalendar/interaction')).default
      setPlugins([dayGrid, timeGrid, interaction])
    }
    loadPlugins()
  }, [])

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/calendar-events')
      const data = await response.json()
      
      if (data.success) {
        setEvents(data.events)
      }
    } catch (error) {
      console.error('Error loading events:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || plugins.length === 0) {
    return (
      <Card className="shadow-lg">
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Loading calendar...</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Card */}
      <Card className="border-none shadow-lg bg-gradient-to-br from-primary/5 to-background">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <CalendarIcon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Factory Calendar</h2>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">
                  View tour schedules and Sri Lankan public holidays
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Calendar Display */}
      <Card className="shadow-lg overflow-hidden">
        <div className="p-4 sm:p-6 bg-card">
          <FullCalendar
            plugins={plugins}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            events={events}
            height="auto"
            eventClick={(info) => {
              alert(`Event: ${info.event.title}`)
            }}
            editable={false}
            selectable={true}
            eventClassNames="cursor-pointer"
            dayCellClassNames="hover:bg-muted/50 transition-colors"
          />
        </div>
      </Card>

      {/* Legend Card */}
      {events.length > 0 && (
        <Card className="shadow-lg">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Event Legend
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                <div className="w-4 h-4 rounded-full bg-primary ring-2 ring-primary/30"></div>
                <div>
                  <p className="text-sm font-medium">Tour Events</p>
                  <p className="text-xs text-muted-foreground">Your calendar bookings</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                <div className="w-4 h-4 rounded-full bg-destructive ring-2 ring-destructive/30"></div>
                <div>
                  <p className="text-sm font-medium">Public Holidays</p>
                  <p className="text-xs text-muted-foreground">???? Sri Lankan holidays</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}