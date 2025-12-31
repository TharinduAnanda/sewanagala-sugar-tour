'use client'

export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FaHome, FaExclamationTriangle } from 'react-icons/fa'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white">
      <div className="text-center px-4">
        <FaExclamationTriangle className="w-24 h-24 text-yellow-500 mx-auto mb-6" />
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">Page Not Found</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>
        <Link href="/">
          <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-2 mx-auto">
            <FaHome />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
