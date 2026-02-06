import React, { useMemo, useState } from 'react'
import SiteLayout from '../../layouts/SiteLayout'
import { useCustomerAuth } from '../../context/CustomerAuthContext'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { EyeIcon, EyeSlashIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'

const CustomerLogin: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})

  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, [])

  const validate = () => {
    const nextErrors: { email?: string; password?: string } = {}

    const trimmedEmail = email.trim()
    if (!trimmedEmail) nextErrors.email = 'Email is required'
    else if (!emailRegex.test(trimmedEmail)) nextErrors.email = 'Enter a valid email address'

    if (!password) nextErrors.password = 'Password is required'
    else if (password.length < 8) nextErrors.password = 'Password must be at least 8 characters'

    setFieldErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }
  const { login } = useCustomerAuth()
  const navigate = useNavigate()
  const location = useLocation() as any
  const from = location.state?.from || '/customer/dashboard'
  const showSignupNotice = new URLSearchParams(location.search).get('signup') === '1'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validate()) return

    setLoading(true)

    try {
      const result = await login(email.trim(), password)
      if (!result.ok) throw new Error(result.message || 'Invalid credentials')
      navigate(from, { replace: true })
    } catch (err) {
      // Show backend error message if provided
      setError(err instanceof Error ? err.message : 'Login failed. Please check your email and password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SiteLayout>
      <div className="max-w-md mx-auto py-16">
        {/* WallX Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src="/logo-wallx.png" 
            alt="WallX Logo" 
            className="h-16 w-auto"
          />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Customer Login</h1>
        <p className="text-gray-600 mb-6 text-center">Log in to your customer dashboard</p>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          {showSignupNotice && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              Account created. Please log in.
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start">
              <ExclamationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }))
              }}
              onBlur={validate}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                fieldErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="you@example.com"
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? 'email-error' : undefined}
              required
            />
            {fieldErrors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-600">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }))
                }}
                onBlur={validate}
                className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  fieldErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="••••••••"
                aria-invalid={!!fieldErrors.password}
                aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p id="password-error" className="mt-1 text-sm text-red-600">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <button type="submit" disabled={loading} className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 font-medium">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <Link to="/customer/forgot-password" className="text-primary-600 hover:text-primary-700 font-medium">
              Forgot password?
            </Link>
            <span>
              Don’t have an account?{' '}
              <Link to="/customer/signup" className="text-primary-600 hover:text-primary-700 font-medium">
                Create one
              </Link>
            </span>
          </div>
        </form>
      </div>
    </SiteLayout>
  )
}

export default CustomerLogin