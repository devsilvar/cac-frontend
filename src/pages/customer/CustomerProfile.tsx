import React, { useEffect, useMemo, useState } from 'react'
import CustomerDashboardLayout from '../../layouts/CustomerDashboardLayout'
import { useCustomerAuth } from '../../context/CustomerAuthContext'
import { User, Mail, Building, CreditCard, AlertCircle, BarChart3, Pencil, Save, X, Phone, CheckCircle } from 'lucide-react'

const CustomerProfile: React.FC = () => {
  const { customer, loadMe, updateProfile, loading } = useCustomerAuth()
  useEffect(() => {
    loadMe()
  }, [])

  const [isEditing, setIsEditing] = useState(false)
  const [company, setCompany] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!customer) return
    setCompany(customer.company || '')
    setPhoneNumber(customer.phoneNumber || '')
  }, [customer])

  const validate = () => {
    const c = company.trim()
    if (c && c.length < 2) return 'Company name must be at least 2 characters'
    if (c && c.length > 120) return 'Company name must be 120 characters or less'

    const p = phoneNumber.trim().replace(/\s+/g, '')
    if (p) {
      const phonePattern = /^(\+234|0)?[789]\d{9}$/
      if (!phonePattern.test(p)) {
        return 'Please provide a valid Nigerian phone number (e.g., 08012345678 or +2348012345678)'
      }
    }

    return null
  }

  const planStyles = useMemo(() => {
    switch (customer?.plan) {
      case 'enterprise':
        return 'bg-purple-100 text-purple-700'
      case 'pro':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-green-100 text-green-700'
    }
  }, [customer?.plan])

  const statusStyles = useMemo(() => {
    const verificationStatus = customer?.verificationStatus || 'inactive'
    
    switch (verificationStatus) {
      case 'verified':
        return 'bg-green-100 text-green-700'
      case 'admin_review':
        return 'bg-purple-100 text-purple-700'
      case 'cac_pending':
        return 'bg-blue-100 text-blue-700'
      case 'rejected':
        return 'bg-red-100 text-red-700'
      case 'inactive':
      default:
        return 'bg-orange-100 text-orange-700'
    }
  }, [customer?.verificationStatus])

  const onSave = async () => {
    setFormError(null)
    setFormSuccess(null)

    const err = validate()
    if (err) {
      setFormError(err)
      return
    }

    const result = await updateProfile({
      company: company.trim() || undefined,
      phoneNumber: phoneNumber.trim() || undefined,
    })

    if (!result.ok) {
      setFormError(result.message || 'Failed to update profile')
      return
    }

    setFormSuccess('Profile updated successfully')
    setIsEditing(false)
    setTimeout(() => setFormSuccess(null), 2500)
  }

  const onCancel = () => {
    setFormError(null)
    setFormSuccess(null)
    setIsEditing(false)
    setCompany(customer?.company || '')
    setPhoneNumber(customer?.phoneNumber || '')
  }

  return (
    <CustomerDashboardLayout>
      <div className="max-w-4xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          <div className="px-6 pb-6">
            <div className="flex items-end gap-4 -mt-12">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl border-4 border-white flex items-center justify-center shadow-lg">
                <span className="text-white text-3xl font-bold">
                  {customer?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="mb-2 flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{customer?.company || 'User'}</h2>
                <p className="text-gray-600">{customer?.email}</p>
              </div>
              <div className={`mb-2 px-4 py-2 rounded-lg text-sm font-semibold capitalize ${statusStyles}`}>
                {customer?.verificationStatus === 'verified' && 'Verified'}
                {customer?.verificationStatus === 'admin_review' && 'Under Review'}
                {customer?.verificationStatus === 'cac_pending' && 'CAC Pending'}
                {customer?.verificationStatus === 'rejected' && 'Rejected'}
                {customer?.verificationStatus === 'inactive' && 'Not Verified'}
                {!customer?.verificationStatus && 'Not Verified'}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Alerts */}
        {formError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-900">{formError}</div>
          </div>
        )}

        {formSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-green-900">{formSuccess}</div>
          </div>
        )}

        {/* Account Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-gray-600" />
              Account Details
            </h3>

            {!isEditing ? (
              <button
                onClick={() => {
                  setIsEditing(true)
                  setFormError(null)
                  setFormSuccess(null)
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onCancel}
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  disabled={loading}
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={onSave}
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
                  disabled={loading}
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email Address</label>
              <div className="mt-2 flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900 font-medium">{customer?.email || '—'}</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Company Name</label>
              <div className="mt-2 flex items-center gap-3">
                <Building className="w-5 h-5 text-gray-400" />
                {!isEditing ? (
                  <span className="text-gray-900 font-medium">{customer?.company || '—'}</span>
                ) : (
                  <input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your company name"
                  />
                )}
              </div>
              {isEditing && (
                <p className="text-xs text-gray-500 mt-1 ml-8">Optional. 2–120 characters.</p>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</label>
              <div className="mt-2 flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                {!isEditing ? (
                  <span className="text-gray-900 font-medium">{customer?.phoneNumber || '—'}</span>
                ) : (
                  <input
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="08012345678"
                  />
                )}
              </div>
              {isEditing && (
                <p className="text-xs text-gray-500 mt-1 ml-8">Optional. Nigerian format preferred.</p>
              )}
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Current Plan</label>
              <div className="mt-2 flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <span className={`px-3 py-1 rounded-lg font-semibold capitalize text-sm ${planStyles}`}>
                  {customer?.plan || 'Basic'}
                </span>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Customer ID</label>
              <div className="mt-2">
                <code className="text-sm bg-gray-100 px-3 py-2 rounded font-mono text-gray-900">
                  {customer?.id || '—'}
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Plan Information */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Subscription Plan
              </h3>
              <p className="text-sm text-gray-600 mt-1">You're currently on the <span className="font-semibold capitalize">{customer?.plan || 'Basic'}</span> plan</p>
            </div>
            <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
              Upgrade Plan
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">5,000</div>
              <div className="text-sm text-gray-600">Requests / month</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">10</div>
              <div className="text-sm text-gray-600">API Keys allowed</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">24/7</div>
              <div className="text-sm text-gray-600">Support access</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <a 
              href="/customer/api-keys" 
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all group"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 group-hover:text-blue-600">Manage API Keys</div>
                <div className="text-xs text-gray-600">Create and revoke keys</div>
              </div>
            </a>
            <a 
              href="/customer/usage" 
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all group"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 group-hover:text-purple-600">View Usage Stats</div>
                <div className="text-xs text-gray-600">Monitor your consumption</div>
              </div>
            </a>
            <a 
              href="/docs" 
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all group"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 group-hover:text-green-600">API Documentation</div>
                <div className="text-xs text-gray-600">Learn how to integrate</div>
              </div>
            </a>
            <button 
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all group"
            >
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-900 group-hover:text-orange-600">Contact Support</div>
                <div className="text-xs text-gray-600">Get help from our team</div>
              </div>
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-900">
            <p className="font-medium mb-1">Keep your account secure</p>
            <p>Never share your API keys or account credentials. If you suspect unauthorized access, revoke your keys immediately and contact support.</p>
          </div>
        </div>
      </div>
    </CustomerDashboardLayout>
  )
}

export default CustomerProfile
