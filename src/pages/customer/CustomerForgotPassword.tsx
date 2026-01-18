import React, { useState } from 'react'
import SiteLayout from '../../layouts/SiteLayout'
import { Link } from 'react-router-dom'
import { ExclamationCircleIcon, CheckCircleIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline'

const CustomerForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [resetLink, setResetLink] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setResetLink('')

    if (!email.trim()) {
      setError('Email is required')
      return
    }

    setLoading(true)
    try {
      const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || ''
      const baseUrl = apiBase ? apiBase.replace(/\/$/, '') : ''
      const res = await fetch(`${baseUrl}/api/v1/customer/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      })
      const data = await res.json().catch(() => null)
      if (!res.ok || data?.success === false) {
        throw new Error(data?.error?.message || data?.message || 'Failed to request password reset')
      }
      
      // Check if backend returned a resetLink (dev mode - email not configured)
      if (data?.data?.resetLink) {
        // Convert backend URL to frontend URL (replace backend base with frontend base)
        const backendLink = data.data.resetLink
        // Extract the token from the backend link
        const tokenMatch = backendLink.match(/[?&]token=([^&]+)/)
        const token = tokenMatch ? tokenMatch[1] : ''
        // Build frontend reset URL
        const frontendResetLink = token ? `${window.location.origin}/customer/reset-password?token=${token}` : backendLink
        setResetLink(frontendResetLink)
        setSuccess('Reset link generated! Click the link below to reset your password.')
      } else {
        setSuccess('If this email exists in our system, a password reset link will be sent.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to request password reset')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SiteLayout>
      <div className="max-w-md mx-auto py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Forgot Password</h1>
        <p className="text-gray-600 mb-6">Enter your email to receive a password reset link.</p>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start">
              <ExclamationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-start">
              <CheckCircleIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              {success}
            </div>
          )}

          {/* DEV MODE: Display reset link when email is not configured */}
          {resetLink && (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm">
              <p className="font-medium mb-2">🔧 Dev Mode - Reset Link:</p>
              <div className="flex items-center gap-2">
                <a 
                  href={resetLink} 
                  className="text-blue-600 hover:text-blue-800 underline break-all flex-1"
                >
                  {resetLink}
                </a>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(resetLink)
                    alert('Link copied to clipboard!')
                  }}
                  className="p-1 hover:bg-blue-100 rounded"
                  title="Copy link"
                >
                  <ClipboardDocumentIcon className="h-5 w-5" />
                </button>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                (This link is shown because email is not configured. In production, it will be sent via email.)
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300"
              placeholder="you@example.com"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>

          <div className="text-center text-sm text-gray-600">
            <Link to="/customer/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </SiteLayout>
  )
}

export default CustomerForgotPassword
