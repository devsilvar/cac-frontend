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
  const [company, setCompany] = useState('')
  const [plan, setPlan] = useState<'basic'|'pro'>('basic')
  const [fullName, setFullName] = useState('')
  const [ninBvn, setNinBvn] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [idDocument, setIdDocument] = useState<string>('')
  const [idDocumentName, setIdDocumentName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [currentStep, setCurrentStep] = useState(1)

  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, [])

  const validateStep1 = () => {
    const next: Record<string, string> = {}
    const trimmedEmail = email.trim()
    if (!trimmedEmail) next.email = 'Email is required'
    else if (!emailRegex.test(trimmedEmail)) next.email = 'Enter a valid email address'

    if (!password) next.password = 'Password is required'
    else if (password.length < 8) next.password = 'Password must be at least 8 characters'
    else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      next.password = 'Password should include letters and numbers'
    }

    setFieldErrors(next)
    return Object.keys(next).length === 0
  }

  const validateStep2 = () => {
    const next: Record<string, string> = {}

    const name = fullName.trim()
    if (!name) next.fullName = 'Full name is required'
    else if (name.split(/\s+/).length < 2) next.fullName = 'Enter first and last name'

    const id = ninBvn.trim()
    if (!id) next.ninBvn = 'NIN or BVN is required'
    else if (!/^\d{10,11}$/.test(id)) next.ninBvn = 'NIN is 11 digits or BVN is 10 digits'

    const phone = phoneNumber.trim()
    if (!phone) next.phoneNumber = 'Phone number is required'
    else if (!/^(\+234|0)\d{10}$/.test(phone.replace(/\s+/g, ''))) {
      next.phoneNumber = 'Enter a valid Nigerian phone number'
    }

    if (!idDocument) next.idDocument = 'Please upload a valid ID document'

    setFieldErrors(next)
    return Object.keys(next).length === 0
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type (only images and PDFs)
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf']
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image (JPEG, PNG, GIF) or PDF file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    setIdDocumentName(file.name)
    setError('')

    // Convert to base64
    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      // Remove data URL prefix to get pure base64
      const base64Data = base64.split(',')[1]
      setIdDocument(base64Data)
    }
    reader.onerror = () => {
      setError('Failed to read file. Please try again.')
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (currentStep === 1) {
      if (!validateStep1()) return
      setCurrentStep(2)
      return
    }

    if (!validateStep2()) return

    setLoading(true)
    const result = await signup({
      email: email.trim(),
      password,
      company: company.trim() || undefined,
      plan: (plan || undefined) as any,
      full_name: fullName.trim(),
      nin_bvn: ninBvn.trim(),
      phone_number: phoneNumber.trim(),
      id_document: idDocument,
    })
    setLoading(false)

    if (result.ok) {
      navigate('/customer/login?signup=1')
    } else {
      // Show backend error message if provided
      setError(result.message || 'Signup failed. Please check your inputs and try again.')
    }
  }

  const goBack = () => {
    setCurrentStep(1)
    setError('')
  }

  return (
    <SiteLayout>
      <div className="max-w-2xl mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
        <p className="text-gray-600 mb-8">Complete registration to access our business services</p>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                1
              </div>
              <div className={`w-24 h-1 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                2
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-2 px-4">
            <span className="text-xs text-gray-600">Account Info</span>
            <span className="text-xs text-gray-600">Verification</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start">
              <ExclamationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Information</h2>
              
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
                  onBlur={() => {
                    if (currentStep === 1) validateStep1()
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
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
                    onBlur={() => {
                      if (currentStep === 1) validateStep1()
                    }}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Plan <span className="text-gray-400">(optional)</span></label>
                <select 
                  value={plan} 
                  onChange={(e) => setPlan(e.target.value as any)} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                >
                  <option value="">Select a plan</option>
                  <option value="basic">Basic - 1,000 requests/month</option>
                  <option value="pro">Pro - 5,000 requests/month</option>
                </select>
                <p className="text-xs text-gray-500 mt-1.5">You can upgrade your plan anytime after signup</p>
              </div>

              <button 
                type="submit" 
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Continue to Verification →
              </button>
            </div>
          )}

          {/* Step 2: Verification Information */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Verification Information</h2>
              <p className="text-sm text-gray-600 mb-4">We need to verify your identity to comply with regulations</p>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
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
                  onBlur={() => {
                    if (currentStep === 2) validateStep2()
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    fieldErrors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`} 
                  placeholder="John Doe" 
                  required 
                />
                {fieldErrors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.fullName}</p>
                )}
                <p className="text-xs text-gray-500 mt-1.5">Enter your first and last name (separated by space)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NIN or BVN <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={ninBvn} 
                  onChange={(e) => {
                    setNinBvn(e.target.value)
                    if (fieldErrors.ninBvn) setFieldErrors((p) => {
                      const { ninBvn: _n, ...rest } = p
                      return rest
                    })
                  }} 
                  onBlur={() => {
                    if (currentStep === 2) validateStep2()
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    fieldErrors.ninBvn ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`} 
                  placeholder="12345678901" 
                  required 
                  maxLength={11}
                />
                {fieldErrors.ninBvn && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.ninBvn}</p>
                )}
                <p className="text-xs text-gray-500 mt-1.5">NIN (11 digits) or BVN (10 digits)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input 
                  type="tel" 
                  value={phoneNumber} 
                  onChange={(e) => {
                    setPhoneNumber(e.target.value)
                    if (fieldErrors.phoneNumber) setFieldErrors((p) => {
                      const { phoneNumber: _ph, ...rest } = p
                      return rest
                    })
                  }} 
                  onBlur={() => {
                    if (currentStep === 2) validateStep2()
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    fieldErrors.phoneNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`} 
                  placeholder="08012345678 or +2348012345678" 
                  required 
                />
                {fieldErrors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.phoneNumber}</p>
                )}
                <p className="text-xs text-gray-500 mt-1.5">Nigerian phone number preferred</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Valid ID <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input 
                    type="file" 
                    onChange={(e) => {
                      handleFileUpload(e)
                      if (fieldErrors.idDocument) setFieldErrors((p) => {
                        const { idDocument: _id, ...rest } = p
                        return rest
                      })
                    }} 
                    accept="image/*,.pdf"
                    className="hidden"
                    id="id-upload"
                    required={!idDocument}
                  />
                  {fieldErrors.idDocument && (
                    <p className="mt-2 text-sm text-red-600">{fieldErrors.idDocument}</p>
                  )}
                  <label 
                    htmlFor="id-upload" 
                    className="flex flex-col items-center justify-center w-full h-32 px-4 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    {idDocumentName ? (
                      <div className="flex flex-col items-center">
                        <svg className="w-8 h-8 text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="text-sm text-gray-700 font-medium">{idDocumentName}</p>
                        <p className="text-xs text-gray-500 mt-1">Click to change</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500 mt-1">International Passport, NIN Slip, Driver's License, or Voter's Card</p>
                      </div>
                    )}
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1.5">Max file size: 5MB. Accepted formats: JPEG, PNG, GIF, PDF</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={goBack}
                  className="w-1/3 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  ← Back
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-2/3 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
            </div>
          )}

          <div className="text-center text-sm text-gray-600 pt-4 border-t border-gray-100">
            Already have an account? <Link to="/customer/login" className="text-blue-600 hover:text-blue-700 font-medium">Sign in</Link>
          </div>
        </form>
      </div>
    </SiteLayout>
  )
}

export default CustomerSignup
