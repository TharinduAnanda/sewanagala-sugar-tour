import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { TourProvider } from '@/context/TourContext'

// Force all pages to be dynamic
export const dynamic = 'force-dynamic'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sewanagala Sugar Factory Tour',
  description: 'Experience the journey from farm to factory',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className} suppressHydrationWarning>
        <TourProvider>
          {children}
        </TourProvider>
      </body>
    </html>
  )
}
