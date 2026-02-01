/**
 * Admin System Management Page
 * Create and manage admin users
 */

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ShieldCheckIcon,
  PlusIcon,
  UserPlusIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline'
import { adminApi } from '../../services/admin.service'
import type { CreateAdminRequest, Admin, UpdateAdminProfileRequest } from '../../types/admin.types'

// Import all available permissions from backend
const AVAILABLE_PERMISSIONS = {
  // Customer Management
  'view_customers': 'View customer list and details',
  'create_customers': 'Create new customer accounts',
  'edit_customers': 'Edit customer information',
  'delete_customers': 'Delete customer accounts',
  'manage_customer_wallet': 'Manage customer wallet balances',
  
  // Admin Management (Super Admin only)
  'view_admins': 'View admin list and details',
  'create_admins': 'Create new admin accounts',
  'edit_admins': 'Edit admin information and permissions',
  'delete_admins': 'Delete admin accounts',
  'manage_admin_permissions': 'Grant/revoke admin permissions',
  
  // Business Operations
  'view_verification_requests': 'View business verification requests',
  'approve_verifications': 'Approve business verifications',
  'reject_verifications': 'Reject business verifications',
  
  // Pricing Management
  'view_pricing': 'View service pricing',
  'edit_pricing': 'Edit service pricing',
  
  // Billing & Wallet
  'view_wallet_transactions': 'View all wallet transactions',
  'process_refunds': 'Process customer refunds',
  
  // System Management
  'view_dashboard': 'View admin dashboard',
  'view_system_metrics': 'View system performance metrics',
  'view_logs': 'View system logs',
  'manage_system_settings': 'Modify system configuration',
  
  // Usage Analytics
  'view_usage_analytics': 'View API usage analytics'
}

const PERMISSION_CATEGORIES = {
  'Customer Management': [
    'view_customers',
    'create_customers', 
    'edit_customers',
    'delete_customers',
    'manage_customer_wallet'
  ],
  'Admin Management': [
    'view_admins',
    'create_admins',
    'edit_admins', 
    'delete_admins',
    'manage_admin_permissions'
  ],
  'Business Operations': [
    'view_verification_requests',
    'approve_verifications',
    'reject_verifications'
  ],
  'Pricing Management': [
    'view_pricing',
    'edit_pricing'
  ],
  'Billing & Wallet': [
    'view_wallet_transactions',
    'process_refunds'
  ],
  'System Management': [
    'view_dashboard',
    'view_system_metrics',
    'view_logs',
    'manage_system_settings'
  ],
  'Usage Analytics': [
    'view_usage_analytics'
  ]
}

