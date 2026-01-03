/**
 * Admin Customer API Keys Page
 * View all API keys for a specific customer
 */

import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  KeyIcon,
  ArrowLeftIcon,
  NoSymbolIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { adminApi } from '../../services/admin.service'
import type { ApiKey, CustomerDetails } from '../../types/admin.types'

const AdminCustomerKeys: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState<CustomerDetails | null>(null)
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null)
  const [showRevokeModal, setShowRevokeModal] = useState(false)

  useEffect(() => {
    if (customerId) {
      loadCustomerKeys()
    }
  }, [customerId])

  const loadCustomerKeys = async () => {
    if (!customerId) return
    
    setLoading(true)
    try {
      const [customerRes, keysRes] = await Promise.all([
        adminApi.customers.getCustomer(customerId),
        adminApi.customers.getCustomerApiKeys(customerId),
      ])
      
      if (customerRes.success) {
        setCustomer(customerRes.data.customer)
      } else {
        console.error('Failed to load customer:', customerRes)
      }
      
      if (keysRes.success) {
        setApiKeys(keysRes.data.apiKeys || [])
      } else {
        console.error('Failed to load API keys:', keysRes)
      }
    } catch (error) {
      console.error('Failed to load customer keys:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRevokeKey = async () => {
    if (!selectedKey) return
    
    try {
      const response = await adminApi.apiKeys.revokeApiKey(selectedKey.id)
      if (response.success) {
        setApiKeys(apiKeys.map(key => 
          key.id === selectedKey.id ? { ...key, status: 'revoked' as const } : key
        ))
        setShowRevokeModal(false)
        setSelectedKey(null)
      }
    } catch (error) {
      console.error('Failed to revoke API key:', error)
    }
  }

  const formatDate = (date?: string) => {
    if (!date) return 'Never'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const stats = {
    total: apiKeys.length,
    active: apiKeys.filter(k => k.status === 'active').length,
    revoked: apiKeys.filter(k => k.status === 'revoked').length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-sm text-gray-500">Loading API keys...</p>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Customer not found</p>
        <Link to="/admin/customers" className="text-blue-600 hover:text-blue-700 mt-2">
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
            <h1 className="text-2xl font-bold text-gray-900">Customer API Keys</h1>
            <p className="mt-1 text-sm text-gray-500">
              Managing API keys for {customer.company || customer.email}
            </p>
          </div>
        </div>
      </div>

      {/* Customer Info Card */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <UserIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {customer.company || 'No Company Name'}
              </h3>
              <p className="text-sm text-gray-500">{customer.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Plan</p>
              <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                {customer.plan}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Status</p>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                customer.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : customer.status === 'suspended'
                  ? 'bg-orange-100 text-orange-800'
                  : 'bg-gray-100 text-gray-800'
              } capitalize`}>
                {customer.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatsCard 
          label="Total Keys" 
          value={stats.total} 
          icon={KeyIcon}
          color="blue" 
        />
        <StatsCard 
          label="Active Keys" 
          value={stats.active} 
          icon={CheckCircleIcon}
          color="green" 
        />
        <StatsCard 
          label="Revoked Keys" 
          value={stats.revoked} 
          icon={XCircleIcon}
          color="red" 
        />
      </div>

      {/* API Keys Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">API Keys</h3>
          <p className="mt-1 text-sm text-gray-500">
            All API keys generated by this customer
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Key
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Used
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {apiKeys.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <KeyIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No API keys</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      This customer hasn't generated any API keys yet
                    </p>
                  </td>
                </tr>
              ) : (
                apiKeys.map((apiKey) => (
                  <ApiKeyRow
                    key={apiKey.id}
                    apiKey={apiKey}
                    onRevoke={(key) => {
                      setSelectedKey(key)
                      setShowRevokeModal(true)
                    }}
                    formatDate={formatDate}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revoke Confirmation Modal */}
      {showRevokeModal && selectedKey && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowRevokeModal(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Revoke API Key</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex">
                    <NoSymbolIcon className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Warning: This action cannot be undone
                      </h3>
                      <p className="mt-2 text-sm text-red-700">
                        Revoking this API key will immediately stop all API access for this customer using this key.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-xs font-medium text-gray-500">Key Prefix</dt>
                      <dd className="text-sm font-mono text-gray-900">{selectedKey.keyPrefix}...</dd>
                    </div>
                    {selectedKey.name && (
                      <div>
                        <dt className="text-xs font-medium text-gray-500">Name</dt>
                        <dd className="text-sm text-gray-900">{selectedKey.name}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-xs font-medium text-gray-500">Customer</dt>
                      <dd className="text-sm text-gray-900">
                        {customer.company || customer.email}
                      </dd>
                    </div>
                  </dl>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setShowRevokeModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRevokeKey}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                  >
                    Revoke Key
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper Components
const StatsCard: React.FC<{ 
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  color: string 
}> = ({ label, value, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
  }
  
  return (
    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`rounded-lg p-3 ${colorClasses[color as keyof typeof colorClasses]}`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{label}</dt>
              <dd className="text-2xl font-semibold text-gray-900">{value}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}

const ApiKeyRow: React.FC<{
  apiKey: ApiKey
  onRevoke: (apiKey: ApiKey) => void
  formatDate: (date?: string) => string
}> = ({ apiKey, onRevoke, formatDate }) => {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    revoked: 'bg-red-100 text-red-800',
  }
  
  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="hover:bg-gray-50"
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <KeyIcon className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-sm font-mono text-gray-900">{apiKey.keyPrefix}...</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-900">{apiKey.name || '-'}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[apiKey.status]} capitalize`}>
          {apiKey.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center text-sm text-gray-900">
          <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
          {formatDate(apiKey.lastUsedAt)}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(apiKey.createdAt)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        {apiKey.status === 'active' && (
          <button
            onClick={() => onRevoke(apiKey)}
            className="text-red-600 hover:text-red-900 font-medium"
          >
            Revoke
          </button>
        )}
      </td>
    </motion.tr>
  )
}

export default AdminCustomerKeys
