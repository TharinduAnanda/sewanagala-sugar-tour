'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { GiSugarCane } from 'react-icons/gi'
import { cn } from '@/lib/utils'

interface AdminLayoutProps {
  children: ReactNode
  title: string
  description?: string
  adminEmail?: string
  onLogout?: () => void
  hideHero?: boolean
}

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/bookings', label: 'Bookings' },
  { href: '/admin/calendar', label: 'Calendar' },
  { href: '/admin/stations', label: 'Stations' },
  { href: '/admin/reports', label: 'Reports' },
  { href: '/admin/slots', label: 'Slots' },
]

export default function AdminLayout({ 
  children, 
  title, 
  description,
  adminEmail,
  onLogout,
  hideHero = false
}: AdminLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background">
      {/* Header - matching homepage style */}
      <motion.header 
        className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/admin/dashboard" className="flex items-center space-x-2">
            <GiSugarCane className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Admin Dashboard</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {adminEmail && (
              <span className="text-sm text-muted-foreground hidden md:block">{adminEmail}</span>
            )}
            {onLogout && (
              <Button onClick={onLogout} variant="outline" size="sm">
                Logout
              </Button>
            )}
          </div>
        </div>
      </motion.header>

      {/* Hero Section with gradient - conditionally shown */}
      {!hideHero && (
        <section className="relative bg-gradient-to-br from-green-900/90 to-yellow-900/90 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/hero.jpg')] bg-cover bg-center opacity-20"></div>
          
          <div className="container relative mx-auto px-4 py-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-3xl md:text-5xl font-bold mb-2">
                {title}
              </h1>
              {description && (
                <p className="text-lg md:text-xl opacity-90 max-w-2xl">
                  {description}
                </p>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  )
}
