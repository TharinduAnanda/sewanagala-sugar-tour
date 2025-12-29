"use client";

import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Calendar as CalendarIcon, MapPin, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface CalendarEvent {
  id: string
  title: string
  start: string
  end?: string
  allDay?: boolean
  backgroundColor?: string
  borderColor?: string
  extendedProps?: any
}

export default function GoogleCalendarDisplay() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return (
      <Card className="shadow-lg">
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Loading calendar events...</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Card */}
      <Card className="border-none shadow-lg bg-gradient-to-br from-primary/5 to-background">
        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <CalendarIcon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Factory Calendar</h2>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                View tour schedules, factory closures, and public holidays
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Calendar Display */}
      <Card className="shadow-lg overflow-hidden">
        <div className="p-4 sm:p-6 bg-card">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            height="auto"
            eventClick={(info) => {
              const props = info.event.extendedProps
              let message = `${info.event.title}\n`
              if (props.type === 'booking') {
                message += `\nStatus: ${props.status}\nVisitors: ${props.visitors}`
              }
              alert(message)
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Confirmed Bookings */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                <div className="w-4 h-4 rounded-full bg-primary ring-2 ring-primary/30"></div>
                <div>
                  <p className="text-sm font-medium">Tour Bookings</p>
                  <p className="text-xs text-muted-foreground">Confirmed tours</p>
                </div>
              </div>
              
              {/* Pending Bookings */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-50 border border-orange-200 dark:bg-orange-950 dark:border-orange-800">
                <div className="w-4 h-4 rounded-full bg-orange-500 ring-2 ring-orange-300"></div>
                <div>
                  <p className="text-sm font-medium">Pending Tours</p>
                  <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
                </div>
              </div>
              
              {/* Public Holidays */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                <div className="w-4 h-4 rounded-full bg-destructive ring-2 ring-destructive/30"></div>
                <div>
                  <p className="text-sm font-medium">Public Holidays</p>
                  <p className="text-xs text-muted-foreground">???? Sri Lankan holidays</p>
                </div>
              </div>
              
              {/* Factory Closures */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-300 dark:bg-red-950 dark:border-red-800">
                <div className="w-4 h-4 rounded-full bg-red-600 ring-2 ring-red-400"></div>
                <div>
                  <p className="text-sm font-medium">Factory Closed</p>
                  <p className="text-xs text-muted-foreground">?? Maintenance/Closures</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}