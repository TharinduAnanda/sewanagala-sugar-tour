'use client'


import { useState } from 'react'
import { motion } from 'framer-motion'

export default function TestEmailPage() {
  const [email, setEmail] = useState('tharindulalanath49@gmail.com')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const testEmailGET = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      const response = await fetch(`/api/test-email-send?email=${encodeURIComponent(email)}`)
      const data = await response.json()
      setResult(data)
    } catch (error: any) {
      setResult({
        success: false,
        message: 'Network error',
        error: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  const testEmailPOST = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      const response = await fetch('/api/test-email-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email,
          name: 'Test User',
          bookingId: 'TEST-' + Date.now().toString(36).toUpperCase()
        })
      })
      const data = await response.json()
      setResult(data)
    } catch (error: any) {
      setResult({
        success: false,
        message: 'Network error',
        error: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h1 className="text-3xl font-bold text-green-800 mb-2">
            Email Test Panel
          </h1>
          <p className="text-gray-600 mb-8">
            Test the booking confirmation email system
          </p>

          <div className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Test Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                placeholder="Enter email address"
              />
            </div>

            {/* Test Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={testEmailGET}
                disabled={loading || !email}
                className="px-6 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-md"
              >
                {loading ? 'Testing...' : 'Test Email (GET)'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={testEmailPOST}
                disabled={loading || !email}
                className="px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-md"
              >
                {loading ? 'Testing...' : 'Test Email (POST)'}
              </motion.button>
            </div>

            {/* Loading State */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center p-8"
              >
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
              </motion.div>
            )}

            {/* Results */}
            {result && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-xl border-2 ${
                  result.success
                    ? 'bg-green-50 border-green-300'
                    : 'bg-red-50 border-red-300'
                }`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    result.success ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {result.success ? (
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg ${
                      result.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {result.success ? 'Success!' : 'Failed'}
                    </h3>
                    <p className={`text-sm ${
                      result.success ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {result.message}
                    </p>
                  </div>
                </div>

                {/* Details */}
                {result.details && (
                  <div className="bg-white bg-opacity-50 rounded-lg p-4 space-y-2">
                    <h4 className="font-semibold text-gray-800 mb-2">Details:</h4>
                    {Object.entries(result.details).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </span>
                        <span className="text-gray-600 font-mono">
                          {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Error */}
                {result.error && (
                  <div className="mt-4 bg-white bg-opacity-50 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2">Error:</h4>
                    <pre className="text-xs text-red-700 whitespace-pre-wrap font-mono">
                      {result.error}
                    </pre>
                  </div>
                )}

                {/* Instructions */}
                {result.instructions && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> {result.instructions}
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Instructions Panel */}
            <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-3">How to Use:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>Enter the email address where you want to receive the test email</li>
                <li>Click either "Test Email (GET)" or "Test Email (POST)" button</li>
                <li>Wait for the test to complete</li>
                <li>Check your inbox (and spam folder) for the confirmation email</li>
                <li>Review the test results displayed below the buttons</li>
              </ol>
              
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">
                  <strong>Important:</strong> Make sure your .env.local file has the correct EMAIL_USER and EMAIL_APP_PASSWORD configured.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* API Endpoints Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="font-bold text-gray-800 mb-3">API Endpoints:</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded font-mono text-xs">GET</span>
              <code className="text-gray-700">/api/test-email-send?email=your@email.com</code>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded font-mono text-xs">POST</span>
              <code className="text-gray-700">/api/test-email-send</code>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