const AdminSystem: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [admins, setAdmins] = useState<Admin[]>([])
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  const [newAdmin, setNewAdmin] = useState<CreateAdminRequest>({
    email: '',
    password: '',
    role: 'admin',
    permissions: [],
  })

  const [editAdmin, setEditAdmin] = useState<Partial<Admin>>({
    fullName: '',
    permissions: [],
  })

  const [showPermissionDetails, setShowPermissionDetails] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  // Load admins on component mount
  useEffect(() => {
    loadAdmins()
  }, [])

  const loadAdmins = async () => {
    setLoading(true)
    try {
      const response = await adminApi.system.listAdmins()
      if (response.success && response.data) {
        setAdmins(response.data.admins)
      }
    } catch (error) {
      console.error('Failed to load admins:', error)
      setMessage({ type: 'error', text: 'Failed to load admins' })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    setMessage(null)
    
    try {
      const response = await adminApi.system.createAdmin(newAdmin)
      if (response.success) {
        setMessage({ type: 'success', text: 'Admin created successfully' })
        setShowCreateModal(false)
        setNewAdmin({ email: '', password: '', role: 'admin', permissions: [] })
        loadAdmins() // Refresh admin list
      } else {
        setMessage({ type: 'error', text: (response as any).error?.message || 'Failed to create admin' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create admin' })
    } finally {
      setCreating(false)
    }
  }

  const handleEditAdmin = (admin: Admin) => {
    setSelectedAdmin(admin)
    setEditAdmin({
      fullName: admin.fullName || '',
      permissions: admin.permissions || [],
    })
    setShowEditModal(true)
  }

  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAdmin) return
    
    setCreating(true)
    setMessage(null)
    
    try {
      const response = await adminApi.system.updateAdmin(selectedAdmin.id, {
        email: selectedAdmin.email,
        ...editAdmin,
      } as UpdateAdminProfileRequest)
      
      if (response.success) {
        setMessage({ type: 'success', text: 'Admin updated successfully' })
        setShowEditModal(false)
        setSelectedAdmin(null)
        loadAdmins() // Refresh admin list
      } else {
        setMessage({ type: 'error', text: (response as any).error?.message || 'Failed to update admin' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update admin' })
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteAdmin = async (adminId: string, adminEmail: string) => {
    if (!confirm(`Are you sure you want to delete admin "${adminEmail}"?`)) {
      return
    }

    try {
      const response = await adminApi.system.deleteAdmin(adminId)
      if (response.success) {
        setMessage({ type: 'success', text: 'Admin deleted successfully' })
        loadAdmins() // Refresh admin list
      } else {
        setMessage({ type: 'error', text: (response as any).error?.message || 'Failed to delete admin' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete admin' })
    }
  }

  // Filter admins based on search term
  const filteredAdmins = admins.filter(admin =>
    admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (admin.fullName && admin.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Administration</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage admin users and system settings
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Admin
        </button>
      </div>

      {/* Alert Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-lg p-4 ${
            message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}
        >
          <div className="flex">
            {message.type === 'success' ? (
              <CheckCircleIcon className="h-5 w-5 text-green-400" />
            ) : (
              <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
            )}
            <p className={`ml-3 text-sm font-medium ${
              message.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {message.text}
            </p>
          </div>
        </motion.div>
      )}

      {/* Admin List */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Admin Users
            </h3>
            <div className="mt-3 sm:mt-0 sm:ml-4">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search admins..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-sm text-gray-500">Loading admins...</p>
            </div>
          ) : (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Admin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAdmins.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                        {searchTerm ? 'No admins found matching your search.' : 'No admins found.'}
                      </td>
                    </tr>
                  ) : (
                    filteredAdmins.map((admin) => (
                      <tr key={admin.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">
                                  {admin.email.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {admin.fullName || 'Not set'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {admin.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            admin.role === 'super_admin' ? 'bg-purple-100 text-purple-800' :
                            admin.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {admin.role.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            admin.status === 'active' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {admin.status?.toUpperCase() || 'ACTIVE'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {admin.lastLoginAt ? 
                            new Date(admin.lastLoginAt).toLocaleDateString() : 
                            'Never'
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEditAdmin(admin)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          {admin.role !== 'super_admin' && (
                            <button
                              onClick={() => handleDeleteAdmin(admin.id, admin.email)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="rounded-lg p-3 bg-blue-100 text-blue-600">
                  <ShieldCheckIcon className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Admin Roles</dt>
                  <dd className="text-sm text-gray-900 mt-1">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <span className="font-semibold">Super Admin:</span>
                        <span className="ml-2 text-gray-600">Full system access</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold">Admin:</span>
                        <span className="ml-2 text-gray-600">Manage customers</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold">Support:</span>
                        <span className="ml-2 text-gray-600">View only access</span>
                      </div>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="rounded-lg p-3 bg-purple-100 text-purple-600">
                  <UserPlusIcon className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Permissions</dt>
                  <dd className="text-sm text-gray-900 mt-1">
                    <div className="flex flex-wrap gap-1">
                      {['view_all', 'manage_customers', 'manage_system'].map((perm) => (
                        <span
                          key={perm}
                          className="inline-flex px-2 py-1 text-xs font-medium rounded bg-purple-100 text-purple-800"
                        >
                          {perm}
                        </span>
                      ))}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Admin Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowCreateModal(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Admin</h3>
              
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    value={newAdmin.role}
                    onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value as any })}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="admin">Admin</option>
                    <option value="support">Support</option>
                  </select>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {creating ? 'Creating...' : 'Create Admin'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}

      {/* Permission Presets Modal */}
      {showPermissionDetails && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowPermissionDetails(false)}
            />
           
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto p-6"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">Permission Presets</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-3">Support Staff</h4>
                  <p className="text-sm text-blue-700 mb-3">View-only access for customer support</p>
                  <div className="space-y-2">
                    {[
                      'view_customers',
                      'view_verification_requests', 
                      'view_pricing',
                      'view_wallet_transactions',
                      'view_dashboard'
                    ].map(perm => (
                      <div key={perm} className="flex items-center text-sm">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                        {AVAILABLE_PERMISSIONS[perm as keyof typeof AVAILABLE_PERMISSIONS]}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setEditAdmin({ ...editAdmin, permissions: ['view_customers', 'view_verification_requests', 'view_pricing', 'view_wallet_transactions', 'view_dashboard'] })
                      setShowPermissionDetails(false)
                    }}
                    className="mt-4 w-full bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 text-sm"
                  >
                    Apply Support Preset
                  </button>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-medium text-purple-900 mb-3">Admin</h4>
                  <p className="text-sm text-purple-700 mb-3">Full access to customer management</p>
                  <div className="space-y-2">
                    {[
                      'view_customers',
                      'create_customers',
                      'edit_customers',
                      'manage_customer_wallet',
                      'view_verification_requests',
                      'approve_verifications',
                      'reject_verifications',
                      'view_pricing',
                      'view_wallet_transactions',
                      'process_refunds',
                      'view_dashboard',
                      'view_system_metrics',
                      'view_usage_analytics'
                    ].map(perm => (
                      <div key={perm} className="flex items-center text-sm">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                        {AVAILABLE_PERMISSIONS[perm as keyof typeof AVAILABLE_PERMISSIONS]}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setEditAdmin({ ...editAdmin, permissions: ['view_customers', 'create_customers', 'edit_customers', 'manage_customer_wallet', 'view_verification_requests', 'approve_verifications', 'reject_verifications', 'view_pricing', 'view_wallet_transactions', 'process_refunds', 'view_dashboard', 'view_system_metrics', 'view_usage_analytics'] })
                      setShowPermissionDetails(false)
                    }}
                    className="mt-4 w-full bg-purple-600 text-white px-3 py-2 rounded-md hover:bg-purple-700 text-sm"
                  >
                    Apply Admin Preset
                  </button>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-900 mb-3">Super Admin</h4>
                  <p className="text-sm text-red-700 mb-3">Complete system control</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {Object.keys(AVAILABLE_PERMISSIONS).map(perm => (
                      <div key={perm} className="flex items-center text-sm">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                        {AVAILABLE_PERMISSIONS[perm as keyof typeof AVAILABLE_PERMISSIONS]}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setEditAdmin({ ...editAdmin, permissions: Object.keys(AVAILABLE_PERMISSIONS) })
                      setShowPermissionDetails(false)
                    }}
                    className="mt-4 w-full bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 text-sm"
                  >
                    Apply Super Admin Preset
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
                <button
                  type="button"
                  onClick={() => setShowPermissionDetails(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Edit Admin Modal */}
      {showEditModal && selectedAdmin && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowEditModal(false)}
            />
           
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Admin</h3>
              
              <form onSubmit={handleUpdateAdmin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={selectedAdmin.email}
                    disabled
                    className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-100 shadow-sm sm:text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editAdmin.fullName || ''}
                    onChange={(e) => setEditAdmin({ ...editAdmin, fullName: e.target.value })}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Permissions
                  </label>
                  <div className="space-y-3 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {Object.entries(PERMISSION_CATEGORIES).map(([category, permissions]) => (
                      <div key={category} className="border-b border-gray-100 last:border-b-0 pb-3 last:pb-0">
                        <button
                          type="button"
                          onClick={() => {
                            const newExpanded = new Set(expandedCategories)
                            if (newExpanded.has(category)) {
                              newExpanded.delete(category)
                            } else {
                              newExpanded.add(category)
                            }
                            setExpandedCategories(newExpanded)
                          }}
                          className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-900 hover:text-gray-600 py-1"
                        >
                          <span>{category}</span>
                          {expandedCategories.has(category) ? (
                            <ChevronUpIcon className="h-4 w-4" />
                          ) : (
                            <ChevronDownIcon className="h-4 w-4" />
                          )}
                        </button>
                        
                        {expandedCategories.has(category) && (
                          <div className="mt-2 space-y-2 pl-4">
                            {permissions.map((permission) => (
                              <label key={permission} className="flex items-start space-x-3 text-sm">
                                <input
                                  type="checkbox"
                                  checked={editAdmin.permissions?.includes(permission) || false}
                                  onChange={(e) => {
                                    const perms = editAdmin.permissions || []
                                    if (e.target.checked) {
                                      setEditAdmin({ ...editAdmin, permissions: [...perms, permission] })
                                    } else {
                                      setEditAdmin({ ...editAdmin, permissions: perms.filter(p => p !== permission) })
                                    }
                                  }}
                                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 mt-0.5"
                                />
                                <div className="flex-1">
                                  <div className="font-medium text-gray-700">
                                    {permission.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {AVAILABLE_PERMISSIONS[permission as keyof typeof AVAILABLE_PERMISSIONS]}
                                  </div>
                                </div>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="mt-3 pt-3 border-t border-gray-200 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditAdmin({ ...editAdmin, permissions: Object.keys(AVAILABLE_PERMISSIONS) })
                      }}
                      className="text-xs px-3 py-1 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditAdmin({ ...editAdmin, permissions: [] })
                      }}
                      className="text-xs px-3 py-1 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
                    >
                      Clear All
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPermissionDetails(true)}
                      className="text-xs px-3 py-1 bg-purple-100 text-purple-800 rounded-md hover:bg-purple-200 flex items-center gap-1"
                    >
                      <FunnelIcon className="h-3 w-3" />
                      Presets
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {creating ? 'Updating...' : 'Update Admin'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminSystem
