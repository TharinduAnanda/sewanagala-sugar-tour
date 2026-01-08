'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, Sparkles } from 'lucide-react'
import { GiSugarCane } from 'react-icons/gi'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/tour', label: 'Virtual Tour' },
  { href: '/booking', label: 'Book Tour' },
  { href: '/my-bookings', label: 'My Bookings' },
  { href: '/about', label: 'About' },
]

export default function Header() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 cursor-white",
        isScrolled 
          ? "bg-slate-950/80 backdrop-blur-xl border-b border-emerald-500/20 shadow-lg shadow-emerald-500/5" 
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <GiSugarCane className="h-8 w-8 text-amber-400 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
              <div className="absolute inset-0 blur-lg bg-amber-400/20 group-hover:bg-amber-400/40 transition-all duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg md:text-xl bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                Sevanagala Sugar
              </span>
              <span className="text-xs text-emerald-300/70 -mt-1 hidden sm:block">Est. 1986</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                    isActive
                      ? "text-amber-400"
                      : "text-slate-300 hover:text-emerald-300"
                  )}
                >
                  {isActive && (
                    <span className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-lg border border-emerald-500/20" />
                  )}
                  <span className="relative">{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                  )}
                </Link>
              )
            })}
            
            {/* Admin Link with Badge */}
            <Link 
              href="/admin/login" 
              className="ml-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-amber-300 transition-all duration-300 flex items-center gap-1.5 group"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              Admin
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden relative p-2 rounded-lg text-slate-300 hover:text-emerald-300 transition-colors duration-300 hover:bg-emerald-500/10"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-emerald-500/20 bg-slate-950/95 backdrop-blur-xl">
          <nav className="container mx-auto px-4 py-6 flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "relative px-4 py-3 rounded-lg text-base font-medium transition-all duration-300",
                    isActive
                      ? "text-amber-400 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20"
                      : "text-slate-300 hover:text-emerald-300 hover:bg-emerald-500/5"
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
            
            <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent my-2" />
            
            <Link 
              href="/admin/login" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-3 rounded-lg text-base font-medium text-slate-300 hover:text-amber-300 hover:bg-amber-500/5 transition-all duration-300 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              Admin Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}


