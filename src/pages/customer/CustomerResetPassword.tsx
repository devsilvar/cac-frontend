import React, { useState } from 'react'
import SiteLayout from '../../layouts/SiteLayout'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

const CustomerResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') || ''
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!token) {
      setError('Reset token is missing or invalid')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || ''
      const baseUrl = apiBase ? apiBase.replace(/\/$/, '') : ''
      const res = await fetch(`${baseUrl}/api/v1/customer/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      })
      const data = await res.json().catch(() => null)
      if (!res.ok || data?.success === false) {
        throw new Error(data?.error?.message || data?.message || 'Failed to reset password')
      }
      setSuccess('Password updated successfully. You can now log in.')
      setTimeout(() => navigate('/customer/login'), 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SiteLayout>
      <div className="max-w-md mx-auto py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Reset Password</h1>
        <p className="text-gray-600 mb-6">Enter a new password for your account.</p>

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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Updating...' : 'Reset Password'}
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

export default CustomerResetPassword
