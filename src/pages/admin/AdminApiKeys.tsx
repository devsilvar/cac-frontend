/**
 * Admin API Keys Management Page
 * View and manage all customer API keys
 */

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  KeyIcon,
  MagnifyingGlassIcon,
  NoSymbolIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline'
import { adminApi } from '../../services/admin.service'
import type { ApiKeyWithCustomer } from '../../types/admin.types'

const AdminApiKeys: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeyWithCustomer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'revoked'>('all')
  const [selectedKey, setSelectedKey] = useState<ApiKeyWithCustomer | null>(null)
  const [showRevokeModal, setShowRevokeModal] = useState(false)

  useEffect(() => {
    loadApiKeys()
  }, [filterStatus])

  const loadApiKeys = async () => {
    setLoading(true)
    try {
      const filters: any = {}
      if (filterStatus !== 'all') filters.status = filterStatus
      
      const response = await adminApi.apiKeys.getAllApiKeys(filters)
      if (response.success) {
        setApiKeys(response.data.apiKeys || [])
      }
    } catch (error) {
      console.error('Failed to load API keys:', error)
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

  const filteredKeys = apiKeys.filter(key =>
    key.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (key.customer.company?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    key.keyPrefix.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    total: apiKeys.length,
    active: apiKeys.filter(k => k.status === 'active').length,
    revoked: apiKeys.filter(k => k.status === 'revoked').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">API Keys Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor and manage all customer API keys
          </p>
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

      {/* Filters */}
      <div className="bg-white shadow-sm rounded-lg p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer, email, or key prefix..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="revoked">Revoked</option>
            </select>
          </div>
        </div>
      </div>

      {/* API Keys Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Key
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
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
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : filteredKeys.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <KeyIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No API keys found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchTerm ? 'Try adjusting your search' : 'No API keys have been created yet'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredKeys.map((apiKey) => (
                  <ApiKeyRow
                    key={apiKey.id}
                    apiKey={apiKey}
                    onRevoke={(key) => {
                      setSelectedKey(key)
                      setShowRevokeModal(true)
                    }}
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
                        Revoking this API key will immediately stop all API access for this customer.
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
                    <div>
                      <dt className="text-xs font-medium text-gray-500">Customer</dt>
                      <dd className="text-sm text-gray-900">
                        {selectedKey.customer.company || selectedKey.customer.email}
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
  apiKey: ApiKeyWithCustomer
  onRevoke: (apiKey: ApiKeyWithCustomer) => void
}> = ({ apiKey, onRevoke }) => {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    revoked: 'bg-red-100 text-red-800',
  }
  
  const formatDate = (date?: string) => {
    if (!date) return 'Never'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
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
        {apiKey.name && (
          <div className="text-xs text-gray-500 mt-1">{apiKey.name}</div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="text-sm font-medium text-gray-900">
            {apiKey.customer.company || 'N/A'}
          </div>
          <div className="text-sm text-gray-500">{apiKey.customer.email}</div>
        </div>
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

export default AdminApiKeys
