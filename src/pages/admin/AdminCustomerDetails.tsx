/**
 * Admin Customer Details Page
 * View comprehensive customer information including usage stats and API keys
 */

import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeftIcon,
  UserIcon,
  KeyIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'
import { adminApi } from '../../services/admin.service'
import type { CustomerDetails } from '../../types/admin.types'

const AdminCustomerDetails: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState<CustomerDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (customerId) {
      loadCustomerDetails()
    }
  }, [customerId])

  const loadCustomerDetails = async () => {
    if (!customerId) return
    
    console.log('Loading customer details for ID:', customerId)
    setLoading(true)
    setError(null)
    
    try {
      const response = await adminApi.customers.getCustomer(customerId)
      console.log('API Response:', response)
      
      if (response.success) {
        console.log('Setting customer data:', response.data.customer)
        setCustomer(response.data.customer)
      } else {
        const errorMsg = (response as any).error?.message || 'Failed to load customer'
        console.error('API Error:', errorMsg)
        setError(errorMsg)
      }
    } catch (err) {
      console.error('Exception:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      console.log('Setting loading to false')
      setLoading(false)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  console.log('Render - loading:', loading, 'customer:', !!customer, 'error:', error)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-sm text-gray-500">Loading customer details...</p>
      </div>
    )
  }

  if (error || !customer) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Customer not found</p>
        {error && <p className="text-red-500 text-sm mt-2">Error: {error}</p>}
        <p className="text-xs text-gray-400 mt-2">Customer ID: {customerId}</p>
        <Link to="/admin/customers" className="text-blue-600 hover:text-blue-700 mt-4 block">
          Back to Customers
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/customers')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customer Details</h1>
            <p className="mt-1 text-sm text-gray-500">
              Comprehensive information about this customer
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={loadCustomerDetails}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <ArrowPathIcon className="h-5 w-5 text-blue-600" />
          </button>
          
          <Link
            to={`/admin/customers/${customerId}/keys`}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <KeyIcon className="h-5 w-5 mr-2" />
            View API Keys
          </Link>
        </div>
      </div>

      {/* Customer Info Card */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {customer.company?.charAt(0) || customer.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {customer.company || 'No Company Name'}
              </h2>
              <p className="text-sm text-gray-500">{customer.email}</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-5">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Customer ID</dt>
              <dd className="mt-1 text-sm text-gray-900 font-mono">{customer.id}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{customer.email}</dd>
            </div>

            {customer.phone && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 text-sm text-gray-900">{customer.phone}</dd>
              </div>
            )}

            {customer.company && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Company</dt>
                <dd className="mt-1 text-sm text-gray-900">{customer.company}</dd>
              </div>
            )}

            <div>
              <dt className="text-sm font-medium text-gray-500">Plan</dt>
              <dd className="mt-1">
                <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                  {customer.plan}
                </span>
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Account Status</dt>
              <dd className="mt-1 space-y-2">
                <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${
                  customer.verificationStatus === 'verified' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                } capitalize`}>
                  {customer.verificationStatus === 'verified' ? (
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                  ) : (
                    <XCircleIcon className="h-4 w-4 mr-1" />
                  )}
                  {customer.verificationStatus === 'verified' ? 'Active' : 'Inactive'}
                </span>
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Verification Status</dt>
              <dd className="mt-1">
                <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${
                  customer.verificationStatus === 'verified'
                    ? 'bg-green-100 text-green-800'
                    : customer.verificationStatus === 'admin_review'
                    ? 'bg-purple-100 text-purple-800'
                    : customer.verificationStatus === 'cac_pending'
                    ? 'bg-blue-100 text-blue-800'
                    : customer.verificationStatus === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-orange-100 text-orange-800'
                }`}>
                  {customer.verificationStatus === 'verified' ? (
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                  ) : (
                    <XCircleIcon className="h-4 w-4 mr-1" />
                  )}
                  {customer.verificationStatus === 'verified' && 'Verified'}
                  {customer.verificationStatus === 'admin_review' && 'Under Review'}
                  {customer.verificationStatus === 'cac_pending' && 'CAC Pending'}
                  {customer.verificationStatus === 'rejected' && 'Rejected'}
                  {(!customer.verificationStatus || customer.verificationStatus === 'inactive') && 'Not Verified'}
                </span>
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Member Since</dt>
              <dd className="mt-1 text-sm text-gray-900 flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1 text-gray-400" />
                {formatDate(customer.createdAt)}
              </dd>
            </div>

            {customer.lastLoginAt && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Login</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatDate(customer.lastLoginAt)}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Usage Statistics */}
      {customer.usage && (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Usage Statistics</h3>
          </div>
          <div className="px-6 py-5">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Total API Calls</dt>
                <dd className="mt-1 text-2xl font-semibold text-gray-900">
                  {customer.usage.totalCalls?.toLocaleString() || 0}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Successful Calls</dt>
                <dd className="mt-1 text-2xl font-semibold text-green-600">
                  {customer.usage.successfulCalls?.toLocaleString() || 0}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Failed Calls</dt>
                <dd className="mt-1 text-2xl font-semibold text-red-600">
                  {customer.usage.failedCalls?.toLocaleString() || 0}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Success Rate</dt>
                <dd className="mt-1 text-2xl font-semibold text-gray-900">
                  {((customer.usage.successRate || 0) * 100).toFixed(1)}%
                </dd>
              </div>
              {customer.usage.lastCallAt && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Last API Call</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatDate(customer.usage.lastCallAt)}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      )}

      {/* API Keys Summary */}
      {customer.apiKeys && (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">API Keys</h3>
            <Link
              to={`/admin/customers/${customerId}/keys`}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View All Keys →
            </Link>
          </div>
          <div className="px-6 py-5">
            <div className="flex items-center space-x-6">
              <div>
                <p className="text-sm text-gray-500">Total Keys</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {customer.apiKeys.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Keys</p>
                <p className="text-2xl font-semibold text-green-600">
                  {customer.apiKeys.filter(k => k.status === 'active').length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Revoked Keys</p>
                <p className="text-2xl font-semibold text-red-600">
                  {customer.apiKeys.filter(k => k.status === 'revoked').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminCustomerDetails
