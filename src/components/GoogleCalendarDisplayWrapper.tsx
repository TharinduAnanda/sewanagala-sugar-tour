'use client'

import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

// Dynamically import GoogleCalendarDisplay with no SSR
const GoogleCalendarDisplay = dynamic(
  () => import('./GoogleCalendarDisplay'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    ),
  }
)

export default function GoogleCalendarDisplayWrapper() {
  return <GoogleCalendarDisplay />
}
