import React, { useMemo, useState } from 'react'
import SiteLayout from '../../layouts/SiteLayout'
import { useCustomerAuth } from '../../context/CustomerAuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { EyeIcon, EyeSlashIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'

const CustomerSignup: React.FC = () => {
  const { signup } = useCustomerAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [fullName, setFullName] = useState('')
  const [company, setCompany] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, [])

  const validateForm = () => {
    const next: Record<string, string> = {}
    
    // Validate email
    const trimmedEmail = email.trim()
    if (!trimmedEmail) next.email = 'Email is required'
    else if (!emailRegex.test(trimmedEmail)) next.email = 'Enter a valid email address'

    // Validate password
    if (!password) next.password = 'Password is required'
    else if (password.length < 8) next.password = 'Password must be at least 8 characters'
    else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      next.password = 'Password should include letters and numbers'
    }

    // Validate full name
    const trimmedName = fullName.trim()
    if (!trimmedName) next.fullName = 'Full name is required'
    else if (trimmedName.length < 2) next.fullName = 'Name must be at least 2 characters'
    else if (trimmedName.split(/\s+/).length < 2) next.fullName = 'Enter both first and last name'

    setFieldErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) return

    setLoading(true)
    const result = await signup({
      email: email.trim(),
      password,
      full_name: fullName.trim(),
      company: company.trim() || undefined,
    })
    setLoading(false)

    if (result.ok) {
      // Redirect to login with success message
      navigate('/customer/login?signup=1')
    } else {
      // Show backend error message if provided
      setError(result.message || 'Signup failed. Please check your inputs and try again.')
    }
  }

  return (
    <SiteLayout>
      <div className="max-w-md mx-auto py-16 px-4">
        <div className="text-center mb-8">
          {/* WallX Logo */}
          <div className="flex justify-center mb-6">
            <img 
              src="/logo-wallx.png" 
              alt="WallX Logo" 
              className="h-16 w-auto"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
          <p className="text-gray-600">Get started with our business verification services</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start">
              <ExclamationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <div className="space-y-5">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address <span className="text-red-500">*</span></label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (fieldErrors.email) setFieldErrors((p) => {
                      const { email: _e, ...rest } = p
                      return rest
                    })
                  }} 
                  onBlur={validateForm}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                    fieldErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`} 
                  placeholder="you@example.com" 
                  required 
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={fullName} 
                  onChange={(e) => {
                    setFullName(e.target.value)
                    if (fieldErrors.fullName) setFieldErrors((p) => {
                      const { fullName: _f, ...rest } = p
                      return rest
                    })
                  }} 
                  onBlur={validateForm}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                    fieldErrors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`} 
                  placeholder="John Doe" 
                  required 
                />
                {fieldErrors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.fullName}</p>
                )}
                <p className="text-xs text-gray-500 mt-1.5">Enter your first and last name</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password} 
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (fieldErrors.password) setFieldErrors((p) => {
                        const { password: _p, ...rest } = p
                        return rest
                      })
                    }} 
                    onBlur={validateForm}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      fieldErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`} 
                    placeholder="••••••••" 
                    required 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
                )}
                <p className="text-xs text-gray-500 mt-1.5 flex items-center">
                  <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                  Minimum 8 characters with letters and numbers
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name <span className="text-gray-400">(optional)</span></label>
                <input 
                  type="text" 
                  value={company} 
                  onChange={(e) => setCompany(e.target.value)} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                  placeholder="Acme Corporation" 
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>


          <div className="text-center text-sm text-gray-600 pt-4 border-t border-gray-100">
            Already have an account? <Link to="/customer/login" className="text-primary-600 hover:text-primary-700 font-medium">Sign in</Link>
          </div>
        </form>
      </div>
    </SiteLayout>
  )
}

export default CustomerSignup
